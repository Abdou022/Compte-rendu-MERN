const express = require('express') ;
const router = express.Router() ;
const articleController = require('../controllers/articleController');
const { protect } = require ('../middlewares/authMiddleware');


// Remarque capitale : Le préfixe '/api/articles' sera défini dans server.js.
// Ici , '/' représente donc la racine de la ressource : '/api/articles' !

// Consultation publique
router.get('/', articleController.getAllArticles );

// Route pour voir les articles d'un utilisateur connecté
router.get('/my-articles', protect, articleController.getMyArticles );

router.get('/:id', articleController.getArticleById );

// Operations d’ecriture protegees par authentification JWT
router.post ('/', protect, articleController.createArticle );
router.put('/:id', protect, articleController.updateArticle );
router.delete('/:id', protect, articleController.deleteArticle );

module.exports = router ;