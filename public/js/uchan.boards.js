$('#view-selector').change(function(){
  if($(this).val() == 'list') {
    $('#type-view').removeClass("catalogue-view");
    $('#type-view').addClass("container");
  } else {
    if (!$(".catalogue-view")[0]){
      $('#type-view').removeClass("container");
      $('#type-view').addClass("catalogue-view");
    }
  }
});
