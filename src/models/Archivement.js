const mongoose = require('mongoose');


const archivementSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    type: {
        type: String,
        default: '',
    },value: {
        type: Number,
        default: null,
    },
});

mongoose.model('Archivement', archivementSchema)