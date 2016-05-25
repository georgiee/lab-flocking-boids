requirejs(['require-config'], function() {
  requirejs(['domReady!', 'scene-01', 'debugPanel'],

  function (document, Scene01) {
    var canvas = document.getElementById('stage');
    
    var scene = new Scene01(canvas, 500, 500);
    scene.run();
  });
})