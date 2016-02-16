var PUP = PUP || {};


PUP.Breeds = (function($){

  var breedData = {};

  var getBreeds = function(){
    return breedData;
  };
  
  var update = function(){
    return $.ajax({
      method: "GET",
      url: "https://ajax-puppies.herokuapp.com/breeds.json"
    }).done(function(data){
      parseBreeds(data);
    });
  };

  var parseBreeds = function(breeds){
    $.each(breeds, function(i, breed){
      breedData[breed.id] = breed.name;
    });
  };

  return {
    update: update,
    getBreeds: getBreeds
  };

})($);


PUP.Form = (function($, Breeds){

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
        PUP.List.addPuppy(puppy);
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

})($, PUP.Breeds);


PUP.List = (function($, Breeds){

  var update = function(){
    _getPuppies();
  };

  var addPuppy = function(puppy){
    $('ul').prepend(_listItem(puppy));
  };

  var _getPuppies = function(){
    $.ajax({
      method: "GET", 
      url: "https://ajax-puppies.herokuapp.com/puppies.json",
      success: function(puppies){
        _newList(puppies);
      }
    });
  };

  var _newList = function(puppies){
    var list = [];
    $.each(puppies, function(i, puppy){
      list.push( _listItem(puppy) );
    });

    $('ul').empty().append(list);
  };

  var _listItem = function(puppy){
    var diff = Math.abs(new Date() - new Date(puppy.created_at));
    var minutes = Math.floor((diff/1000)/60);
    var breed = puppy.breed ? puppy.breed.name : Breeds.getBreeds()[puppy.breed_id];

    return ( $('<li/>').append("<strong>" + puppy.name + "</strong>")
                       .append(" (" + breed + ")")
                       .append(", created " + minutes + " minutues ago") );
  };

  return {
    update: update,
    addPuppy: addPuppy
  };

})($, PUP.Breeds);

// var then = new Date(puppies[0].created_at)
// var now = new Date()
// var diff = Math.round(now - then)
// var minutes = Math.floor((diff/1000)/60)

$( document ).ready(function(){
  PUP.Breeds.update().done(function(){
    PUP.Form.init();
    PUP.List.update();
  });
  
  //events
  $('#refresh').on("click", function(e){
    e.preventDefault();
    PUP.list.update();
  });

  $('form').on("submit", function(e){
    e.preventDefault();
    PUP.Form.submit();
  });
});