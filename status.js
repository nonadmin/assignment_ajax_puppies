var PUP = PUP || {};

PUP.Status = (function($){

  var _statusDiv;
  var _timeoutID;

  var init = function(){
    _statusDiv = $('#status');
    $( document ).ajaxSuccess(_ok)
                 .ajaxStart(_initiated)
                 .ajaxError(function(e,r,s,error){
                   _alert(error);
                 });
  };

  var _changeDiv = function(statusClass, text, fadeOut){
    _statusDiv.removeClass().addClass(statusClass).text(text)
              .fadeIn(function(){
                if (fadeOut){
                  setTimeout(function(){
                    _statusDiv.fadeOut(2000);
                  }, 2000);
                }
              });    
  };

  var _ok = function(){
    clearTimeout(_timeoutID);

    _changeDiv('status-ok', 'Finished!', true);
  };

  var _initiated = function(){
    _changeDiv('status-warn', 'Waiting...');

    _timeoutID = setTimeout(function(){
      _changeDiv('status-warn', 'Sorry this is taking so long...');
    }, 1000);
  };

  var _alert = function(error){
    clearTimeout(_timeoutID);

    var errorMsg = error || "Unknown error occured, are you online?";
    _changeDiv('status-alert', errorMsg, true);
  };

  return {
    init: init,
  };

})($);