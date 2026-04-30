const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

const EMPLOYEES = [
  { email: 'ccasillas@hermandadmn.com', password: 'Hermandad*1234', name: 'Carlos Casillas', office: 'Compton' },
];

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const employee = EMPLOYEES.find(e => e.email === email && e.password === password);
  if (employee) return res.json({ success: true, name: employee.name, office: employee.office });
  return res.status(401).json({ success: false });
});

app.post('/translate', async (req, res) => {
  try {
    const { messages, system } = req.body;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, system, messages })
    });
    const data = await response.json();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = app;
