var PUP = PUP || {};

PUP.List = (function($, Breeds){

  var update = function(){
    _getPuppies();
  };

  var addPuppy = function(puppy){
    $('ul').prepend(_listItem(puppy));
  };

  var removePuppy = function(puppy_id){
    return $.ajax({
      method: "DELETE", 
      url: "https://ajax-puppies.herokuapp.com/puppies/" + puppy_id + ".json",
    });    
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
    var adoptLink = $("<a/>", {href: '#', class: 'adopt', 'data-id': puppy.id}).text("adopt");

    return ( $('<li/>').append("<strong>" + puppy.name + "</strong>")
                       .append(" (" + breed + ")")
                       .append(", created " + minutes + " minutues ago -- ")
                       .append( adoptLink ) );
  };

  return {
    update: update,
    addPuppy: addPuppy,
    removePuppy: removePuppy
  };

})($, PUP.Breeds);