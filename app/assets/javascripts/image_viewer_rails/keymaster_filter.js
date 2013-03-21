keymasterCommandMode          = false;
keymasterCommandModeCallback  = function(commandMode){};

key.filter = function (event){
  var tagName = (event.target || event.srcElement).tagName;
  // console.log("Keycode is: " + event.keyCode + ", and Command mode is: " + keymasterCommandMode + ', and current scope is: ' + key.getScope());

  if (keymasterCommandMode) {
    // command mode is on, trap everything!
    return true;
  } else if (event.keyCode === 220) {
    // pressed '\' to toggle command mode
    return true;
  } else
    // ignore keypressed in any elements that support keyboard data input
    return !(tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA');
};

key('\\', function(){
  keymasterCommandMode = !keymasterCommandMode;
  keymasterCommandModeCallback(keymasterCommandMode);
  return false;
});