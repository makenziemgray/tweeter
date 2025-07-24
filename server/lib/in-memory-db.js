// server/lib/in-memory-db.js
"use strict";

module.exports = {
  tweets: [
    {
      user: {
        name: "Jisoo Kim",
        handle: "@sooyaaa__",
        avatars: "/images/images.jpeg"
      },
      content: {
        text: "Blackpink 2025 WORLD TOUR! 💗🌍🎤"
      },
      created_at: Date.now() - 1000 * 60 * 60
    },
    {
      user: {
        name: "Jennie Kim",
        handle: "@jennierubyjane",
        avatars: "/images/jennie.jpeg"
      },
      content: {
        text: "🎧🔥 New music coming soon? 👀"
      },
      created_at: Date.now() - 1000 * 60 * 30
    },
    {
      user: {
        name: "Lisa Manoban",
        handle: "@lalalalisa_m",
        avatars: "/images/lisa.jpeg"
      },
      content: {
        text: "Love seeing all your dance covers 💃 Keep them coming! #LALISA"
      },
      created_at: Date.now() - 1000 * 60 * 10
    },
    {
      user: {
        name: "Rosé Park",
        handle: "@roses_are_rosie",
        avatars: "/images/rose.jpeg"
      },
      content: {
        text: "Feeling grateful for all the love 🌹💕 #BLINKS"
      },
      created_at: Date.now() - 1000 * 60 * 5
    }
  ]
};