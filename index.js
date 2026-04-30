const fetch = require('node-fetch');

const EMPLOYEES = [
  { email: 'ccasillas@hermandadmn.com', password: 'Hermandad*1234', name: 'Carlos Casillas', office: 'Compton' },
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const path = req.url.split('?')[0];

  if (path === '/login' && req.method === 'POST') {
    const { email, password } = req.body;
    const employee = EMPLOYEES.find(e => e.email === email && e.password === password);
    if (employee) return res.json({ success: true, name: employee.name, office: employee.office });
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  if (path === '/translate' && req.method === 'POST') {
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
  }

  if (path === '/health') return res.json({ status: 'ok' });

  res.status(404).json({ error: 'Not found' });
};
