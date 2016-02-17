var PUP = PUP || {};

PUP.Form = (function($, List, Breeds, Status){

  var init = function(){
    _buildSelectOptions( Breeds.getBreeds() );
  };

  var submit = function(){
    var postData = JSON.stringify({
      name: $("input[name='name']").val(),
      breed_id: $("select[name='breed_id']").val()
    });

    $.ajax({
      method: "POST",
      url: "https://ajax-puppies.herokuapp.com/puppies.json",
      data: postData,
      contentType: "application/json",
      dataType: "json",

      success: function(puppy){
        List.addPuppy(puppy);
      }
    });
  };

  var _buildSelectOptions = function(breeds){
    var options = [];

    for(var id in breeds){
      options.push( $('<option/>', {value: id}).text(breeds[id]) );
    }

    $('select').empty().append(options);
  };

  return {
    init: init,
    submit: submit
  };

})($, PUP.List, PUP.Breeds, PUP.Status);

// var then = new Date(puppies[0].created_at)
// var now = new Date()
// var diff = Math.round(now - then)
// var minutes = Math.floor((diff/1000)/60)

$( document ).ready(function(){
  PUP.Status.init();

  PUP.Breeds.update().done(function(){
    PUP.Form.init();
    PUP.List.update();
  });
  
  //events
  $('#refresh').on("click", function(e){
    e.preventDefault();
    PUP.List.update();
  });

  $('form').on("submit", function(e){
    e.preventDefault();
    PUP.Form.submit();
  });

  $('ul').on("click", '.adopt', function(e){
    e.preventDefault();
    var $link = $(this);
    PUP.List.removePuppy($link.data().id).done(function(){
      $link.parent().remove();
    });

  });
});