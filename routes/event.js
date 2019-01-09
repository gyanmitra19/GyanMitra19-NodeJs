//Created By Aravind Raj
//Created routes for Event (change the router name accordingly for updates)
//Date : 20-10-2018

const express = require('express');
const router = express.Router();
const config = require('../config/env');
const Event = require('../models/event');
const Registration = require('../models/registration');
var ObjectId = require('mongoose').Types.ObjectId;
var path = require('path')
var multer = require('multer')

router.post('/uploadImage/:id', (request, res)=>{
    var fileName =""
    var upload = multer({
		storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './assests/images/events/')
            },
            filename: function (req, file, cb) {
                cb(null,request.params.id+path.extname(file.originalname))
                console.log(req.params.id)
                this.fileName = request.params.id + path.extname(file.originalname);
                Event.findByIdAndUpdate(req.params.id, {
                    $set: {
                        image_name: request.params.id + path.extname(file.originalname)
                    }
                },(err, resp)=>{
                    if(err){
                    }
                    else{
                    }
                })
            }
        })
    }).any()
	upload(request, res, function(err) {
		if(!err){
            res.json({
                error: false,
                msg: 'FIle Uploaded Successfully'
            })
        }
        else{
            res.json(err);
        }
	})
})

router.post('/create', (req, res, next) => {
    let newEvent = new Event({
        title: req.body.title,
        category_id: req.body.category_id,
        department_id: req.body.department_id,
        description: req.body.description,
        image_name: req.body.image_name,
        rules: req.body.rules,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        event_date: req.body.event_date,
        prelims: req.body.prelims,
        round_1: req.body.round_1,
        round_2: req.body.round_2,
        finals: req.body.finals,
        min_members: req.body.min_members,
        max_members: req.body.max_members,
        max_limit: req.body.max_limit,
        contact_email: req.body.contact_email,
        venue: req.body.venue,
        amount: req.body.amount,
        allow_gender_mixing: req.body.allow_gender_mixing,
        resource_person: req.body.resource_person
    });
    newEvent.save((err, doc) => {
        if (err) {
            res.json({
                error: true,
                msg: 'Failed to Create Event' + err
            });
        } else {
            res.json({
                error: false,
                msg: 'Event Created',
                id: doc._id
            });
        }
    });
});

router.get('/all', function (req, res) {
    Event.find({}, (err, docs) => {
        if (!err) {
            res.send(docs);
        } else {
            res.json({
                error: true,
                msg: err
            })
        }
    })
})

router.get('/:event/:page',function (req, res) {
    var page = req.params.page
    if(page == 0){
        Event.find().populate('category_id').populate('department_id').exec(function(err, docs){
            if (!err) {
                var events = [];
                for(var work of docs){
                    if (work.category_id.name === req.params.event) {
                        events.push(work);
                    }
                }
                res.send(events)
            } else {
                res.json({
                    error: true,
                    msg: err
                })
            }
        })
    }
    else{
        Event.find().skip((page-1) * 6).limit(6).populate('category_id').populate('department_id').exec(function(err, docs){
            if (!err) {
                var events = [];
                for(var work of docs){
                    if (work.category_id.name === req.params.event) {
                        events.push(work);
                    }
                }
                res.send(events)
            } else {
                res.json({
                    error: true,
                    msg: err
                })
            }
        })
    }
    
});

router.get('/', function(req, res, next) {
    Event.find().skip((page-1) * config.pagination.perPage).limit(config.pagination.perPage).populate('category_id').populate('department_id').exec(function (err, docs) {
        if (!err){
            if(docs.length == 0){
                res.json({error:true , msg:'No Pages to retreive'});                
            }
            else {
                res.json({error:false , msg:docs});
            }
        }
        else{
            res.json({error:true , msg:err});
        }   
    });
});

router.put('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`NO RECORD WITH GIVEN ID : ${req.params.id}`);

    var event = {
        title: req.body.title,
        category_id: req.body.category_id,
        department_id: req.body.department_id,
        description: req.body.description,
        image_name: req.body.image_name,
        rules: req.body.rules,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        event_date: req.body.event_date,
        prelims: req.body.prelims,
        round_1: req.body.round_1,
        round_2: req.body.round_2,
        finals: req.body.finals,
        min_members: req.body.min_members,
        max_members: req.body.max_members,
        max_limit: req.body.max_limit,
        contact_email: req.body.contact_email,
        venue: req.body.venue,
        amount: req.body.amount,
        allow_gender_mixing: req.body.allow_gender_mixing,
        resource_person:req.body.resource_person
    };
    //Wrongly typed
    //Shyam
    //23/12/2018
    Event.findByIdAndUpdate(req.params.id, {
        $set: event
    }, {
        new: true
    }, (err, doc) => {
        if (!err) {
            res.json({
                error: false,
                msg: "Event Updated"
            });
        } else {
            res.json({
                error: true,
                msg: "Failed To Update Event" + err
            });
        }
    });
})
//Wrongly typed
//Shyam
//23/12/2018
router.delete('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`NO RECORD WITH GIVEN ID : ${req.params.id}`);

    Event.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.json({
                error: false,
                msg: 'Deleted Event'
            });
        } else {
            res.json({
                error: true,
                msg: "Failed to Delete Event"
            });
        }
    });
});


module.exports = router;