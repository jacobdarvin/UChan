let viewChoice = localStorage.getItem('viewChoice');

$( document ).ready(function() {
    if(viewChoice === 'list') {
      $("#view-selector").val("list");

      $('#type-view').removeClass("catalogue-view");
      $('#type-view').addClass("container");
    } else {
      $('#type-view').removeClass("container");
      $('#type-view').addClass("catalogue-view");
    }
});

$('#view-selector').change(function(){
  var v = window.location.href;

  if($(this).val() == 'list') {
    localStorage.setItem('viewChoice', 'list');
    k = v + '?' + 'list=true';

    window.location.replace(k);

  } else {
    localStorage.setItem('viewChoice', 'catalogue');
    window.location.replace(window.location.origin + window.location.pathname);
  }
});
