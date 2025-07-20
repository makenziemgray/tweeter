"use strict";

const escape = function (str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createTweetElement = function (tweet) {
  const $tweet = $(`
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
  return $tweet;
};

const renderTweets = function (tweets) {
  const $container = $('#tweets-container');
  $container.empty();
  for (const tweet of tweets) {
    const $tweetElement = createTweetElement(tweet);
    $tweetElement.prependTo($container).slideDown(300);
  }
};

const loadTweets = () => {
  $.ajax({
    url: '/api/tweets',
    method: 'GET',
    dataType: 'json',
    success: renderTweets,
    error: () => showError("Failed to fetch tweets.")
  });
};

const showError = (message) => {
  const $box = $('.error-message');
  $box.stop(true, true).hide().text(`⚠️ ${message}`).slideDown();
};

const hideError = () => $('.error-message').slideUp();

const resetCounter = () => {
  $('.counter').text(140).removeClass('warning');
};

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

$(document).ready(function () {
  loadTweets();

  // Toggle new tweet form from nav
  $('.new-tweet-button').on('click', function () {
    const $form = $('.new-tweet');

    if ($form.is(':visible')) {
      $form.slideUp(() => {
        $form.addClass('hidden');
      });
    } else {
      $form.removeClass('hidden').hide().slideDown('fast', () => {
        $('#tweet-text').focus();
      });
    }
  });

  // Submit new tweet
  $('#submit-tweet').on('submit', function (e) {
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
      .catch((err) => {
        console.error('Tweet submission failed:', err);
        showError("Something went wrong while submitting your tweet.");
      });
  });

  // ✅ Scroll-based behavior
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 150) {
      $('.scroll-top-button').removeClass('hidden');
      $('.new-tweet-button').addClass('hidden');
    } else {
      $('.scroll-top-button').addClass('hidden');
      $('.new-tweet-button').removeClass('hidden');
    }
  });

  // ✅ Scroll-top button behavior
  $('.scroll-top-button').on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 300, () => {
      const $form = $('.new-tweet');
      if ($form.hasClass('hidden')) {
        $form.hide().removeClass('hidden').slideDown('fast', () => $('#tweet-text').focus());
      } else {
        $('#tweet-text').focus();
      }
    });
  });
});