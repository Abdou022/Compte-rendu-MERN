const express = require('express') ;
const router = express.Router() ;
const articleController = require ('../controllers/articleController') ;

// Remarque capitale : Le préfixe '/api/articles' sera défini dans server.js.
// Ici , '/' représente donc la racine de la ressource : '/api/articles' !
router.get('/', articleController.getAllArticles );
router.get('/:id', articleController.getArticleById );
router.post ('/', articleController.createArticle );
router.put('/:id', articleController.updateArticle );
router.delete('/:id', articleController.deleteArticle );

module.exports = router ;