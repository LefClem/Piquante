const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer');
const sauceCtrl = require('../controllers/routes');

// Route to get all the sauces
router.get('/', auth, sauceCtrl.getAllSauces)

// Route to create a new sauce
router.post('/', auth, multer, sauceCtrl.createSauce);

// Route to get a sauce by the id
router.get('/:id', auth, sauceCtrl.getOneSauce)

// Route to delete a sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// Route for the modification of a sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

// Route for the like 
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;
