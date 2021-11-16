const mongoose = require("mongoose");
const User = require("../models/user.model").User;
const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  cuisines: Joi.required(),
  restaurants: Joi.required(),
});

exports.searchByCuisineId = async (req, res) => {
  try {
    const usersAggregatedByCuisineId = await User.aggregate([
      { $project: { name: 1, cuisines: 1, restaurants: 1 } },
      {
        $lookup: {
          from: 'Restaurant',
          localField: 'restaurants',
          foreignField: '_id',
          as: 'restaurantsData'
        }
      },
      {
        $match: {
          $or: [
            {
              'cuisines': mongoose.Types.ObjectId(req.params.cuisineId),
            },
            {
              'restaurantsData.cuisines': mongoose.Types.ObjectId(req.params.cuisineId),
            },
          ]
        }
      },
      {
        $lookup: {
          from: 'Cuisine',
          localField: 'cuisines',
          foreignField: '_id',
          as: 'cuisinesData'
        }
      },
      {
        $project: {
          'cuisinesData.__v': 0,
          'cuisines': 0,
          'restaurantsData.__v': 0,
          'restaurants': 0
        }
      }
    ])

    res.status(200).json({ success: true, data: usersAggregatedByCuisineId });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error: error });
  }
};

exports.getAll = async (req, res) => {
  try {
    const aggregate = await User.aggregate([
      { $project: { name: 1, cuisines: 1, restaurants: 1 } },
      {
        $lookup: {
          from: 'Cuisine',
          localField: 'cuisines',
          foreignField: '_id',
          as: 'cuisinesData'
        }
      },
      {
        $lookup: {
          from: 'Restaurant',
          localField: 'restaurants',
          foreignField: '_id',
          as: 'restaurantsData'
        }
      },
      {
        $project: {
          'cuisinesData.__v': 0,
          'cuisines': 0,
          'restaurantsData.__v': 0,
          'restaurants': 0
        }
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
    const user = await User.find({ _id: req.params.id }).populate(['cuisines', 'restaurants']);
    if (user.length == 0) {
      res.status(404).json({
        success: false,
        message: {
          'en': `User not found with id: ${req.params.id}`
        }
      });
    } else {
      res.status(200).json({ success: true, user: user });
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
      restaurants: req.body.restaurants,
    }

    const { error, value } = await schema.validateAsync(input);

    if (error) {
      res.status(400).json({ success: false, error: value });
    }

    let user = new User(input);
    data = await user.save();

    res.status(200).json({
      success: true,
      message: {
        'en': 'User Created successfully'
      },
      data: data
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error: error });
  }
};
