const mongoose = require('mongoose');


const sessionSchema = new mongoose.Schema({
    timestamp: {
        type   : Date,
        default: Date.now,
    },
    total_distance: {
        type   : Number,
        default: 0,
    },
    total_timer_time : {
        type   : Number,
        default: 0,
    },
    enhanced_avg_speed     : {
        type   : String,
        default: '',
    },
    laps: [lapSchema],
})
const lapSchema = new mongoose.Schema({
    timestamp: {
        type   : Date,
        default: Date.now,
    },
    start_time: {
        type   : Date,
        default: Date.now,
    },
    total_elapsed_time : {
        type   : Number,
        default: 0,
    },
    total_timer_time     : {
        type   : Number,
        default: 0,
    },
    total_calories     : {
        type   : Number,
        default: 0,
    },
    num_lengths     : {
        type   : Number,
        default: 0,
    },

})

const activitySchema = new mongoose.Schema({
    userId   : {
        type  : mongoose.Schema.Types.ObjectId,
        ref   : 'User',
    },
    type     : {
        type   : String,
        default: '',
    },
    sessions: [sessionSchema],


});

mongoose.model('Activity', activitySchema)