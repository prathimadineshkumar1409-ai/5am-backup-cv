const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const PORT = process.env.PORT || 3001;

app.post('/api/gemini-analyze', async (req, res) => {
  try {
    const { level, course, missed, totalQuestions } = req.body || {};

    // Build a human prompt from the missed questions
    const promptParts = [];
    promptParts.push(`You are an expert learning coach. A learner completed a ${course} quiz for level ${level}.`);
    promptParts.push(`Total questions: ${totalQuestions}. Missed questions:`);
    if (!Array.isArray(missed) || missed.length === 0) {
      // No mistakes: return a short positive response
      return res.json({ recommendations: [`No mistakes detected. Continue to the next activity and keep practicing.`] });
    }

    missed.forEach((m, i) => {
      promptParts.push(`${i + 1}. Q${m.index + 1}: ${m.question || '[no question]'} (topic: ${m.topic || 'unknown'})`);
    });

    promptParts.push('Provide a concise list (3) of specific study actions the learner should take to fix these mistakes, and 2 quick practice suggestions (one short exercise and one resource). Return only plaintext.');

    const prompt = promptParts.join('\n');

    if (!OPENAI_API_KEY) {
      // Fallback deterministic analysis
      const simple = missed.map(m => `Review topic: ${m.topic || 'Related concept'}. Revisit examples and practice problems.`);
      const recs = [
        ...simple.slice(0, 3),
        'Practice: Solve 3 short problems focusing on the missed subtopics.',
        'Resource: Rewatch the level video and redo the concept exercises.'
      ];
      return res.json({ recommendations: recs });
    }

    // Call OpenAI chat completions (compatible with the OpenAI API key). This is a simple example using the v1/chat/completions endpoint.
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a concise learning coach. Provide 3 specific study actions and 2 practice suggestions.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 400,
      temperature: 0.2
    }, {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const text = response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].message && response.data.choices[0].message.content;
    if (text) {
      // Split into lines and return as recommendations for front-end rendering
      const recs = text.split('\n').map(s => s.trim()).filter(Boolean);
      return res.json({ recommendations: recs });
    }

    return res.status(500).json({ error: 'No content from AI' });
  } catch (err) {
    console.error('Analyzer error', err && err.message);
    return res.status(500).json({ error: err && err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Gemini proxy listening on http://localhost:${PORT}`);
  if (!OPENAI_API_KEY) console.log('No OPENAI_API_KEY set — running in fallback mode.');
});
