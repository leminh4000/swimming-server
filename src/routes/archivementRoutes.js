const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Archivement = mongoose.model('Archivement');

const router = express.Router();

router.use(requireAuth);

router.get('/archivements', async (req, res) => {
    const archivements = await Archivement.find({userId: req.user._id});

    res.send(archivements);
});
router.get('/archivements2', async (req, res) => {
    console.log("req.query",req.query);

    let archivements=[];
    if (req.query.id) {
        Archivement.findById(req.query.id)
            .then(data => {
                if (!data) res.status(422).send({message: "Not found Archivement with id " + id}); else res.send(data);
            })
            .catch(err => {
                res
                    .status(422)
                    .send({message: "Error retrieving Archivement with id=" + id});
            });
    } else if (req.query.type) {
        archivements =  await Archivement.find({
            userId: req.user._id,
            type  : req.query.type
        });
        console.log("archivements",archivements);
        res.send(archivements);
    } else if (req.query.category) {
        archivements =  await Archivement.find({
            userId  : req.user._id,
            category: req.query.category
        });
        res.send(archivements);
    }
});


router.post('/archivements', async (req, res) => {
    console.log('req.body', req.body);
    const {
        type
    } = req.body;
    console.log('type', type);

    if (!type) {
        return res.status(422).send({error: 'You must provide a type'})
    }

    try {
        const archivement = new Archivement({
            ...req.body,
            userId: req.user._id
        });
        await archivement.save();
        res.send(archivement);
    } catch (err) {
        console.error("ERROR", err.message);
        res.status(422).send({error: err.message});
    }
});

router.put('/archivements', async (req, res) => {
    console.log('req.body', req.body);

    if (!req.body) {
        return res.status(422).send({error: 'Data to update can not be empty!'})
    }

    const {_id} = req.body;
    Archivement.findByIdAndUpdate(_id, req.body, {useFindAndModify: false})
        .then(data => {
            if (!data) {
                res.status(422).send({
                    message: `Cannot update Archivement with id=${_id}. Maybe Archivement was not found!`
                });
            } else res.send({message: "Archivement was updated successfully."});
        })
        .catch(err => {
            res.status(422).send({
                message: "Error updating Archivement with id=" + _id
            });
        });
});


module.exports = router;