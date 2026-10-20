const Article = require("../models/articleModel");
const User = require("../models/userModel");

// 1. Récupérer tous les articles avec les données complètes de l’auteur
const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().populate("author", "name email");
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/articles ( Creation protegee )
const createArticle = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Titre et contenu obligatoires" });
    }
    // L’auteur est extrait du token verifie : usurpation impossible !
    const newArticle = await Article.create({
      title,
      content,
      author: req.user._id,
    });
    const populated = await newArticle.populate("author", "name email role");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/articles/:id ( Modification protegee : auteur ou admin )
const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article non trouveé" });
    }
    // Verification des droits de propriete
    if (
      article.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Action interdite : vous n' etes pas l' auteur de cet article",
      });
    }
    article.title = req.body.title || article.title;
    article.content = req.body.content || article.content;
    const updated = await article.save();
    const populated = await updated.populate("author", "name email role");
    res.status(200).json(populated);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Identifiant invalide" });
    }
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/articles/:id ( Suppression protegee : auteur ou admin )
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article non trouve" });
    }
    if (
      article.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Action interdite : vous n' etes pas l' auteur de cet article",
      });
    }
    await Article.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "Article supprime avec succés", id: req.params.id });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Identifiant invalide" });
    }
    res.status(500).json({ message: err.message });
  }
};
// 2. Créer un nouvel article lié à un auteur
// const createArticle = async (req, res) => {
//   try {
//     const { title, content, authorId } = req.body;
//     if (!title || !content || !authorId) {
//       return res
//         .status(400)
//         .json({ message: "title , content et authorId sont obligatoires" });
//     }
//     // Vérifier l’existence réelle de l’auteur dans la collection ’users’
//     const author = await User.findById(authorId);
//     if (!author) {
//       return res
//         .status(404)
//         .json({
//           message: "Auteur non trouve ( identifiant authorId invalide )",
//         });
//     }
//     const newArticle = await Article.create({
//       title,
//       content,
//       author: authorId,
//     });
//     const populatedArticle = await newArticle.populate("author", "name email");
//     res.status(201).json(populatedArticle);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// 3. Récupérer un article unique par son ID
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate(
      "author",
      "name email",
    );
    if (!article) {
      return res.status(404).json({ message: "Article non trouve" });
    }
    res.status(200).json(article);
  } catch (err) {
    if (err.name === "CastError")
      res.status(400).json({
        message:
          "Identifiant de ressource invalide ( format ObjectId attendu )",
      });
    res.status(500).json({ message: err.message });
  }
};

const getMyArticles = async (req, res) => {
  try {
    const articles = await Article.find({
      author: req.user._id,
    });

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de vos articles",
      error: error.message,
    });
  }
};

module.exports = {
  getAllArticles,
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  getMyArticles,
};
// 4. Mettre à jour un article (PUT /api/articles/:id)
// const updateArticle = async (req, res) => {
//   try {
//     const article = await Article.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }, // Renvoie le doc mis à jour et valide le schéma
//     );
//     if (!article) {
//       return res
//         .status(404)
//         .json({ message: "Article introuvable pour la mise a jour" });
//     }
//     const populated = await article.populate("author", "name email");
//     res.status(200).json(populated);
//   } catch (err) {
//     if (err.name === "CastError")
//       res
//         .status(400)
//         .json({
//           message:
//             "Identifiant de ressource invalide ( format ObjectId attendu )",
//         });
//     res.status(500).json({ message: err.message });
//   }
// };
// 5. Supprimer un article (DELETE /api/articles/:id)
// const deleteArticle = async (req, res) => {
//   try {
//     const article = await Article.findByIdAndDelete(req.params.id);
//     if (!article) {
//       return res
//         .status(404)
//         .json({ message: "Article introuvable pour la suppression" });
//     }
//     res
//       .status(200)
//       .json({ message: "Article supprime avec succes", id: req.params.id });
//   } catch (err) {
//     if (err.name === "CastError")
//       res.status(400).json({
//         message:
//           "Identifiant de ressource invalide ( format ObjectId attendu )",
//       });
//     res.status(500).json({ message: err.message });
//   }
//};

// // Données isolées dans le contrôleur (en mémoire pour cette séance )
// let articles = [
//   { id: 1, title: "Bienvenue sur le blog", author: "Admin" },
//   { id: 2, title: "Mon premier serveur Express", author: "Aya" },
//   { id: 3, title: "Tester une API avec Postman", author: "Aya" },
// ];
// let prochainId = 4;
// // 1. Récupérer tous les articles ( avec filtre optionnel ? author =...)
// const getAllArticles = (req, res) => {
//   const { author } = req.query;
//   let resultat = articles;
//   if (author) {
//     resultat = articles.filter((a) => a.author === author);
//   }
//   res.status(200).json({ total: resultat.length, articles: resultat });
// };

// // 2. Récupérer un article par son ID unique
// const getArticleById = (req, res) => {
//   const id = Number(req.params.id);
//   const article = articles.find((a) => a.id === id);
//   if (!article) {
//     return res.status(404).json({ error: `Article ${id} introuvable` });
//   }
//   res.status(200).json(article);
// };
// // 3. Créer un nouvel article
// const createArticle = (req, res) => {
//   const { title, author } = req.body;
//   if (!title || !author) {
//     return res
//       .status(400)
//       .json({ error: "Le titre et l'auteur sont obligatoires " });
//   }
//   const nouvelArticle = { id: prochainId++, title, author };
//   articles.push(nouvelArticle);
//   res.status(201).json({ message: "Article créé", article: nouvelArticle });
// };

// // 4. Mettre à jour un article existant (PUT /api/articles/:id)
// const updateArticle = (req, res) => {
//   const id = Number(req.params.id);
//   const { title, author } = req.body;
//   // On recherche l’index de l’article dans le tableau
//   const index = articles.findIndex((a) => a.id === id);
//   if (index === -1) {
//     return res.status(404).json({ error: `Article ${id} introuvable` });
//   }
//   // Mise à jour partielle ou totale
//   if (title) articles[index].title = title;
//   if (author) articles[index].author = author;
//   res
//     .status(200)
//     .json({ message: "Article mis à jour", article: articles[index] });
// };

// // 5. Supprimer un article ( DELETE /api/articles/:id)
// const deleteArticle = (req, res) => {
//   const id = Number(req.params.id);
//   const articleExiste = articles.some((a) => a.id === id);
//   if (!articleExiste) {
//     return res
//       .status(404)
//       .json({ error: `Impossible de supprimer : article ${id} introuvable` });
//   }
//   // On filtre pour ne garder que les articles ayant un ID différent
//   articles = articles.filter((a) => a.id !== id);
//   res.status(200).json({ message: `Article ${id} supprimé avec succès` });
// };

// // Exportation CommonJS : on rend ces fonctions publiques
// module.exports = {
//   getAllArticles,
//   getArticleById,
//   createArticle,
//   updateArticle,
//   deleteArticle,
// };
