"use strict";

const userHelper = require("../lib/util/user-helper");
const express = require('express');
const tweetsRoutes = express.Router();

module.exports = (dataHelpers) => {

  // GET /api/tweets
  tweetsRoutes.get("/", (req, res) => {
    dataHelpers.getTweets((err, tweets) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(tweets);
    });
  });

  // POST /api/tweets
  tweetsRoutes.post("/", (req, res) => {
    const tweetText = req.body.text;

    if (!tweetText || !tweetText.trim()) {
      return res.status(400).json({ error: 'Tweet content is required' });
    }

    const user = req.body.user ? req.body.user : userHelper.generateRandomUser();

    const tweet = {
      user,
      content: { text: tweetText },
      created_at: Date.now()
    };

    dataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(tweet);
    });
  });

  return tweetsRoutes;
};

