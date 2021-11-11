const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 50
        },
        cuisineId: { type: Schema.Types.ObjectId, ref: 'Cuisine' }
    },
    { timestamps: true }
);

module.exports = {
    Restaurant: mongoose.model("Restaurant", RestaurantSchema, "Restaurant")
};