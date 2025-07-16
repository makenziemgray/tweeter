/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {
  const loadTweets = function () {
    $.ajax({
      url: "/api/tweets",
      method: "GET",
      dataType: "json",
      success: function (tweets) {
        renderTweets(tweets);
      },
      error: function (err) {
        console.error("Failed to fetch tweets:", err);
      }
    });
  };

  const renderTweets = function (tweets) {
    const container = $('#tweets-container');
    container.empty();
    tweets.reverse().forEach(tweet => {
      const $tweet = createTweetElement(tweet);
      container.append($tweet);
    });
  };

  const createTweetElement = function(tweetData) {
    const $tweet = $(`
      <article class="tweet">
        <header>
          <div class="tweet-user">
            <img src="${tweetData.user.avatars}" alt="User avatar">
            <span class="name">${tweetData.user.name}</span>
          </div>
          <span class="handle">${tweetData.user.handle}</span>
        </header>
        <p class="tweet-text">${$('<div>').text(tweetData.content.text).html()}</p>
        <footer>
          <span class="timestamp">${timeago.format(tweetData.created_at)}</span>
          <div class="tweet-icons">
            <i class="fa-solid fa-flag"></i>
            <i class="fa-solid fa-retweet"></i>
            <i class="fa-solid fa-heart"></i>
          </div>
        </footer>
      </article>
    `);
    return $tweet;
  };

  $('form').on('submit', function (event) {
    event.preventDefault();
    const $form = $(this);
    const tweetText = $form.find('textarea').val().trim();

    if (!tweetText) {
      return alert("Tweet cannot be empty.");
    }
    if (tweetText.length > 140) {
      return alert("Tweet exceeds 140 characters.");
    }

    $.post("/api/tweets", $form.serialize())
      .done(() => {
        $form.find('textarea').val("");
        $form.find('.counter').text(140);
        loadTweets();
      });
  });

  loadTweets();
});
