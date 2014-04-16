$(function() {
  $('.client-edit-btn').on('click', function() {
    $(this).closest('.client-container').find('.client-name, .client-contact, .client-email').toggleClass('hide');
    $(this).closest('.client-container').find('.client-details').toggleClass('full');
    $(this).closest('.client-container').find('.client-edit-form').toggleClass('hide');
  });

  $('.date').pickadate();
});