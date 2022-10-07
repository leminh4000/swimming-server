const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const UserLevel = mongoose.model('UserLevel');

const router = express.Router();

// router.use(requireAuth);

router.get('/userLevels', async (req, res) => {
    const userLevels = await UserLevel.find({userId: req.user._id});

    res.send(userLevels);
});


router.post('/userLevels', async (req, res) => {
    console.log('req.body', req.body);
    const {level} = req.body;
    console.log('level', level);


    if (!level) {
        return res.status(422).send({error: 'You must provide a level'})
    }

    try {
        const userLevel = new UserLevel({level, userId: req.user._id});
        await userLevel.save();
        res.send(userLevel);
    } catch (err) {
        console.error("ERROR", err.message);
        res.status(422).send({error: err.message});
    }
});

module.exports = router;