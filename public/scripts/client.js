"use strict";

// Scroll to top and focus tweet input
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

// Create tweet <article> DOM from tweet object
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

// Render multiple tweets
const renderTweets = function(tweets) {
  const $container = $('#tweets-container');
  $container.empty();
  for (const tweet of tweets) {
    const $tweetElement = createTweetElement(tweet);
    $tweetElement.prependTo($container).slideDown(300);
  }
};

// Load tweets from server
const loadTweets = () => {
  $.ajax({
    url: '/api/tweets',
    method: 'GET',
    dataType: 'json',
    success: (tweets) => renderTweets(tweets),
    error: () => showError("Failed to fetch tweets.")
  });
};

// Show animated error message
const showError = (message) => {
  const $existing = $('.error');
  if ($existing.length) $existing.remove();

  const $error = $("<div class='error'>")
    .text(`⚠️ ${message}`)
    .hide()
    .prependTo('#submit-tweet')
    .slideDown()
    .delay(3000)
    .fadeOut(500, function () {
      $(this).remove();
    });
};

// Reset character counter
const resetCounter = () => {
  $('.counter').text(140).removeClass('warning');
};

// Validate tweet input
const isTweetValid = (text) => {
  if (!text || !text.trim()) {
    showError("Tweet content is required.");
    return false;
  }

  if (text.length > 140) {
    showError("Tweet exceeds 140 character limit.");
    return false;
  }

  return true;
};

// DOM Ready
$(document).ready(function () {
  // Load all tweets on first load
  loadTweets();

  // Form submit handler
  $('#submit-tweet').on('submit', function (e) {
    e.preventDefault();

    const tweetText = $('#tweet-text').val();
    if (!isTweetValid(tweetText)) return;

    const serializedData = $(this).serialize();

    $.post('/api/tweets', serializedData)
      .then(() => {
        return $.get('/api/tweets'); // Fetch updated tweets after posting
      })
      .then((tweets) => {
        const latestTweet = tweets[tweets.length - 1]; // Grab newest
        const $newTweet = createTweetElement(latestTweet);
        $('#tweets-container').prepend($newTweet.slideDown(300));
        this.reset();
        resetCounter();
        $('html, body').animate({ scrollTop: 0 }, 300);
      })
      .catch((err) => {
        console.error('Tweet submission failed:', err);
        showError("Something went wrong while submitting your tweet.");
      });
  });
});