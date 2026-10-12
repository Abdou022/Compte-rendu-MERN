// Données isolées dans le contrôleur (en mémoire pour cette séance )
let articles = [
  { id: 1, title: "Bienvenue sur le blog", author: "Admin" },
  { id: 2, title: "Mon premier serveur Express", author: "Aya" },
  { id: 3, title: "Tester une API avec Postman", author: "Aya" },
];
let prochainId = 4;
// 1. Récupérer tous les articles ( avec filtre optionnel ? author =...)
const getAllArticles = (req, res) => {
  const { author } = req.query;
  let resultat = articles;
  if (author) {
    resultat = articles.filter((a) => a.author === author);
  }
  res.status(200).json({ total: resultat.length, articles: resultat });
};

// 2. Récupérer un article par son ID unique
const getArticleById = (req, res) => {
  const id = Number(req.params.id);
  const article = articles.find((a) => a.id === id);
  if (!article) {
    return res.status(404).json({ error: `Article ${id} introuvable` });
  }
  res.status(200).json(article);
};
// 3. Créer un nouvel article
const createArticle = (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res
      .status(400)
      .json({ error: "Le titre et l'auteur sont obligatoires " });
  }
  const nouvelArticle = { id: prochainId++, title, author };
  articles.push(nouvelArticle);
  res.status(201).json({ message: "Article créé", article: nouvelArticle });
};

// 4. Mettre à jour un article existant (PUT /api/articles/:id)
const updateArticle = (req, res) => {
  const id = Number(req.params.id);
  const { title, author } = req.body;
  // On recherche l’index de l’article dans le tableau
  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: `Article ${id} introuvable` });
  }
  // Mise à jour partielle ou totale
  if (title) articles[index].title = title;
  if (author) articles[index].author = author;
  res
    .status(200)
    .json({ message: "Article mis à jour", article: articles[index] });
};

// 5. Supprimer un article ( DELETE /api/articles/:id)
const deleteArticle = (req, res) => {
  const id = Number(req.params.id);
  const articleExiste = articles.some((a) => a.id === id);
  if (!articleExiste) {
    return res
      .status(404)
      .json({ error: `Impossible de supprimer : article ${id} introuvable` });
  }
  // On filtre pour ne garder que les articles ayant un ID différent
  articles = articles.filter((a) => a.id !== id);
  res.status(200).json({ message: `Article ${id} supprimé avec succès` });
};

// Exportation CommonJS : on rend ces fonctions publiques
module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
