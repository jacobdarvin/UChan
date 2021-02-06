//let viewChoice = localStorage.getItem('viewChoice');

var url_string = window.location.href
var url = new URL(url_string);

var view_value = url.searchParams.get("view");
var sort_value = url.searchParams.get("sort");

console.log(view_value);
console.log(sort_value);

//RE UPDATE VALUES
$( document ).ready(function() {
    //if(viewChoice === 'list') {
    if(view_value === 'list') {
      $("#view-selector").val("list");

      $('#type-view').removeClass("catalogue-view");
      $('#type-view').addClass("container");
    } else {
      $('#type-view').removeClass("container");
      $('#type-view').addClass("catalogue-view");
    }

    if(sort_value === 'newest') {
      $("#sort-selector").val("newest");
    } else if (sort_value === 'oldest'){
      $("#sort-selector").val("oldest");
    } else if (sort_value === 'most_replies'){
      $("#sort-selector").val("most_replies");
    }

});


$('#view-selector').change(function(){
  if(sort_value) {
    var v = window.location.origin + window.location.pathname + "?sort=" + sort_value;
  } else {
    var v = window.location.origin + window.location.pathname;
  }

  if($(this).val() == 'list') {
    //localStorage.setItem('viewChoice', 'list');
    var k = v + '?' + 'view=list';

    if(sort_value) {
      var k = v + '&' + 'view=list';
    }

    window.location.replace(k);
  } else {
    //localStorage.setItem('viewChoice', 'catalogue');
    if(sort_value)
      window.location.replace(window.location.origin + window.location.pathname + "?sort=" + sort_value);
    else
      window.location.replace(window.location.origin + window.location.pathname);
  }
});

$('#sort-selector').change(function(){
  if(view_value) {
    var v = window.location.origin + window.location.pathname + "?view=" + view_value;
  } else {
    var v = window.location.origin + window.location.pathname;
  }

  if($(this).val() == 'newest') {
    var k = v + '?' + 'sort=newest';
    if(view_value) {
      var k = v + '&' + 'sort=newest';
    }
    window.location.replace(k);

  } else if($(this).val() == 'oldest') {
    var k = v + '?' + 'sort=oldest';
    if(view_value) {
      var k = v + '&' + 'sort=oldest';
    }
    window.location.replace(k);

  } else if($(this).val() == 'most_replies') {
    var k = v + '?' + 'sort=most_replies';
    if(view_value) {
      var k = v + '&' + 'sort=most_replies';
    }
    window.location.replace(k);

  } else {
    if(view_value)
      window.location.replace(window.location.origin + window.location.pathname + "?view=" + view_value);
    else
      window.location.replace(window.location.origin + window.location.pathname);
  }
});
