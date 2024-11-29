const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware')
const iaFood = require ('../controllers/foodIAController')
const iaRecipie = require ('../controllers/iaController')
const iaTranslate = require ('../controllers/translateController')
const multer = require('multer'); // Configurar almacenamiento temporal
const upload = multer({ dest: 'uploads/' }); // Carpeta temporal

//Ruta para organizar la nota generado por IA
//router.post('/upgradeNote', authenticateUser ,iaController.getGroqChatCompletion)

//Fodd IA
router.post('/upload' ,upload.single('image'), iaFood.uploadImage)
router.post('/recipie', iaRecipie.getGroqChatCompletion)
router.post('/translate', iaTranslate.translate)

module.exports = router;