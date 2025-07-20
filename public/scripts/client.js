"use strict";

// Scroll to top and focus on tweet input
$('.scroll').click(() => {
  $('html, body').animate({ scrollTop: 0 }, 500);
  $('#tweet-text').focus();
});

// Escape user input to prevent XSS
const escape = function (str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// Create a tweet <article> element from a tweet object
const createTweetElement = function(tweet) {
  const $tweet = $(`
    <article class="tweet" style="display: none;">
      <header class="th-header">
        <div class="name-left">
          <img src="${tweet.user.avatars}" alt="User Avatar">
          <h3>${tweet.user.name}</h3>
          <span class="handle">${tweet.user.handle}</span>
        </div>
      </header>
      <div class="display-tweet">
        <p>${escape(tweet.content.text)}</p>
      </div>
      <footer>
        <p>${timeago.format(tweet.created_at)}</p>
        <div class="icons">
          <i class="far fa-flag" id="flag"></i>
          <i class="fas fa-retweet" id="retweet"></i>
          <i class="far fa-heart" id="heart"></i>
        </div>
      </footer>
    </article>
  `);
  return $tweet;
};

// Render tweets into the container
const renderTweets = function(tweets) {
  const $container = $('#tweets-container');
  $container.empty(); // Clear old tweets
  for (const tweet of tweets) {
    const $tweetElement = createTweetElement(tweet);
    $tweetElement.prependTo($container).slideDown(300); // Animate appearance
  }
};

// Load tweets from the server
const loadTweets = () => {
  $.ajax({
    url: '/api/tweets',
    method: 'GET',
    dataType: 'json',
    success: (tweets) => {
      renderTweets(tweets);
    },
    error: (error) => {
      console.error('Error fetching tweets:', error);
    }
  });
};

// Reset character counter
const resetCounter = () => {
  $('.counter').text(140).removeClass('warning');
};

// DOM Ready
$(document).ready(function () {
  // Load tweets on initial page load
  loadTweets();

  // Handle new tweet submission
  $('#submit-tweet').on('submit', function (e) {
    e.preventDefault();

    const tweetText = $('#tweet-text').val().trim();

    // ✅ Validation using alert()
    if (!tweetText) {
      alert("Tweet content is required.");
      return;
    }

    if (tweetText.length > 140) {
      alert("Tweet exceeds 140 character limit.");
      return;
    }

    const serializedData = $(this).serialize();

    $.post('/api/tweets', serializedData)
      .then(() => {
        loadTweets();        // Reload tweets after submission
        this.reset();        // Clear form
        resetCounter();      // Reset character counter
        $('html, body').animate({ scrollTop: 0 }, 300); // Scroll to top
      })
      .catch((err) => {
        console.error('Tweet submission failed:', err);
        alert("Something went wrong while submitting your tweet.");
      });
  });
});