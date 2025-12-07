// Vercel Serverless Function - Proxies requests to OpenAI API
// This keeps your API key SECRET!

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { subject, question } = req.body;

    // Your API key is safe here (stored in Vercel environment variables)
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'system',
                    content: `You are a helpful ${subject} tutor for 5th grade students. Explain clearly and simply.`
                }, {
                    role: 'user',
                    content: question
                }],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(400).json({ error: data.error.message });
        }

        return res.status(200).json({
            answer: data.choices[0].message.content
        });

    } catch (error) {
        return res.status(500).json({ error: 'Failed to get response' });
    }
}
