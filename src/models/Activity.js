const mongoose = require('mongoose');


const recordSchema = new mongoose.Schema({
    timestamp: {
        type   : Date,
        default: Date.now,
    },
    elapsed_time : {
        type   : Number,
        default: 0,
    },
    timer_time     : {
        type   : Number,
        default: 0,
    },
    heart_rate     : {
        type   : Number,
        default: 0,
    }
})
const lengthSchema = new mongoose.Schema({
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
    total_strokes     : {
        type   : Number,
        default: 0,
    },
    avg_speed     : {
        type   : Number,
        default: 0,
    },
    total_calories     : {
        type   : Number,
        default: 0,
    },
    swim_stroke     : {
        type   : String,
        default: '',
    },
    avg_swimming_cadence     : {
        type   : Number,
        default: 0,
    },

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
    records: [recordSchema],
    lengths: [lengthSchema],

})
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
        type   : Number,
    },
    enhanced_max_speed     : {
        type   : Number,
    },
    total_calories     : {
        type   : Number,
    },
    pool_length     : {
        type   : Number,
    },
    pool_length_unit     : {
        type   : String,
    },
    avg_heart_rate     : {
        type   : Number,
    },
    max_heart_rate     : {
        type   : Number,
    },
    avg_cadence     : {
        type   : Number,
    },
    laps: [lapSchema],
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
    timestamp: {
        type   : Date,
        default: Date.now,
    },

    sessions: [sessionSchema],


});

mongoose.model('Activity', activitySchema)