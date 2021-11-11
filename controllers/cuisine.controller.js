const Cuisine = require("../models/cuisine.model").Cuisine;
const Joi = require('joi');

const schema = Joi.object({
  type: Joi.string().min(2).max(50).required(),
  description: Joi.string().min(5).max(400)
});

exports.getAll = async (req, res) => {
  try {
    let data = await Cuisine.find({})
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error: error });
  }
};

exports.get = async (req, res) => {
  try {
    let cuisine = await Cuisine.find({ _id: req.params.id });
    if (cuisine.length == 0) {
      res.status(404).json({
        success: false,
        message: {
          'en': `Cuisine not found with id: ${req.params.id}`
        }
      });
    } else {
      res.status(200).json({ success: true, cuisine: cuisine });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

exports.create = async (req, res) => {
  try {
    let input = {
      type: req.body.type,
      description: req.body.description,
    }

    const { error, value } = await schema.validateAsync(input);

    if (error) {
      res.status(400).json({ success: false, error: value });
    }

    let cuisine = new Cuisine(input);
    data = await cuisine.save();

    res.status(200).json({
      success: true,
      message: {
        'en': 'Cuisine Created successfully'
      },
      data: data
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};
