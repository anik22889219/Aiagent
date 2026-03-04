const { v4: uuidv4 } = require('uuid');

const CATEGORY_KEYWORDS = [
  { category: 'Automation', keywords: ['workflow', 'n8n', 'deploy', 'cron', 'schedule', 'webhook', 'trigger'] },
  { category: 'Research', keywords: ['analyze', 'research', 'summarize', 'summary', 'competitor', 'report'] },
  { category: 'Code', keywords: ['fix', 'bug', 'docker', 'endpoint', 'api', 'refactor', 'optimize'] },
  { category: 'Marketing', keywords: ['ad', 'facebook', 'campaign', 'seo', 'copy', 'landing'] }
];

function pickCategory(command) {
  const lower = command.toLowerCase();
  for (const c of CATEGORY_KEYWORDS) {
    for (const kw of c.keywords) {
      if (lower.includes(kw)) return c.category;
    }
  }
  return 'Research';
}

function estimatePriority(command, context) {
  const urgentWords = ['urgent', 'now', 'asap', 'critical', 'important'];
  const lower = (command + ' ' + (context || '')).toLowerCase();
  if (urgentWords.some(w => lower.includes(w))) return 'High';
  if (lower.length > 200) return 'Medium';
  return 'Low';
}

function mapAgent(category) {
  switch (category) {
    case 'Automation': return 'automation-agent';
    case 'Research': return 'research-agent';
    case 'Code': return 'dev-agent';
    case 'Marketing': return 'marketing-agent';
    default: return 'research-agent';
  }
}

function generatePlan(category, command) {
  // Lightweight template-based plans. Real LLM can replace/enhance this.
  switch (category) {
    case 'Automation':
      return [
        'Validate trigger and credentials',
        'Map workflow steps to internal actions',
        'Schedule or trigger workflow',
        'Return execution receipt'
      ];
    case 'Research':
      return [
        'Gather relevant sources',
        'Extract key facts',
        'Summarize findings',
        'Return references'
      ];
    case 'Code':
      return [
        'Reproduce the issue locally',
        'Run tests and linters',
        'Propose code changes',
        'Create patch or PR'
      ];
    case 'Marketing':
      return [
        'Analyze current campaign metrics',
        'Identify weak audiences',
        'Recommend targeting and copy changes',
        'Generate new ad variants'
      ];
    default:
      return ['Assess task', 'Produce plan', 'Return plan'];
  }
}

async function classifyAndPlan(payload) {
  const { user_id, command, context } = payload;
  const task_id = 'task_' + uuidv4().split('-')[0];
  const category = pickCategory(command || '');
  const priority = estimatePriority(command || '', context || '');
  const agent_target = mapAgent(category);
  const execution_plan = generatePlan(category, command || '');

  // risk heuristic
  const risk_level = (command || '').toLowerCase().includes('delete') ? 'High' : 'Low';
  const requires_confirmation = risk_level === 'High' || (priority === 'High' && Math.random() < 0.25);

  return {
    task_id,
    category,
    priority,
    agent_target,
    execution_plan,
    risk_level,
    requires_confirmation
  };
}

module.exports = { classifyAndPlan };
