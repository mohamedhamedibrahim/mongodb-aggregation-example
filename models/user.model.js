const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 50
        },
        cuisines: [
            { type: Schema.Types.ObjectId, ref: 'Cuisine' }
        ],
        restaurants: [
            { type: Schema.Types.ObjectId, ref: 'Restaurant' }
        ]
    },
    { timestamps: true }
);

module.exports = {
    User: mongoose.model("User", UserSchema, "User")
};