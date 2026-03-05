const { spawn } = require('child_process');
const path = require('path');

const EXECUTION_DIR = path.join(__dirname, '../../../../execution');

// Helper to run python script
const runPythonScript = (scriptName, args) => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(EXECUTION_DIR, scriptName);

        // Build arguments array
        const spawnArgs = [scriptPath];
        for (const [key, value] of Object.entries(args)) {
            if (value !== undefined && value !== null) {
                spawnArgs.push(`--${key}`);
                if (typeof value !== 'boolean') {
                    spawnArgs.push(value.toString());
                }
            }
        }

        const pythonProcess = spawn('python', spawnArgs);

        let outputData = '';
        let errorData = '';

        pythonProcess.stdout.on('data', (data) => {
            outputData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorData += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`Python script ${scriptName} exited with code ${code}: ${errorData}`);

                // Try to parse error output as JSON, if possible
                try {
                    const errJson = JSON.parse(outputData || errorData);
                    return reject(new Error(errJson.message || 'Execution script failed'));
                } catch (e) {
                    return reject(new Error(errorData || `Execution script failed with code ${code}`));
                }
            }

            try {
                const result = JSON.parse(outputData);
                resolve(result);
            } catch (error) {
                console.error('Failed to parse Python output:', outputData);
                reject(new Error('Invalid response from execution script'));
            }
        });
    });
};

exports.postToLinkedIn = async (req, res) => {
    try {
        const { content, media_url, test } = req.body;
        if (!content) {
            return res.status(400).json({ status: 'error', message: 'Content is required' });
        }

        const result = await runPythonScript('linkedin_post.py', {
            content,
            ...(media_url && { media_url }),
            ...(test && { test: true })
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.generateImage = async (req, res) => {
    try {
        const { prompt, aspect_ratio, test } = req.body;
        if (!prompt) {
            return res.status(400).json({ status: 'error', message: 'Prompt is required' });
        }

        const result = await runPythonScript('generate_image.py', {
            prompt,
            ...(aspect_ratio && { aspect_ratio }),
            ...(test && { test: true })
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.generateVideo = async (req, res) => {
    try {
        const { prompt, image_url, test } = req.body;
        if (!prompt) {
            return res.status(400).json({ status: 'error', message: 'Prompt is required' });
        }

        const result = await runPythonScript('generate_video.py', {
            prompt,
            ...(image_url && { image_url }),
            ...(test && { test: true })
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.rechargeCredits = async (req, res) => {
    try {
        const { amount, payment_method, test } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ status: 'error', message: 'Valid amount is required' });
        }
        if (!payment_method) {
            return res.status(400).json({ status: 'error', message: 'Payment method is required' });
        }

        const result = await runPythonScript('recharge_credits.py', {
            amount,
            payment_method,
            ...(test && { test: true })
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
