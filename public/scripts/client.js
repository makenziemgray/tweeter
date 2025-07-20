"use strict";

// Scroll to top and focus on tweet input when clicking the down arrow
$('.scroll').click(() => {
  $('html, body').animate({ scrollTop: 0 }, 500);
  $('#tweet-text').focus();
});

// Escape function to sanitize user input (XSS protection)
const escape = function (str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// Builds and returns a tweet <article> element from a tweet object
const createTweetElement = function(tweet) {
  const $tweet = $(`
    <article class="tweet">
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

// Renders an array of tweets in the #tweets-container
const renderTweets = function(tweets) {
  const $container = $('#tweets-container');
  $container.empty(); // Clear existing tweets
  for (const tweet of tweets) {
    const $tweetElement = createTweetElement(tweet);
    $container.prepend($tweetElement); // Prepend newest first
  }
};

// Loads tweets via GET /api/tweets and renders them
const loadTweets = () => {
  $.ajax({
    url: '/api/tweets', // ✅ Correct route for GET
    method: 'GET',
    dataType: 'json',
    success: (tweets) => {
      renderTweets(tweets);
    },
    error: (error) => {
      console.error('Failed to load tweets:', error);
    }
  });
};

// Adds an error message to the top of the form
const appendError = (message) => {
  $('#submit-tweet').prepend(
    $("<span class='error'>")
      .text('⚠️ ' + message + ' ⚠️')
      .slideDown()
      .delay(3500)
      .hide(500)
  );
};

// Removes previous error message
const removeError = () => {
  $('.error').remove();
};

// Resets character counter back to 140
const resetCounter = () => {
  $('.counter').text(140);
};

// jQuery DOM Ready
$(document).ready(function () {
  // Load tweets on page load
  loadTweets();

  // Form submission handler
  $('#submit-tweet').on('submit', function (e) {
    e.preventDefault();

    const tweetText = $('#tweet-text').val();
    const serializedData = $(this).serialize();

    removeError();

    // Validate tweet content
    if (!tweetText.trim()) {
      appendError('You cannot post a blank tweet');
      return;
    }

    if (tweetText.length > 140) {
      appendError('Your tweet is too long!');
      return;
    }

    // ✅ POST to correct backend route
    $.post('/api/tweets', serializedData)
      .then(() => {
        loadTweets();        // Reload tweets after posting
        this.reset();        // Clear the form
        resetCounter();      // Reset the char counter
      })
      .catch((err) => {
        console.error('Tweet submission failed:', err);
        appendError('Something went wrong. Try again.');
      });
  });
});