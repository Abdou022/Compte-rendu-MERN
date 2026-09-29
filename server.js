const express = require("express"); // 1. charger la bibliothèque Express
const app = express(); // 2. créer l’application : c’est notre serveur
const PORT = process.env.PORT || 3000;
app.use(express.json()); // lit le corps JSON et le range dans req. body

// 3. une route : quand un client demande GET / , Express exécute cette fonction
app.get("/", (req, res) => {
  res.json({ message: " Bonjour , je suis l’API du blog " });
});

//Étape 3 : la liste des articles
// Nos données. Elles reviennent à l’état initial à chaque redé marrage :
// MongoDB les rendra permanentes à la sé ance 3.
const articles = [
  { id: 1, title: "Bienvenue sur le blog", author: "Admin" },
  { id: 2, title: "Mon premier serveur Express", author: "Aya" },
  { id: 3, title: "Tester une API avec Postman", author: "Aya" },
];
// GET / api/ articles -> tous les articles
app.get("/api/articles", (req, res) => {
  res.json({ total: articles.length, articles: articles });
});

//Étape 4 : un seul article
// GET / api/ articles /2 -> l’article dont l’id vaut 2
app.get("/api/articles/:id", (req, res) => {
  const id = Number(req.params.id); // "2" -> 2
  const article = articles.find((a) => a.id === id);
  if (!article) {
    return res.status(404).json({ error: `Article ${id} introuvable` });
  }
  res.json(article);
});

// Étape 5 : filtrer par auteur
// GET / api/ articles -> tous les articles
// GET / api/ articles ? author = Aya -> seulement ceux d’Aya
app.get("/api/articles", (req, res) => {
  const { author } = req.query; // = const author = req. query . author ;
  let resultat = articles;
  if (author) {
    // si le client a précisé ? author =...
    resultat = articles.filter((a) => a.author === author);
  }
  res.json({ total: resultat.length, articles: resultat });
});

//Étape 6 : créer un article avec POST
let prochainId = 4; // le prochain id à attribuer ( les ids 1 , 2 et 3 existent déjà)
app.post("/api/articles", (req, res) => {
  const { title, author } = req.body; // déstructuration (é tape 5)
  if (!title || !author) {
    // validation : les deux champs sont obligatoires
    return res
      .status(400)
      .json({ error: "Le titre et l'auteur sont obligatoires " });
  }
  const nouvelArticle = { id: prochainId, title: title, author: author };
  prochainId = prochainId + 1;
  articles.push(nouvelArticle);
  res.status(201).json({ message: "Article créé", article: nouvelArticle });
});

// Exercice 1:
const users = [
  { id: 1, name: "Aya", email: "aya@gmail.com" },
  { id: 2, name: "Ahmed", email: "ahmed@gmail.com" },
  { id: 3, name: "Abderrahmen", email: "abderrahmen@gmail.com" },
];

// 1. GET /about

app.get("/about", (req, res) => {
  res.json({
    name: "mon-api-blog",
    author: "Abderrahmen Attia",
    version: "1.0.0",
  });
});

// 2. GET /users
app.get("/api/users", (req, res) => {
  res.json({ total: users.length, users: users });
});

// 3. GET /users/:id
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);

  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({
      message: `Utilisateur ${id} non trouvé`,
    });
  }

  res.json(user);
});

// 4. POST /contact

app.post("/contact", (req, res) => {
  const { email, message } = req.body;

  // Vérifier si un champ manque
  if (!email || !message) {
    return res.status(400).json({
      message: "Email et message sont obligatoires",
    });
  }

  res.status(200).json({
    message: "Merci, votre message a bien été reçu",
  });
});

// 5. GET /api/users?author=Aya -> seulement ceux d’Aya
app.get("/api/users", (req, res) => {
  const { name } = req.query;
  let resultat = users;
  if (name) {
    // si le client a précisé ? author =...
    resultat = users.filter((a) => a.name === name);
  }
  res.json({ total: resultat.length, users: resultat });
});

// 4. démarrer le serveur : il attend les requ ê tes sur le port 3000
app.listen(PORT, () => {
  console.log(`Serveur disponible sur http://localhost:${PORT}`);
});
