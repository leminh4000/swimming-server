const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Activity = mongoose.model('Activity');
const Archivement = mongoose.model('Archivement');

const router = express.Router();

router.use(requireAuth);

router.get('/activitiesSummary', async (req, res) => {
    // console.log('req.query', req.query);
    const from = new Date(req.query.from);
    const activities = await Activity.find({
        userId   : req.user._id,
        timestamp: {
            $gte: from,
        }
    });
    console.log(activities);
    const sessions = [];
    const avg_heart_rates = [];
    const enhanced_avg_speeds = [];
    const total_caloriesArray = [];
    const total_distances = [];
    const total_timer_times = [];
    const pool_length = activities[0].sessions[0].pool_length;

    for (const activity of activities) {
        const session = activity.sessions[0];
        avg_heart_rates.push(session.avg_heart_rate);
        enhanced_avg_speeds.push(session.enhanced_avg_speed);
        total_caloriesArray.push(session.total_calories);
        total_distances.push(session.total_distance);
        total_timer_times.push(session.total_timer_time);
    }

    const avg_heart_rate = avg_heart_rates.reduce((a, b) => a + b, 0) / avg_heart_rates.length + " bpm";
    const enhanced_avg_speed = Math.floor(((enhanced_avg_speeds.reduce((a, b) => a + b, 0) / enhanced_avg_speeds.length) * pool_length) / 60) + "p:" + pool_length + "m";
    const total_calories = total_caloriesArray.reduce((a, b) => a + b, 0) + " calories";
    const total_distance = total_distances.reduce((a, b) => a + b, 0) / 1000 + " km";
    const total_timer_time = new Date(total_timer_times.reduce((a, b) => a + b, 0) * 1000).toISOString().substr(11, 5) + " phút";


    res.send({
        avg_heart_rate,
        enhanced_avg_speed,
        total_calories,
        total_distance,
        total_timer_time
    });
});
router.get('/activities', async (req, res) => {
    const activities = await Activity.find({userId: req.user._id}).sort({"timestamp": -1}).limit(4);
    // console.log(activities);
    res.send(activities);
});
router.get('/activities2', async (req, res) => {
    console.log("req.query", req.query);
    console.log("req.user._id", req.user._id);

    if (req.query.id){
        Activity.findById(req.query.id)
        .then(data => {
            if (!data) res.status(422).send({message: "Not found Activity with id " + req.query.id}); else res.send(data);
        })
        .catch(err => {
            res
                .status(422)
                .send({message: "Error retrieving Activity with id=" + req.query.id});
        });
    } else if (req.query.from){
        const from = new Date(req.query.from);
        console.log("from", from);
        const activities = await Activity.find({
            userId   : req.user._id,
            timestamp: {
                $gte: from,
            }
        });
        console.log("ctivities.length",activities.length);
        return res.send(activities);
    }
    return res.status(422).send({error: 'Wrong params'});
});

router.post('/activities', async (req, res) => {
    // console.log('req.body', req.body);
    const {
        type
    } = req.body;
    // console.log('type', type);

    if (!type) {
        return res.status(422).send({error: 'You must provide a type'})
    }

    try {
        const activity = new Activity({
            ...req.body,
            userId: req.user._id
        });
        await activity.save();
        const newLevel = await updateArchivement(req, activity);
        console.log("newLevel", newLevel)

        activity.leve
        res.send({activity, newLevel});
        // res.send({activity});
    } catch (err) {
        console.error("ERROR", err.message);
        res.status(422).send({error: err.message});
    }
});

router.put('/activities', async (req, res) => {
    // console.log('req.body', req.body);

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


async function updateSpeedArchivement(req, activity, speedArchivementLength) {
    //update archivements speed

    let archivementSpeed = await Archivement.findOne({type: `${speedArchivementLength} m`});
    if (!archivementSpeed) {
        archivementSpeed = new Archivement({
            category: "speed",
            type    : `${speedArchivementLength} m`,
            value   : 0,
            userId  : req.user._id
        });
    }


    if (!(speedArchivementLength % activity.sessions[0].pool_length)) {
        const totalTimes = [];
        console.log("pool_length", activity.sessions[0].pool_length);
        const laps = activity.sessions[0].laps;

        for (const lap of laps) {
            let continuedLengthSlices = speedArchivementLength / activity.sessions[0].pool_length;
            console.log("lap.lengths.length",lap.lengths.length);
            if (lap.lengths.length >= continuedLengthSlices) {
                for (let offset = 0; offset <= lap.lengths.length - continuedLengthSlices; offset++) {
                    let total = 0;
                    for (let segmentIndex = 0; segmentIndex < continuedLengthSlices; segmentIndex++) {
                        total += lap.lengths[offset + segmentIndex].total_timer_time;
                    }
                    totalTimes.push(total);
                }
            }
        }
        console.log('speedArchivementLength', speedArchivementLength)
        console.log("totalTimes", totalTimes);
        console.log("speedArchivementLength", speedArchivementLength);
        const timeMin = Math.min(...totalTimes);
        console.log("timeMin", timeMin);
        console.log("archivementSpeed", archivementSpeed);
        if (!archivementSpeed.value || timeMin < archivementSpeed.value) archivementSpeed.value = Math.round(timeMin);
    }

    await archivementSpeed.save();
}

async function updateLongestArchivement(req, activity) {
    //update archivements longest
    let archivementLongest = await Archivement.findOne({type: "Longest"});
    // console.log("archivementLongest", archivementLongest);
    if (!archivementLongest) {
        archivementLongest = new Archivement({
            category: "distance",
            type    : "Longest",
            value   : 0,
            userId  : req.user._id
        });
    }
    if (archivementLongest.value < activity.sessions[0].total_distance) {
        archivementLongest.value = activity.sessions[0].total_distance;
    }
    await archivementLongest.save();
}

async function updateLevelArchivement(req, archivementTotal) {
    //update archivements level
    let archivementLevel = await Archivement.findOne({type: "level"});
    const oldLevel = archivementLevel.value;
    // console.log("archivementLevel", archivementLevel);
    if (!archivementLevel) {
        archivementLevel = new Archivement({
            category: "medal",
            type    : "level",
            value   : 0,
            userId  : req.user._id
        });
    }

    switch (true) {
        case archivementTotal.value >= 150000:
            archivementLevel.value = 4;
            break;
        case archivementTotal.value >= 100000:
            archivementLevel.value = 3;
            break;
        case archivementTotal.value >= 50000:
            archivementLevel.value = 2;
            break;
        case archivementTotal.value >= 0: /*test 20000:*/
            archivementLevel.value = 1;
            break;
    }
    archivementLevel.save();
    if (archivementLevel.value !== oldLevel) {
        return archivementLevel.value;
    } else {
        return 0;
    }

}

async function updateTotalArchivement(req, activity) {
    //update archivements total
    let archivementTotal = await Archivement.findOne({type: "total"});
    // console.log("archivement", archivementTotal);
    if (!archivementTotal) {
        archivementTotal = new Archivement({
            category: "total",
            type    : "total",
            userId  : req.user._id
        });
    }
    archivementTotal.value += activity.sessions[0].total_distance;
    await archivementTotal.save();
    return archivementTotal;
}

async function updateArchivement(req, activity) {
    let archivementTotal = await updateTotalArchivement(req, activity);

    const newLevel=await updateLevelArchivement(req, archivementTotal);
    console.log("newLevel", newLevel)

    await updateLongestArchivement(req, activity);

    await updateSpeedArchivement(req, activity,100);
    await updateSpeedArchivement(req, activity,400);
    await updateSpeedArchivement(req, activity, 750);
    return newLevel;


}


module.exports = router;