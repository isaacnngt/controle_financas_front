const express = require('express');
const path = require('path');
const app = express();

// Serve arquivos estáticos da build
app.use(express.static(path.join(__dirname, 'build')));

// Rota para SPA - todas as rotas vão para index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 Frontend React rodando na porta ${port}`);
});