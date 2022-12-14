const mongoose = require('mongoose');


const userLevelSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        ref: 'User',
    },
    level: {
        type: Number,
        default: null,
    },
});

mongoose.model('UserLevel', userLevelSchema)