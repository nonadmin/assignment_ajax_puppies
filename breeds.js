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