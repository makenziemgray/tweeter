$(document).ready(function () {
  $('.new-tweet textarea').on('input', function () {
    const charCount = $(this).val().length;
    const charsLeft = 140 - charCount;

    const counter = $(this).closest('form').find('.counter');
    counter.text(charsLeft);

    if (charsLeft < 0) {
      counter.addClass('counter-red');
    } else {
      counter.removeClass('counter-red');
    }
  });
});