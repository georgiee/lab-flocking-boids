define(['pixi'], function(PIXI){
  
  var CanvasLayer = function(width, height){
    this.buffer = new PIXI.CanvasBuffer(width, height);
    this.texture = PIXI.Texture.fromCanvas(this.buffer.canvas);
    
    PIXI.Sprite.call(this, this.texture);
  }

  CanvasLayer.prototype = Object.create(PIXI.Sprite.prototype);
  CanvasLayer.prototype.constructor = CanvasLayer;
  
  CanvasLayer.prototype.getContext = function(){
    return this.buffer.context;    
  }

  return CanvasLayer;
})