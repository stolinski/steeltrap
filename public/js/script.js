google.load('visualization', '1', {packages: ['corechart']});

$(function() {
  $('.client-edit-btn').on('click', function() {
    $(this).closest('.client-container').find('.client-name, .client-contact, .client-email').toggleClass('hide');
    $(this).closest('.client-container').find('.client-details').toggleClass('full');
    $(this).closest('.client-container').find('.client-edit-form').toggleClass('hide');
  });

  $('.todo-wrapper h4').on('click', function(){
    console.log("yoi");
    $(this).nextAll('.new-todo').toggleClass('hidden');
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
        $('.todos-list').append('<li class="todo-item not-complete">'+ data +'</li>');
        $('.todo-input').val('');
      }
    });
  });

  $('.todo-item').click(function(e){
    e.preventDefault();

    var data = {};
    data.id = $(this).data('id');
    data.parent = $(this).data('parent');

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/projects/todo/edit/',            
      success: function(data) {
        if(data[0]) {
          $('*[data-id="'+ data[1] +'"]').removeClass('not-complete').addClass('complete');
        } else {
          $('*[data-id="'+ data[1] +'"]').removeClass('complete').addClass('not-complete');
        }
      }
    });
  }); 

  
});
//   function drawVisualization() {
//   // Create and populate the data table.
//   var data = google.visualization.arrayToDataTable([
//     ['x', 'Cats', 'Blanket 1', 'Blanket 2'],
//     ['A',   1,       1,           0.5],
//     ['B',   2,       0.5,         1],
//     ['C',   4,       1,           0.5],
//     ['D',   8,       0.5,         1],
//     ['E',   7,       1,           0.5],
//     ['F',   7,       0.5,         1],
//     ['G',   8,       1,           0.5],
//     ['H',   4,       0.5,         1],
//     ['I',   2,       1,           0.5],
//     ['J',   3.5,     0.5,         1],
//     ['K',   3,       1,           0.5],
//     ['L',   3.5,     0.5,         1],
//     ['M',   1,       1,           0.5],
//     ['N',   1,       0.5,         1]
//   ]);
//   // console.log($('#visualization').data('chart').split(','));
//   // var yo = $('#visualization').data('chart').split(',');
//   // for (i=0; i< yo.length; i++) {
//   //   yo[i] = yo[i].split('.').map(Number);
//   // }
//   // console.log(yo);
//   // var data = google.visualization.arrayToDataTable(yo);

//   // Create and draw the visualization.
//   new google.visualization.LineChart(document.getElementById('visualization')).
//       draw(data, {
//                   width: 900, height: 400, colors:['#E96E57', '#3498db', '#40474D'], backgroundColor: 'transparent',
//                   vAxis: {maxValue: 10, gridlines: {color:'#ddd'}, textStyle:{color: '#40474D'}},
//                   hAxis: {textStyle: {color: '#40474D'}}}
//           );
// }

// google.setOnLoadCallback(drawVisualization);
