const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CuisineSchema = new Schema(
    {
        type: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 50
        },
        description: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 400
        },
    },
    { timestamps: true }
);

module.exports = {
    Cuisine: mongoose.model("Cuisine", CuisineSchema, "Cuisine")
};