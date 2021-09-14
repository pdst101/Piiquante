const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const saucesCtrl = require('../controllers/sauces');

router.get('/', auth, saucesCtrl.getAllSauces); //Returns an array with all sauces from DB
router.get('/:id', auth, saucesCtrl.getOneSauce); //Returns sauce with provided ID
router.post('/', auth, multer, saucesCtrl.createSauce);      //Parse+save image and parse stringified sauce, initialize sauces likes/dislikes to 0.
router.put('/:id', auth, multer, saucesCtrl.modifySauce); //Updates the sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce); //Deletes the sauce with provided ID
router.post('/:id/like', auth, saucesCtrl.likeSauce); //Sets like status if =1 like =0 cancel =-1 dislike User ID needs to be added/removed to specific array


module.exports = router;