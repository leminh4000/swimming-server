const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Activity = mongoose.model('Activity');
const Archivement = mongoose.model('Archivement');

const router = express.Router();

router.use(requireAuth);

router.get('/activitiesSummary', async (req, res) => {
    console.log('req.query', req.query);
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);
    const activities = await Activity.find({
        userId    : req.user._id,
        timestamp: {
            $gte: from,
            $lt : to
        }
    });
    console.log(activities);
    const sessions=[];
    const avg_heart_rates =[];
    const enhanced_avg_speeds=[];
    const total_caloriesArray = [];
    const total_distances= [];
    const total_timer_times=[];
    const pool_length= activities[0].sessions[0].pool_length;

    for (const activity of activities) {
        const session=activity.sessions[0];
        avg_heart_rates.push(session.avg_heart_rate);
        enhanced_avg_speeds.push(session.enhanced_avg_speed);
        total_caloriesArray.push(session.total_calories);
        total_distances.push(session.total_distance);
        total_timer_times.push(session.total_timer_time);
    }

    const avg_heart_rate = avg_heart_rates.reduce((a, b) => a + b, 0) / avg_heart_rates.length + " bpm";
    const enhanced_avg_speed = Math.floor(((enhanced_avg_speeds.reduce((a, b) => a + b, 0) / enhanced_avg_speeds.length) * pool_length)/60) + "p:" + pool_length + "m";
    const total_calories=total_caloriesArray.reduce((a, b) => a + b, 0) + " calories";
    const total_distance=total_distances.reduce((a, b) => a + b, 0)/1000 + " km";
    const total_timer_time=new Date(total_timer_times.reduce((a, b) => a + b, 0) * 1000).toISOString().substr(11, 5) + " phút";


    res.send({avg_heart_rate, enhanced_avg_speed, total_calories, total_distance,total_timer_time});
});
router.get('/activities', async (req, res) => {
    const activities = await Activity.find({userId: req.user._id}).sort({"timestamp": -1}).limit(4);
    console.log(activities);
    res.send(activities);
});
router.get('/activities2', async (req, res) => {
    console.log("req.query",req.query);
    const id = req.query.id;

    Activity.findById(id)
        .then(data => {
            if (!data)
                res.status(422).send({message: "Not found Activity with id " + id});
            else res.send(data);
        })
        .catch(err => {
            res
                .status(422)
                .send({message: "Error retrieving Activity with id=" + id});
        });
});


async function updateArchivement(req, activity) {
    let archivementTotal = await Archivement.findOne({type: "total"});
    console.log("archivement", archivementTotal);
    if (!archivementTotal) {
        archivementTotal = new Archivement({
            category: "total",
            type    : "total",
            userId  : req.user._id
        });
    }
    archivementTotal.value += activity.sessions[0].total_distance;
    await archivementTotal.save();

    let archivementLevel = await Archivement.findOne({type: "level"});
    console.log("archivementLevel", archivementLevel);
    if (!archivementLevel) {
        archivementLevel = new Archivement({
            category: "medal",
            type    : "level",
            value: 0,
            userId  : req.user._id
        });
    }

    switch (true) {
        case archivementTotal.value >= 150:
            archivementLevel.value = 4;
            break;
        case archivementTotal.value >= 100:
            archivementLevel.value = 3;
            break;
        case archivementTotal.value >= 50:
            archivementLevel.value = 2;
            break;
        case archivementTotal.value >= 20:
            archivementLevel.value = 1;
            break;
    }
    archivementLevel.save();

    let archivementLongest = await Archivement.findOne({type: "Longest"});
    console.log("archivementLongest", archivementLongest);
    if (!archivementLongest) {
        archivementLongest = new Archivement({
            category: "distance",
            type    : "Longest",
            value: 0,
            userId  : req.user._id
        });
    }
    if (archivementLongest.value < activity.sessions[0].total_distance){
        archivementLongest.value = activity.sessions[0].total_distance;
    }
    await archivementLongest.save();
}

router.post('/activities', async (req, res) => {
    console.log('req.body', req.body);
    const {
        type
    } = req.body;
    console.log('type', type);

    if (!type) {
        return res.status(422).send({error: 'You must provide a type'})
    }

    try {
        const activity = new Activity({
            ...req.body,
            userId: req.user._id
        });
        await activity.save();
        await updateArchivement(req, activity);

        res.send(activity);
    } catch (err) {
        console.error("ERROR", err.message);
        res.status(422).send({error: err.message});
    }
});

router.put('/activities', async (req, res) => {
    console.log('req.body', req.body);

    if (!req.body) {
        return res.status(422).send({error: 'Data to update can not be empty!'})
    }

    const {_id} = req.body;
    Activity.findByIdAndUpdate(_id, req.body, {useFindAndModify: false})
        .then(data => {
            if (!data) {
                res.status(422).send({
                    message: `Cannot update Activity with id=${_id}. Maybe Activity was not found!`
                });
            } else res.send({message: "Activity was updated successfully."});
        })
        .catch(err => {
            res.status(422).send({
                message: "Error updating Activity with id=" + _id
            });
        });
});


module.exports = router;