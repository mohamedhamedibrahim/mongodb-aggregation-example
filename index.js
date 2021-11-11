const express = require("express");
const PORT = 4000

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.listen(PORT, () => {
    console.log(
        `Server set up and running on port number: ${PORT}`
    );
});