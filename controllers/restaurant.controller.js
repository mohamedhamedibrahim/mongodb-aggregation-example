const Restaurant = require("../models/restaurant.model").Restaurant;
const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  cuisines: Joi.required()
});

exports.getAll = async (req, res) => {
  try {
    const aggregate = await Restaurant.aggregate([
      { $project: { name: 1, cuisines: 1 } },
      {
        $lookup: {
          from: 'Cuisine',
          localField: 'cuisines',
          foreignField: '_id',
          as: 'cuisinesData'
        }
      },
      {
        $project: { 'cuisinesData.__v': 0, 'cuisines': 0 }
      }
    ])

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
      cuisines: req.body.cuisines,
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
