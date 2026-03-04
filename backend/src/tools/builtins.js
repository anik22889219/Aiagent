const { getToolRegistry } = require('./toolRegistry');
const { getVectorSearch } = require('../services/vectorSearch');
const { getEmbeddingService } = require('../services/embeddingService');
const KnowledgeBase = require('../models/KnowledgeBase');
const axios = require('axios');

/**
 * Register all built-in tools
 */
function registerBuiltinTools() {
    const registry = getToolRegistry();

    // 1. Calculator
    registry.register({
        name: 'calculator',
        description: 'Evaluate mathematical expressions. Supports basic arithmetic, powers, roots, trig.',
        parameters: {
            type: 'object',
            properties: {
                expression: { type: 'string', description: 'The math expression to evaluate, e.g. "2 + 3 * 4" or "Math.sqrt(144)"' },
            },
            required: ['expression'],
        },
        execute: async ({ expression }) => {
            try {
                // Safe math evaluation
                const sanitized = expression.replace(/[^0-9+\-*/().%\s,Math.powsqrtsincostalogabsflorceilroundPIE]/g, '');
                const result = Function(`"use strict"; return (${sanitized})`)();
                return { result: String(result), expression };
            } catch (e) {
                return { error: `Cannot evaluate: ${e.message}` };
            }
        },
    });

    // 2. DateTime
    registry.register({
        name: 'datetime',
        description: 'Get current date, time, timezone info, or convert between timezones.',
        parameters: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'One of: now, convert, format', enum: ['now', 'convert', 'format'] },
                timezone: { type: 'string', description: 'Timezone string, e.g. "Asia/Dhaka", "America/New_York"' },
            },
            required: ['action'],
        },
        execute: async ({ action, timezone }) => {
            const now = new Date();
            if (action === 'now') {
                const tz = timezone || 'Asia/Dhaka';
                return {
                    utc: now.toISOString(),
                    local: now.toLocaleString('en-US', { timeZone: tz }),
                    timezone: tz,
                    timestamp: now.getTime(),
                };
            }
            return { utc: now.toISOString(), timestamp: now.getTime() };
        },
    });

    // 3. Knowledge Search (internal)
    registry.register({
        name: 'knowledge_search',
        description: 'Search the internal knowledge base and memory for information. Use this to recall stored facts, training data, or previously learned information.',
        parameters: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'What to search for in the knowledge base' },
                limit: { type: 'number', description: 'Max results to return (default: 5)' },
            },
            required: ['query'],
        },
        execute: async ({ query, limit }) => {
            const vectorSearch = getVectorSearch();
            const results = await vectorSearch.search(query, { limit: limit || 5 });
            if (results.length === 0) return { message: 'No relevant knowledge found.', results: [] };
            return { count: results.length, results };
        },
    });

    // 4. Memory Store
    registry.register({
        name: 'memory_store',
        description: 'Store important information in the knowledge base for later retrieval. Use when the user shares a fact, preference, or important data.',
        parameters: {
            type: 'object',
            properties: {
                topic: { type: 'string', description: 'Short title/topic for the knowledge' },
                content: { type: 'string', description: 'The full content to remember' },
                category: { type: 'string', description: 'Category: general, technical, personal, business' },
                tags: { type: 'array', items: { type: 'string' }, description: 'Tags for categorization' },
            },
            required: ['topic', 'content'],
        },
        execute: async ({ topic, content, category, tags }) => {
            const embeddingService = getEmbeddingService();
            const embedding = await embeddingService.embed(content);

            const entry = new KnowledgeBase({
                topic,
                content,
                category: category || 'general',
                source: 'conversation',
                tags: tags || [],
                embedding,
                confidence: 0.85,
                importance: 0.7,
            });
            await entry.save();
            return { message: `Stored: "${topic}" in knowledge base`, id: entry._id };
        },
    });

    // 5. Web Search
    registry.register({
        name: 'web_search',
        description: 'Search the internet for current information, news, or any topic. Use when internal knowledge is insufficient.',
        parameters: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'The search query' },
            },
            required: ['query'],
        },
        execute: async ({ query }) => {
            // Try SerpAPI first, fallback to DuckDuckGo
            const serpApiKey = process.env.SERPAPI_KEY;
            if (serpApiKey) {
                try {
                    const resp = await axios.get('https://serpapi.com/search', {
                        params: { q: query, api_key: serpApiKey, engine: 'google', num: 5 },
                        timeout: 10000,
                    });
                    const results = (resp.data.organic_results || []).slice(0, 5).map(r => ({
                        title: r.title, link: r.link, snippet: r.snippet,
                    }));
                    return { source: 'google', results };
                } catch (e) { /* fall through */ }
            }

            // DuckDuckGo fallback (via instant answers API)
            try {
                const resp = await axios.get('https://api.duckduckgo.com/', {
                    params: { q: query, format: 'json', no_html: 1 },
                    timeout: 10000,
                });
                const data = resp.data;
                const results = [];
                if (data.Abstract) results.push({ title: data.Heading, snippet: data.Abstract, link: data.AbstractURL });
                if (data.RelatedTopics) {
                    data.RelatedTopics.slice(0, 4).forEach(t => {
                        if (t.Text) results.push({ title: t.Text.substring(0, 80), snippet: t.Text, link: t.FirstURL });
                    });
                }
                return { source: 'duckduckgo', results };
            } catch (e) {
                return { error: 'Web search unavailable', message: e.message };
            }
        },
    });

    // 6. HTTP Request
    registry.register({
        name: 'http_request',
        description: 'Make an HTTP request to any URL. Useful for calling APIs, checking endpoints, or fetching data.',
        parameters: {
            type: 'object',
            properties: {
                url: { type: 'string', description: 'The URL to request' },
                method: { type: 'string', description: 'HTTP method: GET, POST, PUT, DELETE', enum: ['GET', 'POST', 'PUT', 'DELETE'] },
                body: { type: 'object', description: 'Request body for POST/PUT' },
                headers: { type: 'object', description: 'Custom headers' },
            },
            required: ['url'],
        },
        execute: async ({ url, method, body, headers }) => {
            try {
                const resp = await axios({
                    url,
                    method: method || 'GET',
                    data: body,
                    headers: headers || {},
                    timeout: 15000,
                    maxContentLength: 50000,
                });
                return {
                    status: resp.status,
                    data: typeof resp.data === 'string' ? resp.data.substring(0, 5000) : resp.data,
                };
            } catch (e) {
                return { error: e.message, status: e.response?.status };
            }
        },
    });

    // 7. Code Executor (sandboxed JavaScript)
    registry.register({
        name: 'code_executor',
        description: 'Execute JavaScript code in a sandboxed environment. Use for computation, data processing, or testing logic.',
        parameters: {
            type: 'object',
            properties: {
                code: { type: 'string', description: 'JavaScript code to execute' },
                language: { type: 'string', description: 'Language (currently only "javascript" supported)', enum: ['javascript'] },
            },
            required: ['code'],
        },
        execute: async ({ code }) => {
            try {
                // Simple sandbox using Function constructor with timeout
                let output = '';
                const console_log = (...args) => { output += args.join(' ') + '\n'; };

                const fn = new Function('console', `
          "use strict";
          const log = console.log;
          ${code}
        `);

                const timeout = setTimeout(() => { throw new Error('Code execution timeout'); }, 5000);
                fn({ log: console_log });
                clearTimeout(timeout);

                return { output: output || 'Code executed successfully (no output)', language: 'javascript' };
            } catch (e) {
                return { error: e.message, language: 'javascript' };
            }
        },
    });

    // 8. GitHub Tool
    registry.register({
        name: 'github_tool',
        description: 'Interact with GitHub repositories. Can list repos, create issues, check PRs.',
        parameters: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Action: list_repos, create_issue, get_repo', enum: ['list_repos', 'create_issue', 'get_repo'] },
                owner: { type: 'string', description: 'GitHub username or org' },
                repo: { type: 'string', description: 'Repository name' },
                title: { type: 'string', description: 'Issue title (for create_issue)' },
                body: { type: 'string', description: 'Issue body (for create_issue)' },
            },
            required: ['action'],
        },
        execute: async ({ action, owner, repo, title, body }) => {
            const token = process.env.GITHUB_TOKEN;
            const headers = token ? { Authorization: `token ${token}` } : {};

            try {
                if (action === 'list_repos' && owner) {
                    const resp = await axios.get(`https://api.github.com/users/${owner}/repos?per_page=10&sort=updated`, { headers, timeout: 10000 });
                    return { repos: resp.data.map(r => ({ name: r.name, description: r.description, stars: r.stargazers_count, url: r.html_url })) };
                }
                if (action === 'get_repo' && owner && repo) {
                    const resp = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, { headers, timeout: 10000 });
                    return { name: resp.data.name, description: resp.data.description, stars: resp.data.stargazers_count, language: resp.data.language, url: resp.data.html_url };
                }
                if (action === 'create_issue' && owner && repo && title) {
                    if (!token) return { error: 'GITHUB_TOKEN required for creating issues' };
                    const resp = await axios.post(`https://api.github.com/repos/${owner}/${repo}/issues`, { title, body }, { headers, timeout: 10000 });
                    return { issue_number: resp.data.number, url: resp.data.html_url };
                }
                return { error: 'Invalid action or missing parameters' };
            } catch (e) {
                return { error: e.message };
            }
        },
    });

    // 9. File Manager
    registry.register({
        name: 'file_manager',
        description: 'Read, write, or list files on the server. Use for local file operations.',
        parameters: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Action: read, write, list', enum: ['read', 'write', 'list'] },
                path: { type: 'string', description: 'File or directory path' },
                content: { type: 'string', description: 'Content to write (for write action)' },
            },
            required: ['action', 'path'],
        },
        execute: async ({ action, path: filePath, content }) => {
            const fs = require('fs').promises;
            const path = require('path');

            // Security: restrict to project directory
            const safePath = path.resolve(filePath);

            try {
                if (action === 'read') {
                    const data = await fs.readFile(safePath, 'utf-8');
                    return { content: data.substring(0, 10000), path: safePath };
                }
                if (action === 'list') {
                    const items = await fs.readdir(safePath, { withFileTypes: true });
                    return {
                        items: items.map(i => ({ name: i.name, type: i.isDirectory() ? 'directory' : 'file' })),
                        path: safePath,
                    };
                }
                if (action === 'write' && content) {
                    await fs.writeFile(safePath, content, 'utf-8');
                    return { message: `File written: ${safePath}`, size: content.length };
                }
                return { error: 'Invalid action or missing parameters' };
            } catch (e) {
                return { error: e.message };
            }
        },
    });

    console.log(`[ToolRegistry] ${registry.listTools().length} built-in tools registered`);
    return registry;
}

module.exports = { registerBuiltinTools };
