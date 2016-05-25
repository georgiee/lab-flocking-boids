define(['underscore', 'math/vec3', 'debugPanel'], function(_, Vec3, debugPanel){
  var Vehicle = function(options){
    var defaults = {
      position: [0, 0],
      mass: 1,
      debug: false
    }

    var options = options || {};
    options = _.defaults(options, defaults);
    this.debug = options.debug;
    this.drag = options.drag;

    this.debugDrawing = options.debugDrawing;

    this.mass = options.mass || 1;
    this._maxSpeed = options.maxSpeed || 10;
    this._maxForce = options.maxForce || 0.3;

    this.acceleration = new Vec3();
    //this.velocity = new Vec3(1 - Math.random()*2,1 - Math.random()*2,0);
    this.velocity = new Vec3(0,0,0);

    this.position = new Vec3(options.position[0], options.position[1], 0);

    this.wanderTheta = 0;
  }

  Vehicle.prototype = {
    constructor: Vehicle,
    get maxSpeed(){
      //return this._maxSpeed;
      return debugPanel.params.speed;
    },
    get maxForce(){
      //return this._maxForce;
      return debugPanel.params.force;
    },

    update: function(dt){
      
    },

    steerToSeek: function(target){

      var desired = Vec3.subtract(target, this.position).setLength(this.maxSpeed);
      var seek = desired.subtract(this.velocity).limitLength(this.maxForce);
      return seek;
    },

    applySteeringForce: function(force){
      var newAcceleration = force.clone()
        .limitLength(this.maxForce)
        .divideScalar(this.mass);
      
      this.velocity.add(newAcceleration).limitLength(this.maxSpeed);
      this.position.add(this.velocity);
    },
    
    wander: function(){
      var force = this.wanderForce().multiplyScalar(debugPanel.params.wander);
      this.applySteeringForce(force);
    },

    wanderForce: function(){
      this.wanderTheta += (1 - 2*Math.random()) * 0.1;

      var wanderRadius = 50; //limit chaneg radius in px. The larger the more random it appears
      var wanderDistance = 100;      
      var heading = this.velocity.angle();
      
      var circle = this.velocity.clone();
      circle = circle.setLength(wanderDistance);
      circle = circle.add(this.position);

      var pointOnCircle = new Vec3(wanderRadius * Math.cos(heading + this.wanderTheta), wanderRadius * Math.sin(heading + this.wanderTheta));
      var target = circle.add(pointOnCircle);
      if(this.debug && debugPanel.params.showRadius){
        this.debugDrawing.dot(target.x, target.y)
      }
      return this.steerToSeek(target);
    },
    
    followMouse: function(mousePosition){
      if(mousePosition[0] < 0) return;

      var mousePosition = new Vec3(mousePosition[0], mousePosition[1], mousePosition[2]);
      var steer = this.steerToSeek(mousePosition).multiplyScalar(debugPanel.params.mouseAttractor);
      this.applySteeringForce(steer);
    },

    flocking: function(others){
      var peripheralViewAngle = 2 * Math.PI;//360
      var separationCount = 0;
      var separationRadius = 25;

      var cohereRadius = 50;
      var cohereCount = 0;
      var averageLocation = new Vec3();
      var cohereSteer = new Vec3();

      var alignCount = 0;
      var alignRadius = 50;
      var averageAlignment = new Vec3();
      var alignSteer = new Vec3();

      var averageFleeVelocity = new Vec3();
      var separationSteer = new Vec3();
      var steer = new Vec3();

      var other;
      var self = this;
      var neighbourCount = 0;
      var MAX_NEIGHBOURS = 10;
      var maxDistance = cohereRadius;
      var maxDistanceSquared = maxDistance*maxDistance;

      if(debugPanel.params.showRadius && this.debug){
        this.debugDrawing.drawArc(this.position.x, this.position.y, this.velocity.angle() - Math.PI/2, cohereRadius, peripheralViewAngle, 'rgba(255,0,0,0.25)')
        this.debugDrawing.drawArc(this.position.x, this.position.y, this.velocity.angle() - Math.PI/2, separationRadius, peripheralViewAngle, 'rgba(0,255,0,0.25)')
        this.debugDrawing.drawArc(this.position.x, this.position.y, this.velocity.angle() - Math.PI/2, alignRadius, peripheralViewAngle, 'rgba(0,0,255,0.25)')
      }

      for(var i=0, l = others.length; i < l; i++){
        other = others[i];
        if(other == this) continue;
        
        var distanceSquared = Vec3.subtract(other.position, self.position).lengthSq();
        if(distanceSquared > maxDistanceSquared) continue;
        neighbourCount++

        if(neighbourCount > MAX_NEIGHBOURS) break;
        var distance = Math.sqrt(distanceSquared);
        
        ///////////////
        //separation //
        ///////////////
        if(debugPanel.params.separation > 0 && distance < separationRadius){
          if(this.debug && debugPanel.params.showRadius){
            this.debugDrawing.dot(other.position.x, other.position.y, 5, 'rgba(255,255,255,0.5)');
          }
          
          separationCount++;
          var flee = Vec3.subtract(this.position, other.position).normalize().divideScalar(distance);
          averageFleeVelocity.add(flee);
          //TODO: distance:0, flee full speed, random directiom
        }  
      
        
        /////////////
        //cohesion //
        /////////////
        if(debugPanel.params.cohesion > 0 && distance < cohereRadius){
          if(this.debug && debugPanel.params.showRadius){
            this.debugDrawing.dot(other.position.x, other.position.y, 5, 'rgba(255,255,255,0.5)');
          }

          cohereCount++;
          averageLocation.add(other.position);
        }
        
        //////////
        //align //
        //////////
        if(debugPanel.params.alignment > 0 && distance < alignRadius){
          if(this.debug && debugPanel.params.showRadius){
            this.debugDrawing.dot(other.position.x, other.position.y, 5, 'rgba(255,255,255,0.5)');
          }

          alignCount++;
          averageAlignment.add(other.velocity);
        }

      }
      
      ////////////////////
      //analyze results //
      ////////////////////
      if(separationCount > 0){
        averageFleeVelocity.divideScalar(separationCount).setLength(this.maxSpeed);
        separationSteer = Vec3.subtract(averageFleeVelocity, this.velocity).limitLength(this.maxForce);
      }
      
      if(cohereCount > 0){
        averageLocation.divideScalar(cohereCount);
        var cohereSteer = this.steerToSeek(averageLocation);

        //var direction = averageLocation.subtract(this.position);
        //var desired = direction.setLength(this.maxSpeed);
        //cohereSteer = desired.subtract(this.velocity).limitLength(this.maxForce);
      }

      if(alignCount > 0){
        //var desired = averageAlignment.divideScalar(alignCount).normalize();
        //faster movement
        var desired = averageAlignment.divideScalar(alignCount).setLength(this.maxSpeed);
        alignSteer = Vec3.subtract(desired, this.velocity).limitLength(this.maxForce);
      }


      //steer = steer.add(cohereSteer.multiply(1.3))
      //steer = steer.add(alignSteer.multiply(2))
      
      steer.add(separationSteer.multiplyScalar(debugPanel.params.separation))
      steer.add(cohereSteer.multiplyScalar(debugPanel.params.cohesion))
      steer.add(alignSteer.multiplyScalar(debugPanel.params.alignment))
      //steer.add(this.wanderForce().multiplyScalar(0.2))
      
      this.applySteeringForce(steer);
    },
    
    otherIsVisible: function(other, radius, viewAngle){
      var distance = Vec3.subtract(other.position, this.position).length();
      var vectorTo = Vec3.subtract(other.position, this.position);
      var angleTo = this.velocity.angleTo(vectorTo);
      return distance < radius && angleTo < viewAngle/2;
    },
    
    moveToMouse: function(pos){
      this.position.x = pos[0];
      this.position.y = pos[1];
      this.velocity.x = 250-pos[0];
      this.velocity.y = 250-pos[1];
      this.velocity.normalize();
    },

    wrapAround: function(width, height){
      var padding = 20;

      if(this.position.x < -padding){ this.position.x = width + padding }
      if(this.position.x > width + padding){ this.position.x = -padding }
      if(this.position.y < -padding){ this.position.y = height + padding }
      if(this.position.y > height+padding){ this.position.y = -padding }
    }
  }

  return Vehicle;
});