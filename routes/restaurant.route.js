const express = require('express');
const router = express.Router();

const restaurantController = require('../controllers/restaurant.controller');

router.get('/', restaurantController.getAll);
router.post('/', restaurantController.create);
router.get('/:id', restaurantController.get);
// router.put('/:id', restaurantController.update);
// router.delete('/:id', restaurantController.delete);

module.exports = router;