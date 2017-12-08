'use strict';

const express = require('express');
const router = express.Router();

const response = require('../helpers/response');

const Poll = require('../models/Poll').Poll;

/* GET users listing. */
router.get('/active', (req, res, next) => {
  Poll.find({}, (err, polls) => {
    if (err) {
      return next(err);
    }
    return response.data(req, res, polls);
  });
});

router.get('/:id', (req, res, next) => {
  if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
    return response.notFound(req, res);
  }
  Poll.findById(req.params.id, (err, poll) => {
    if (err) {
      return next(err);
    }
    if (!poll) {
      return response.notFound(req, res);
    }
    return response.data(req, res, poll);
  });
});

router.post('/', (req, res, next) => {
  if (!req.user) {
    return response.forbidden(req, res);
  }
  // @todo if (!req.body.foo || !req.body.bar) { return response.unprocessable(req, res); }
  const poll = new Poll(req.body);
  poll.owner = req.user._id;
  poll.save((err, poll) => {
    if (err) {
      return next(err);
    }
    if (!poll) {
      return response.notFound(req, res);
    }
    return response.data(req, res, poll);
  });
});

module.exports = router;
