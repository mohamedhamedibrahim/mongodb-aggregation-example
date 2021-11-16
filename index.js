const express = require("express");
const mongoose = require("mongoose");

const dotenv = require('dotenv').config({ path: `config/.env.${process.env.NODE_ENV}` })

const PORT = process.env.PORT;
const ENV = process.env.ENV;
const MONGODB_URL = process.env.MONGODB_URL;

const app = express();

// Mongoose connection
mongoose.promise = global.Promise;
mongoose.connect(MONGODB_URL, { useNewUrlParser: true });
db = mongoose.connection;
db.once("open", () => {
    console.log("Connected to MongoDB");
});
db.on("error", err => {
    console.log(err);
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Routes
app.use("/api/v1/cuisines", require("./routes/cuisine.route"));
app.use("/api/v1/restaurants", require("./routes/restaurant.route"));
app.use("/api/v1/users", require("./routes/user.route"));

app.listen(PORT, () => {
    console.log(
        `Server set up and running on port number: ${PORT}, environment: ${ENV}`
    );
});