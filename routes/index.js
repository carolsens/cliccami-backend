const express = require('express');
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');
const AccountController = require('../controllers/AccountController');
const MideaController = require('../controllers/MideaController');
const PageController = require('../controllers/PageController');
const ParameterController = require('../controllers/ParameterController');
const MideaPageController = require('../controllers/MideaPageController');
const SiteController = require('../controllers/SiteController');
const DashboardController = require('../controllers/DashboardController');
const ContentController = require('../controllers/ContentController');
const authenticateJWT = require('../middleware/authenticateJWT');
const upload = require('../middleware/multer');

const router = express.Router();


// Rota de login
router.post('/login', AuthController.login);
router.post('/account/create', AccountController.create);

router.get('/dashboard', authenticateJWT, DashboardController.index);
router.post('/content/create', authenticateJWT, upload.single('file'), ContentController.create);

router.get('/page', authenticateJWT, PageController.index);

router.delete('/midea-page/:id', authenticateJWT, MideaPageController.delete);
router.post('/midea-page/create', authenticateJWT, MideaPageController.create);
router.delete('/midea/:id', authenticateJWT, MideaController.delete);
router.get('/midea', authenticateJWT, MideaController.index);
router.get('/midea/name', authenticateJWT, MideaController.indexName);


router.get('/user', authenticateJWT, UserController.index);
router.post('/user/update/status', authenticateJWT, UserController.update);



router.post('/user/create', authenticateJWT, UserController.create);
router.get('/users/:id', authenticateJWT, UserController.findById);
router.put('/users/:id', authenticateJWT, UserController.update);
router.delete('/users/:id', authenticateJWT, UserController.delete);

router.get('/account', authenticateJWT, AccountController.findAll);
router.get('/account/:id', authenticateJWT, AccountController.findById);
router.put('/account/:id', authenticateJWT, AccountController.update);
router.delete('/account/:id', authenticateJWT, AccountController.delete);

router.post('/mideas', authenticateJWT, MideaController.create);
router.get('/mideas', authenticateJWT, MideaController.findAll);
router.put('/mideas/:id', authenticateJWT, MideaController.update);
router.delete('/mideas/:id', authenticateJWT, MideaController.delete);

router.post('/pages', authenticateJWT, PageController.create);
router.get('/pages/:id', authenticateJWT, PageController.findById);
router.put('/pages/:id', authenticateJWT, PageController.update);
router.delete('/pages/:id', authenticateJWT, PageController.delete);

router.post('/parameters', authenticateJWT, ParameterController.create);
router.get('/parameters', authenticateJWT, ParameterController.findAll);
router.get('/parameters/:id', authenticateJWT, ParameterController.findById);
router.put('/parameters/:id', authenticateJWT, ParameterController.update);
router.delete('/parameters/:id', authenticateJWT, ParameterController.delete);

router.post('/midea-pages', authenticateJWT, MideaPageController.create);
router.get('/midea-pages', authenticateJWT, MideaPageController.findAll);
router.get('/midea-pages/:id', authenticateJWT, MideaPageController.findById);
router.put('/midea-pages/:id', authenticateJWT, MideaPageController.update);
router.delete('/midea-pages/:id', authenticateJWT, MideaPageController.delete);

router.post('/sites', authenticateJWT, SiteController.create);
router.get('/sites', authenticateJWT, SiteController.findAll);
router.get('/sites/:id', authenticateJWT, SiteController.findById);
router.put('/sites/:id', authenticateJWT, SiteController.update);
router.delete('/sites/:id', authenticateJWT, SiteController.delete);


module.exports = router;