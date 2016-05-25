define(['underscore', 'debugPanel'], function(_, debugPanel){
  var SimpleDrawing = function(options){
    this.context = options.context;
  }

  SimpleDrawing.prototype = {
    zeroVector: [0,0,0],
    constructor: SimpleDrawing,
    clear: function(){
      var ctx = this.context;
      var color = 'rgba(66,66,66,1)';
      
      if(debugPanel.params.showTrails){
        color = 'rgba(66,66,66,0.1)';
      }

      ctx.fillStyle = color;
      ctx.fillRect(0,0, 500, 500)
    },
    
    drawArc: function(x, y, orientation, radius, viewAngle, color){
      var ctx = this.context;
      var color = color || 'rgba(255,255,255,0.25)';

      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = color;

      ctx.translate(x,y);
      ctx.rotate(orientation - viewAngle/2);// align with vehicle and center view angle.

      ctx.moveTo(0,0)
      ctx.arc(0, 0, radius, 0 , viewAngle );
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    },

    dot: function(x, y, radius, color){
      var ctx = this.context;

      var color = color || 'rgba(255,0,0,0.5)';
      var radius = radius || 5;
      
      ctx.save();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.fillStyle = color;
      ctx.arc(x, y, radius, 0 , Math.PI*2);
      ctx.fill();
      ctx.closePath();

      ctx.restore();

    },

    drawTriangle: function(x, y, angle, color, size){
      var ctx = this.context;

      var color = color || 'rgba(255,255,0,0.75)';
      var size = size || 10;
      var angle = _.isUndefined(angle) ? 0 : angle;

      ctx.save();
      ctx.fillStyle = color;
      ctx.beginPath();
      
      //align end of arrow to the origin
      ctx.translate(x, y);
      ctx.rotate(angle);

      ctx.moveTo(-size/2,0);
      ctx.lineTo(size/2,0);
      ctx.lineTo(0,-size/2);
      ctx.closePath();

      ctx.fill();

      ctx.restore();
    },
    
    drawVehicle: function(vehicle){
      var position = vehicle.position;
      var velocity = vehicle.velocity;

      this.drawTriangle(position.x, position.y, velocity.angle(), '#E80C7A', 20);
      if(debugPanel.params.showVelocity){
        this.drawVector(velocity, position, 10, '#00ffff');
      }
    },

    drawVector: function(vector, origin, amplification, color, strokeWidth){
      var ctx = this.context;

      var origin = origin || this.zeroVector;
      var amplification = amplification || 1;
      
      var vector = vector.clone().multiplyScalar(amplification);
      var sum = origin.clone().add(vector);
        
      angle = vector.angle();
      
      this.drawTriangle(sum.x, sum.y, angle);
      this.drawLine(origin.x, origin.y, sum.x, sum.y, color, strokeWidth);
    },

    drawBetweenVectors: function(v1, v2){
      this.drawLine(v1.x, v1.y, v2.x,v2.y);
    },

    drawLine: function(x1,y1, x2, y2, color, strokeWidth){
      var ctx = this.context;

      var color = color || 'rgba(255,0,0,0.75)';
      var strokeWidth = strokeWidth || 1;

      ctx.save();

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;

      ctx.moveTo(x1, y1);
      ctx.lineTo(x2,y2);

      ctx.stroke()
      ctx.restore();

    },
  }
  return SimpleDrawing;
})