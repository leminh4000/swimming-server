const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Activity = mongoose.model('Activity');

const router = express.Router();

// router.use(requireAuth);

router.get('/activities', async (req, res) => {
    const activities = await Activity.find({userId: req.user._id});

    res.send(activities);
});
router.get('/activities', async (req, res) => {
    const id = req.params.id;
    const activities = await Activity.find({userId: req.user._id});

    res.send(activities);

    Activity.findById(id)
        .then(data => {
            if (!data)
                res.status(422).send({ message: "Not found Activity with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(422)
                .send({ message: "Error retrieving Activity with id=" + id });
        });
});


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