var PUP = PUP || {};

PUP.Form = (function($, List, Breeds, Status){

  var batchOkCount, batchErrorCount;

  var init = function(){
    _buildSelectOptions( Breeds.getBreeds() );
    _resetBatchCount();
  };

  var submitSingle = function(){
    _submit({
      name: $("input[name='name']").val(),
      breed_id: $("select[name='breed_id']").val()
    }).done(function(){
      _resetForm();
    });
  };

  var submitBatch = function(){
    var file = $("input[type='file']")[0].files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(){

      var ajaxBatch = [];
      var rows = reader.result.split(/\r\n|\n/);

      for(var i=0; i<rows.length; i++){
        var row = rows[i].split(',');
        ajaxBatch.push( 
          _submit({name: row[1], breed_id: row[0]})
          .then(function(){
            _batchStatus('ok');
          }, function(){
            _batchStatus('error');
          })
        );
      }

      $.when.apply($, ajaxBatch).always(function(){
        setTimeout(function(){
          _resetBatchCount();
          $('#batch-ok').fadeOut(2000);
          $('#batch-error').fadeOut(2000);
        }, 4000);
      });
    };
  };

  var _batchStatus = function(status){
    if (status == 'ok'){
      batchOkCount += 1;
      $('#batch-ok').fadeIn().text("Registered " + batchOkCount + " puppies!");
    } else if (status == 'error') {
      batchErrorCount += 1;
      $('#batch-error').fadeIn().text("Failed to register " + batchErrorCount + " puppies :(");
    } 
  };

  var _submit = function(puppy){
    var postData = JSON.stringify({
      name: puppy.name,
      breed_id: puppy.breed_id
    });

    return $.ajax({
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

  var _resetForm = function(){
    $("input[name='name']").val("");
    $("select[name='breed_id']").val(1);
  };

  var _resetBatchCount = function(){
    batchOkCount = 0;
    batchErrorCount = 0;
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
    submitSingle: submitSingle,
    submitBatch: submitBatch
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

  $("[data-form='single']").on("submit", function(e){
    e.preventDefault();
    PUP.Form.submitSingle();
  });

    $("[data-form='batch']").on("submit", function(e){
    e.preventDefault();
    PUP.Form.submitBatch();
  });

  $('ul').on("click", '.adopt', function(e){
    e.preventDefault();
    var $link = $(this);
    PUP.List.removePuppy($link.data().id).done(function(){
      $link.parent().remove();
    });

  });
});
