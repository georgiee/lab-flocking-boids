define(["vendor/dat.gui"], function(gui) {
  var gui = new dat.GUI();

  var params = {
    note: 'Flocking Example',
    vehicles: 350,
    speed: 3,
    force: 0.17,
    separation: 0.6,
    cohesion: 0.47,
    alignment: 0.43,
    wander: 0.05,

    separation: 0.35,
    cohesion: 0.36,
    alignment: 0.44,
    wander: 0.195,

    mouseAttractor: 0.00,
    showVelocity: false,
    showTrails: true,
    showRadius: false,
  }

  var folder;

 gui.add(params, 'note').name('Note:');
 var controllerVehiclesCount = gui.add(params, 'vehicles', 0, 1000).step(1);
 gui.add(params, 'speed', 0, 20);
 gui.add(params, 'force', 0, 1);
 gui.add(params, 'mouseAttractor', 0.0, 1.0);

 gui.add(params, 'separation', 0, 1);
 gui.add(params, 'cohesion', 0, 1);
 gui.add(params, 'alignment', 0, 1);
 gui.add(params, 'wander', 0, 1);

  gui.add(params, 'showVelocity');  
  gui.add(params, 'showTrails');
  gui.add(params, 'showRadius');
  return {
    gui: gui,
    params: params,
    controllers: {
      vehiclesCount: controllerVehiclesCount
    }
  };
});