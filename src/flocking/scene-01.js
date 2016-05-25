define(['pixi', 'underscore', 'canvas-layer', 'vehicle', 'simple-drawing', 'debugPanel', '../debug/stats-instance'], function(PIXI, _, CanvasLayer, Vehicle, SimpleDrawing, debugPanel, stats){
  var Scene01 = function(canvas, width, height){
    this.width = width;
    this.height = height;
    this.canvas = canvas;

    this.stage = new PIXI.Stage(0x333333);
    this.renderer = new PIXI.CanvasRenderer(width, height, { view: this.canvas, autoResize: true });
    
    //to draw raw canvas commands on top of the pixi stage
    this.debugLayer = new CanvasLayer(width, height);
    this.stage.addChild(this.debugLayer);
    this.update = _.bind(this.update, this);

    debugPanel.gui.add(this, 'reset').name('Restart');
    debugPanel.controllers.vehiclesCount.onChange(_.bind(this.changeVehicleCount, this));
  }

  Scene01.prototype = {
    constructor: Scene01,
    
    reset: function(){
      this.vehicles.length = 0;
      this.create();
    },
    changeVehicleCount: function(count){
      while(count > this.vehicles.length){
        this.addVehicle();
      }
      
      while(count < this.vehicles.length){
        this.removeVehicle();
      }
    },
    addVehicle: function(options){
      var options = options || {};

      var vehicle = new Vehicle({
        debug: options.debug,
        debugDrawing: this.debugDrawing,
        mass: 0.5 + Math.random()*2,
        position: [250 + (1 - Math.random() * 2) * 250, 250 + (1 - Math.random() * 2) * 250, 0]
      });
      this.vehicles.push(vehicle);  
    },
    
    removeVehicle: function(){
      this.vehicles.pop();
    },

    create: function(){

      this.vehicles = [];
      
      this.debugDrawing = new SimpleDrawing({
        context: this.debugLayer.getContext()
      });
      
      var l = debugPanel.params.vehicles;
      for(var i = 0; i < l; i++){
        this.addVehicle({
          debug: i == 0,
          drag: i == 1,
        });
      }
    },

    run: function(){
      console.log('run Scene01');
      this.create();
      this.update();
    },

    update: function(){
      //this.resize()
      stats.begin();

      var mouse = this.stage.getMousePosition();

      this.renderer.render(this.stage);
      this.debugDrawing.clear();
      
      var vehicle;
      
      for(var i = 0, l = this.vehicles.length; i < l; i++){
        vehicle = this.vehicles[i];
        vehicle.update(1/60);
        vehicle.wrapAround(this.width, this.height);
        
        if(vehicle.drag){
          //vehicle.seekMouse([mouse.x, mouse.y, 0]);
          //vehicle.moveToMouse([mouse.x, mouse.y, 0]);
        }
        //vehicle.wander();
        vehicle.flocking(this.vehicles);
        
        if(debugPanel.params.wander > 0){
          vehicle.wander();
        }
        
        if(debugPanel.params.mouseAttractor > 0){
          vehicle.followMouse([mouse.x, mouse.y, 0]);
        }

        this.debugDrawing.drawVehicle(vehicle);

      }

      stats.end();

      requestAnimationFrame(this.update);
    }
  }

  return Scene01;
})