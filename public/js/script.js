$(function() {
  $('.client-edit-btn').on('click', function() {
    $(this).closest('.client-container').find('.client-name, .client-contact, .client-email').toggleClass('hide');
    $(this).closest('.client-container').find('.client-details').toggleClass('full');
    $(this).closest('.client-container').find('.client-edit-form').toggleClass('hide');
  });

  $('.date').pickadate();



  $('.update-todo').click(function(e){
    e.preventDefault();
    console.log('select_link clicked');
                    
    var data = {};
    data.id = $(this).data('id');
    data.title = $(this).prev('input').val();
    
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/projects/todo/',            
      success: function(data) {
        $('.todos-list').append('<li>'+ data +'</li>');
        $('.todo-input').val('');
      }
    });
  });
});