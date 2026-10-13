const User = require("../models/userModel");
const Article = require("../models/articleModel");

// 1. Créer un nouvel utilisateur ( POST / api/ users )
const createUser = async (req, res) => {
  try {
    const { name, email, age, role, bio, phone } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Le nom et l'email sont requis" });
    }
    // Vérification de doublon d’email
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Cet email est deja utilise" });
    }
    const user = await User.create({ name, email, age, role, bio, phone });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// 2. Obtenir tous les utilisateurs ( GET / api/ users )
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// 3. Obtenir un utilisateur par son identifiant ( GET /api/ users /: id)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouve" });
    }
    res.status(200).json(user);
  } catch (err) {
    if(err.name === 'CastError')
      res.status(400).json({ message: "Identifiant de ressource invalide ( format ObjectId attendu )" });
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Vérifier si l'utilisateur existe
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouve" });
    }

    // 2. Vérifier si l'utilisateur possède des articles
    const article = await Article.findOne({ author: id });

    if (article) {
      return res.status(400).json({
        message:
          "Impossible de supprimer un utilisateur ayant des articles publies",
      });
    }

    // 3. Supprimer l'utilisateur
    await User.findByIdAndDelete(id);

    // 4. Confirmer la suppression
    return res.status(200).json({
      message: "Utilisateur supprimé avec succès",
      user,
    });
  } catch (error) {
    if(err.name === 'CastError')
      res.status(400).json({ message: "Identifiant de ressource invalide ( format ObjectId attendu )" });
    return res.status(500).json({
      message: "Erreur lors de la suppression de l'utilisateur",
      error: error.message,
    });
  }
};
module.exports = { createUser, getUsers, getUserById, deleteUser };

// const { estNonVide, estEmailValide } = require("../utils/validators");

// const users = [
//   { id: 1, name: "Aya", email: "aya@gmail.com", role: "Admin" },
//   { id: 2, name: "Ahmed", email: "ahmed@gmail.com", role: "Admin" },
//   { id: 3, name: "Abderrahmen", email: "abderrahmen@gmail.com", role: "User" },
// ];

// const getAllUsers = (req, res) => {
//   const { role } = req.query;
//   let resultat = users;
//   if (role) {
//     // si le client a précisé ?role =...
//     resultat = users.filter((a) => a.role === role);
//   }
//   res.json({ total: resultat.length, users: resultat });
// };

// const getUserById = (req, res) => {
//   const id = Number(req.params.id);
//   const user = users.find((a) => a.id === id);
//   if (!user) {
//     return res.status(404).json({ error: `User ${id} introuvable` });
//   }
//   res.status(200).json(user);
// };

// let prochainId = 4;

// const createUser = (req, res) => {
//   const { name, email, role } = req.body;

//   // Vérifier si le nom est vide ou invalide
//   if (!estNonVide(name)) {
//     return res.status(400).json({
//       error: "Le nom est obligatoire et ne doit pas être vide.",
//     });
//   }

//   // Vérifier si l'email est invalide
//   if (!estEmailValide(email)) {
//     return res.status(400).json({
//       error: "L'email est invalide. Il doit contenir @ et un point.",
//     });
//   }

//   // if (!name || !email) {
//   //   return res
//   //     .status(400)
//   //     .json({ error: "Le nom et l'email sont obligatoires " });
//   // }

//   const nouvelUser = { id: prochainId++, name, email, role };
//   users.push(nouvelUser);
//   res.status(201).json({ message: "Utilisateur créé", user: nouvelUser });
// };

// const deleteUser = (req, res) => {
//   const id = Number(req.params.id);
//   const userExiste = users.some((a) => a.id === id);
//   if (!userExiste) {
//     return res
//       .status(404)
//       .json({ error: `Impossible de supprimer : user ${id} introuvable` });
//   }
//   // On filtre pour ne garder que les users ayant un ID différent
//   usersList = users.filter((a) => a.id !== id);
//   res.status(200).json({ message: "Utilisateur supprimé avec succès" });
// };

// module.exports = {
//   getAllUsers,
//   getUserById,
//   createUser,
//   deleteUser,
// };
