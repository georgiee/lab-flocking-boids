define(['stats'], function(Stats){
  // add fps counter
  var s = new Stats();
  s.setMode(0);
  
  s.domElement.style.position = 'absolute';
  s.domElement.style.right = '0px';
  s.domElement.style.bottom = '0px';
  document.body.appendChild( s.domElement );

  return s;
})