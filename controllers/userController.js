const { estNonVide, estEmailValide } = require("../utils/validators");

const users = [
  { id: 1, name: "Aya", email: "aya@gmail.com", role: "Admin" },
  { id: 2, name: "Ahmed", email: "ahmed@gmail.com", role: "Admin" },
  { id: 3, name: "Abderrahmen", email: "abderrahmen@gmail.com", role: "User" },
];

const getAllUsers = (req, res) => {
  const { role } = req.query;
  let resultat = users;
  if (role) {
    // si le client a précisé ?role =...
    resultat = users.filter((a) => a.role === role);
  }
  res.json({ total: resultat.length, users: resultat });
};

const getUserById = (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((a) => a.id === id);
  if (!user) {
    return res.status(404).json({ error: `User ${id} introuvable` });
  }
  res.status(200).json(user);
};

let prochainId = 4;

const createUser = (req, res) => {
  const { name, email, role } = req.body;

  // Vérifier si le nom est vide ou invalide
  if (!estNonVide(name)) {
    return res.status(400).json({
      error: "Le nom est obligatoire et ne doit pas être vide.",
    });
  }

  // Vérifier si l'email est invalide
  if (!estEmailValide(email)) {
    return res.status(400).json({
      error: "L'email est invalide. Il doit contenir @ et un point.",
    });
  }

  // if (!name || !email) {
  //   return res
  //     .status(400)
  //     .json({ error: "Le nom et l'email sont obligatoires " });
  // }

  const nouvelUser = { id: prochainId++, name, email, role };
  users.push(nouvelUser);
  res.status(201).json({ message: "Utilisateur créé", user: nouvelUser });
};

const deleteUser = (req, res) => {
  const id = Number(req.params.id);
  const userExiste = users.some((a) => a.id === id);
  if (!userExiste) {
    return res
      .status(404)
      .json({ error: `Impossible de supprimer : user ${id} introuvable` });
  }
  // On filtre pour ne garder que les users ayant un ID différent
  usersList = users.filter((a) => a.id !== id);
  res.status(200).json({ message: "Utilisateur supprimé avec succès" });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
};
