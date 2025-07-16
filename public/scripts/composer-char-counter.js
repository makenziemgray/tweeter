$(document).ready(function() {

  // Character Counter
  $('.new-tweet textarea').on('input', function() {
    const charCount = $(this).val().length;
    const charsLeft = 140 - charCount;

    const counter = $(this).closest('form').find('.counter');
    counter.text(charsLeft);

    if (charsLeft < 0) {
      counter.addClass('invalid'); // Style this in your CSS
    } else {
      counter.removeClass('invalid');
    }
  });

  // Form Submission (prevent full-page reload)
  $('.new-tweet form').on('submit', function(event) {
    event.preventDefault(); 

    const $form = $(this);
    const tweetText = $form.find('textarea').val().trim();

    // Optional: client-side validation
    if (!tweetText) {
      alert("Tweet cannot be empty.");
      return;
    }

    if (tweetText.length > 140) {
      alert("Tweet is too long.");
      return;
    }

    // Post the tweet via AJAX
    $.post('/api/tweets', { text: tweetText })
      .done(() => {
        // Optionally clear the form & reset counter
        $form.find('textarea').val('');
        $form.find('.counter').text('140');

        // Reload tweets if you implement tweet rendering
        // loadTweets(); ← you'll build this later
      })
      .fail((err) => {
        console.error("Tweet failed to send:", err);
        alert("Failed to post tweet.");
      });
  });

});