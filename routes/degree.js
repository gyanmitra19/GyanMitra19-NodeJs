//Created By Aravind Raj
//Created routes for degree
//Date : 20-10-2018

const express = require('express');
const router = express.Router();
const config = require('../config/env');
const Degree = require('../models/degree');
var ObjectId = require('mongoose').Types.ObjectId;



router.post('/create', (req, res, next) => {
    let newDegree = new Degree({
        name: req.body.name
    });
    newDegree.save((err, doc) => {
        if (err) {
            res.json({ error: true, msg: 'Failed to Create Degree' + err });
        } else {
            res.json({ error: false, msg: 'Degree Created' });
        }
    });
});

router.get('/', function(req, res, next) {
    let page = req.query.page ? req.query.page : 1;

    Degree.getAllDegrees(page, (err, docs) => {
        if (!err) {
            res.send(docs);
        } else {
            res.json({ error: true, msg: err });
        }
    });
});

router.put('/:name', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`NO RECORD WITH GIVEN ID : ${req.params.name}`);
    //Error
    //newDepartment is given
    //changed to newDegree 
    //Shyam 21/12/2018 9:50pm
    var newDegree = {
        name: req.body.name
    };
    Degree.update({name: req.params.name}, { $set: newDegree }, { new: true }, (err, doc) => {
        if (!err) {
            res.json({ error: false, msg: "Degree Updated" });
        } 
        else {
            res.json({ error: true, msg: "Failed To Update Degree" + err });
        }
    });
})

router.delete('/:name', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`NO RECORD WITH GIVEN ID : ${req.params.id}`);

    Degree.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.json({ error: false, msg: 'Deleted Degree' });
        } else {
            res.json({ error: true, msg: "Failed to Delete Degree" });
        }
    });
});

module.exports = router;