const Restaurant = require("../models/restaurant.model").Restaurant;
const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  cuisineId: Joi.required()
});

exports.getAll = async (req, res) => {
  try {

    const aggregate = await Restaurant.aggregate([
      { $project: { name: 1, cuisineId: 1 } },
      {
        $lookup: {
          from: 'Cuisine',
          localField: 'cuisineId',
          foreignField: '_id',
          as: 'cuisineData'
        }
      },
      {
        $unwind: {
          path: '$cuisineData',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: { 'cuisineData.__v': 0 }
      }
    ])

    // let data = await Restaurant.find({})
    res.status(200).json({ success: true, data: aggregate });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error: error });
  }
};

exports.get = async (req, res) => {
  try {
    let restaurant = await Restaurant.find({ _id: req.params.id });
    if (restaurant.length == 0) {
      res.status(404).json({
        success: false,
        message: {
          'en': `Restaurant not found with id: ${req.params.id}`
        }
      });
    } else {
      res.status(200).json({ success: true, restaurant: restaurant });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

exports.create = async (req, res) => {
  try {
    let input = {
      name: req.body.name,
      cuisineId: req.body.cuisineId,
    }

    const { error, value } = await schema.validateAsync(input);

    if (error) {
      res.status(400).json({ success: false, error: value });
    }

    let restaurant = new Restaurant(input);
    data = await restaurant.save();

    res.status(200).json({
      success: true,
      message: {
        'en': 'Restaurant Created successfully'
      },
      data: data
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error: error });
  }
};
