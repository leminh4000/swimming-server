const mongoose = require('mongoose');


const archivementSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
    },
    category  : {
        type   : String,
        default: '',
    },
    type  : {
        type   : String,
        default: '',
        required: true,
    },
    value : {
        type   : Number,
        default: null,
    },
});

mongoose.model('Archivement', archivementSchema)