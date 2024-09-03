const express = require('express');
const UserController = require('../controllers/userController');
const AuthController = require('../controllers/authController');
const AccountController = require('../controllers/accountController');
const MideaController = require('../controllers/mideaController');
const PageController = require('../controllers/pageController');
const ParameterController = require('../controllers/parameterController');
const MideaPageController = require('../controllers/mideaPageController');
const SiteController = require('../controllers/siteController');
const DashboardController = require('../controllers/dashboardController');
const ContentController = require('../controllers/contentController');
const authenticateJWT = require('../middleware/authenticateJWT');
const upload = require('../middleware/multer');

const router = express.Router();

// Sem autenticação
router.post('/login', AuthController.login);
router.post('/account/create', AccountController.create);

// Com autenticação
router.get('/dashboard', authenticateJWT, DashboardController.index);

router.post('/content/create', authenticateJWT, upload.single('file'), ContentController.create);

router.get('/page', authenticateJWT, PageController.index);

router.delete('/midea-page/:id', authenticateJWT, MideaPageController.delete);
router.post('/midea-page/create', authenticateJWT, MideaPageController.create);

router.delete('/midea/:id', authenticateJWT, MideaController.delete);
router.get('/midea', authenticateJWT, MideaController.index);
router.get('/midea/name', authenticateJWT, MideaController.indexName);

// router.post('/user/forgot', UserController.forgot);
router.get('/user', authenticateJWT, UserController.index);
router.post('/user/update/status', authenticateJWT, UserController.update);

module.exports = router;