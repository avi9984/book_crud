const express = require('express');
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');
const app = express();
require('dotenv').config();
const route = require('./routers/router');
const PORT = process.env.PORT || 5001

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
mongoose.connect(process.env.MONGO_URL, {
    // useNewUrlParser: false
})
    .then(() => console.log('MongoDB is connected...'))
    .catch((error) => console.log(error));


app.use("/", route)
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});