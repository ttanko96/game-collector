const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// CORS engedélyezése
app.use(cors({ origin: 'http://localhost:5173' }));

// Teszt végpont
app.get('/api', (req, res) => {
  res.json({ message: "Helló a szervertől! 🚀" });
});

app.listen(PORT, () => {
  console.log(`Szerver fut: http://localhost:${PORT}`);
});