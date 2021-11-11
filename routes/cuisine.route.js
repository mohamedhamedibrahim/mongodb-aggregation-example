const express = require('express');
const router = express.Router();

const cuisineController = require('../controllers/cuisine.controller');

router.get('/', cuisineController.getAll);
router.post('/', cuisineController.create);
router.get('/:id', cuisineController.get);
// router.put('/:id', cuisineController.update);
// router.delete('/:id', cuisineController.delete);

module.exports = router;