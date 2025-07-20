"use strict";

// Scroll to top and focus tweet input
$('.scroll').click(() => {
  $('html, body').animate({ scrollTop: 0 }, 500);
  $('#tweet-text').focus();
});

// Escape function to prevent XSS
const escape = function (str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// Build tweet <article> element
const createTweetElement = function(tweet) {
  const $tweet = $(`
    <article class="tweet" style="display: none;">
      <header class="th-header">
        <div class="name-left">
          <img src="${tweet.user.avatars}" alt="User Avatar">
          <h3>${escape(tweet.user.name)}</h3>
          <span class="handle">${escape(tweet.user.handle)}</span>
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

// Render all tweets
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
    success: renderTweets,
    error: () => showError("Failed to fetch tweets. Please try again.")
  });
};

// Show animated error message
const showError = (message) => {
  const $box = $('.error-message');
  $box.stop(true, true).hide(); // Reset animations
  $box.text(`⚠️ ${message}`);
  $box.slideDown();
};

// Hide error
const hideError = () => {
  $('.error-message').slideUp();
};

// Reset char counter
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
  loadTweets();

  $('#submit-tweet').on('submit', function (e) {
    e.preventDefault();

    hideError(); // ✅ Hide old error first

    const tweetText = $('#tweet-text').val();
    if (!isTweetValid(tweetText)) return;

    const serializedData = $(this).serialize();

    $.post('/api/tweets', serializedData)
      .then((newTweet) => {
        const $tweet = createTweetElement(newTweet);
        $('#tweets-container').prepend($tweet.slideDown(300));
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