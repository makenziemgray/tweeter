"use strict";

// Safely escape tweet text to prevent XSS
const escape = function (str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// Create tweet <article> element
const createTweetElement = function (tweet) {
  return $(`
    <article class="tweet" style="display: none;">
      <header class="th-header">
        <div class="name-left">
          <img src="${tweet.user.avatars}" alt="User Avatar" />
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
          <i class="far fa-flag"></i>
          <i class="fas fa-retweet"></i>
          <i class="far fa-heart"></i>
        </div>
      </footer>
    </article>
  `);
};

// Loop through tweets and add them to DOM
const renderTweets = function (tweets) {
  const $container = $('#tweets-container');
  $container.empty(); // Clear existing tweets
  for (const tweet of tweets) {
    const $tweet = createTweetElement(tweet);
    $tweet.prependTo($container).slideDown(300);
  }
};

// AJAX call to fetch tweets
const loadTweets = () => {
  $.ajax({
    url: '/api/tweets',
    method: 'GET',
    dataType: 'json',
    success: renderTweets,
    error: () => showError("Failed to fetch tweets.")
  });
};

// Display error message
const showError = (message) => {
  $('.error-message')
    .stop(true, true)
    .hide()
    .text(`⚠️ ${message}`)
    .slideDown();
};

// Hide any visible error
const hideError = () => $('.error-message').slideUp();

// Reset tweet character counter
const resetCounter = () => {
  $('.counter').text(140).removeClass('warning');
};

// Validate tweet content
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

// Handle tweet form toggle from nav
const handleNavToggleClick = () => {
  const $form = $('.new-tweet');
  if ($form.is(':visible')) {
    $form.slideUp(() => $form.addClass('hidden'));
  } else {
    $form.removeClass('hidden').hide().slideDown('fast', () => {
      $('#tweet-text').focus();
    });
  }
};

// Handle tweet form submission
const handleTweetSubmit = function (e) {
  e.preventDefault();
  hideError();

  const tweetText = $('#tweet-text').val();
  if (!isTweetValid(tweetText)) return;

  const serializedData = $(this).serialize();

  $.post('/api/tweets', serializedData)
    .then(() => {
      loadTweets();
      this.reset();
      resetCounter();
      $('#tweet-text').blur();
    })
    .catch(() => {
      showError("Something went wrong while submitting your tweet.");
    });
};

// Toggle button visibility based on scroll position
const handleScroll = () => {
  if ($(window).scrollTop() > 150) {
    $('.scroll-top-button').removeClass('hidden');
    $('.new-tweet-button').addClass('hidden');
  } else {
    $('.scroll-top-button').addClass('hidden');
    $('.new-tweet-button').removeClass('hidden');
  }
};

// Handle scroll-top button click
const handleScrollTopClick = () => {
  $('html, body').animate({ scrollTop: 0 }, 300, () => {
    const $form = $('.new-tweet');
    if ($form.hasClass('hidden')) {
      $form.hide().removeClass('hidden').slideDown('fast', () => {
        $('#tweet-text').focus();
      });
    } else {
      $('#tweet-text').focus();
    }
  });
};

// DOM Ready
$(document).ready(function () {
  loadTweets();

  // Event Listeners
  $('.new-tweet-button').on('click', handleNavToggleClick);
  $('#submit-tweet').on('submit', handleTweetSubmit);
  $(window).on('scroll', handleScroll);
  $('.scroll-top-button').on('click', handleScrollTopClick);
});