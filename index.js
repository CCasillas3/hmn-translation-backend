const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

// ── EMPLOYEE LOGINS — ADD/REMOVE STAFF HERE ──────────────────────────────
const EMPLOYEES = [
  { email: 'ccasillas@hermandadmn.com', password: 'Hermandad*1234', name: 'Carlos Casillas' },
  { email: 'employee2@hermandad.org', password: 'password456', name: 'Employee Two' },
];

// ── YOUR ANTHROPIC API KEY ───────────────────────────────────────────────
const API_KEY = process.env.ANTHROPIC_API_KEY;

// ── LOGIN ROUTE ──────────────────────────────────────────────────────────
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const employee = EMPLOYEES.find(e => e.email === email && e.password === password);
  if (employee) {
    res.json({ success: true, name: employee.name });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// ── TRANSLATION ROUTE ────────────────────────────────────────────────────
app.post('/translate', async (req, res) => {
  try {
    const { messages, system } = req.body;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system,
        messages
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('HMN Translation backend running'));
