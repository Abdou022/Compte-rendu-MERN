const express = require("express"); // 1. charger la bibliothèque Express
const app = express(); // 2. créer l’application : c’est notre serveur
const PORT = process.env.PORT || 3000;

// 3. une route : quand un client demande GET / , Express exécute cette fonction
app.get("/", (req, res) => {
  res.json({ message: " Bonjour , je suis l’API du blog " });
});

// 4. démarrer le serveur : il attend les requ ê tes sur le port 3000
app.listen(PORT, () => {
  console.log(`Serveur disponible sur http://localhost:${PORT}`);
});
