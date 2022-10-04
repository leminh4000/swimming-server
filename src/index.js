require("./models/User");
require("./models/Track");
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
const requireAuth = require('./middlewares/requireAuth');

const app = express();

app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes);

const mongdoUri = 'mongodb+srv://admin:Aa123456!@cluster0.msahwgu.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongdoUri, {
    // userNewUrlParser:true,
    // useCreateIndex:true,
});

mongoose.connection.on('connected', ()=>{
    console.log('Connected to mongo instance');
});

mongoose.connection.on('error', (err)=>{
    console.error('Connect failed', err);
});

app.get('/', requireAuth, (req, res) => {
    res.send(`Your email: ${req.user.email}`);
});

app.listen(3000, ()=>{
    console.log('Listening on port 3000');
});