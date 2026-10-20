const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect , adminOnly } = require ('../middlewares/authMiddleware');


// Routes d’ authentification publiques
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Route privee protegee par Token JWT
router.get('/profile',protect, userController.getUserProfile) ;

// Route reservee aux administrateurs ( JWT valide + role admin requis )
router.get('/', protect, adminOnly, userController.getAllUsers ) ;

// Route privéee pour changer le mdp
router.put('/update-password',protect, userController.updatePassword) ;

// Route reservee aux administrateurs pour élever le role des utilisateurs
router.put('/:id/role',protect, adminOnly, userController.updateUserRole) ;



//router.get('/', userController.getAllUsers );
//router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
