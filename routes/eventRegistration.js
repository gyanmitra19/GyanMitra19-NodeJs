const express = require('express');
const router = express.Router();
const config = require('../config/env');
const Registration = require('../models/registration');
const User = require('../models/user');
var nodemailer = require("nodemailer");
var ObjectId = require('mongoose').Types.ObjectId;

router.get('/checkRegistration/:event_id/:user_id', (req, res) => {
    Registration.countDocuments({
        user_id: req.params.user_id,
        event_id: req.params.event_id
    }, (err, count) => {
        if (err) {
            res.json({
                error: true,
                msg: err
            })
        } else {
            if (count == 0) {
                res.json({
                    error: false,
                    registered: false,
                    msg: 'You can Register!'
                })
            } else {
                res.json({
                    error: false,
                    registered: true,
                    msg: 'Already Registered!'
                })
            }
        }
    })
})

router.post('/newWorkshopRegistration', (req, res) => {
    let newRegistration = new Registration({
            event_id: req.body.event_id,
            user_id: req.body.user_id,
            registration_type: req.body.registration_type,
            participation: 'Absent'
        })
    newRegistration.save((err, doc) => {
        if (err) {
            res.json({
                error: true,
                msg: err
            })
        } else {
            res.json({
                error: false,
                msg: 'Successfully Registered!'
            })
        }
    });
});


router.post('/newEventRegistration', (req, res) => {
    let newRegistration = undefined;

    if (req.body.registration_type == 'Team') {
        newRegistration = new Registration({
            event_id: req.body.event_id,
            team_id: req.body.team_id,
            user_id: req.body.user_id,
            registration_type: req.body.registration_type,
            participation: req.body.participation
        })
    } else {
        newRegistration = new Registration({
            event_id: req.body.event_id,
            user_id: req.body.user_id,
            registration_type: req.body.registration_type,
            participation: req.body.participation
        })
    }

    newRegistration.save((err, doc) => {
        if (err) {
            res.json({
                error: true,
                msg: err
            })
        } else {
            res.json({
                error: false,
                msg: 'Successfully Registered!'
            })
        }
    });
});

router.delete('/:id', (req, res)=>{
    Registration.findByIdAndRemove(req.params.id, (err, docs)=>{
        if(err){
            res.json({
                error: true,
                msg: 'Unable to cancel your registration. Try again'
            })
        }
        else{
            res.json({
                error: false,
                msg: 'Registration removed from cart!'
            })
        }
    })
} );

router.get('/events/:id', function (req, res, next) {
    Registration.find({
        event_id: req.params.id
    }).populate('user_id').exec((err, docs) => {
        if (err) {
            res.json({
                error: true,
                msg: err
            });
        } else {
            res.json(docs);
        }
    });
});


router.get('/:email',function(req ,res, next) {
    User.getUserByEmailId(req.params.email,(err, docs) => {
        if (err) {
            res.json({
                error: true,
                msg: err
            });
        } else {
            res.json(docs);
        }
    });
});

module.exports = router;