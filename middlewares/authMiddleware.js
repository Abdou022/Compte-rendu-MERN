const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
// 1. Protection des routes privees : verifie la validite du JWT
const protect = async (req, res, next) => {
  let token;
  // Verification de la presence de l’en-tete Authorization avec Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extraction du token ( apres " Bearer ")
      token = req.headers.authorization.split(" ")[1];
      // Verification cryptographique de la signature avec le secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Recuperation de l’ utilisateur associe ( exclusion du mot de passe )
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Non autorisé , utilisateur introuvable" });
      }
      // Passage au middleware ou controleur suivant
      return next();
    } catch (err) {
      // Vérifier si le token a expiré
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Votre session a expire, veuillez vous reconnecter",
        });
      }
      return res
        .status(401)
        .json({ message: "Non autorisé , token invalide ou expiré" });
    }
  }
  // Si aucun en-tete Authorization n’est fourni
  return res.status(401).json({ message: "Non autorisé , aucun token fourni" });
};
// 2. Controle d’acces base sur les roles ( RBAC ) : reserve aux admins
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Acces refusé : droits administrateur requis" });
};
module.exports = { protect, adminOnly };
