define([], function(){
  var Vec3 = function(x, y, z){
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  Vec3.prototype = {
    constructor: Vec3,

    _x: 0, _y: 0, _z:0,

    get x () { return this._x; },
    set x ( value ) {this._x = value; },

    get y () { return this._y; },
    set y ( value ) {this._y = value; },

    get z () { return this._z; },
    set z ( value ) {this._z = value; },

    add: function ( v ) {

      this.x += v.x;
      this.y += v.y;
      this.z += v.z;

      return this;

    },

    addScalar: function ( s ) {

      this.x += s;
      this.y += s;
      this.z += s;

      return this;

    },

    subtract: function ( v ) {

      this.x -= v.x;
      this.y -= v.y;
      this.z -= v.z;

      return this;

    },

    lengthSq: function () {

      return this.x * this.x + this.y * this.y + this.z * this.z;

    },

    length: function () {

      return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

    },
    limitLength: function(maxLength){

      if(this.length() > maxLength){
        this.setLength(maxLength);
      }
      
      return this;
    },

    setLength: function ( l ) {

      var oldLength = this.length();

      if ( oldLength !== 0 && l !== oldLength ) {

        this.multiplyScalar( l / oldLength );
      }

      return this;

    },

    divide: function ( v ) {

      this.x /= v.x;
      this.y /= v.y;
      this.z /= v.z;

      return this;

    },

    divideScalar: function ( scalar ) {

      if ( scalar !== 0 ) {

        var invScalar = 1 / scalar;

        this.x *= invScalar;
        this.y *= invScalar;
        this.z *= invScalar;

      } else {

        this.x = 0;
        this.y = 0;
        this.z = 0;

      }

      return this;

    },

    multiplyScalar: function ( s ) {

      this.x *= s;
      this.y *= s;
      this.z *= s;

      return this;

    },
    
    dot: function ( v ) {

      return this.x * v.x + this.y * v.y + this.z * v.z;

    },
    
    normalize: function () {

      return this.divideScalar( this.length() );

    },
    
    angleTo: function (v) {

      return Vec3.angleBetween(this, v);

    },
    
    angle: function(){
      return Math.atan2(this.y, this.x) + Math.PI/2;
    },

    clone: function () {

      return new Vec3( this.x, this.y, this.z );

    },
  }

  Vec3.divideScalar = function(vector, value){
    vector.clone().divideScalar(value);
  }
  
  Vec3.angleBetween = function(a, b){

    var tempA = a.clone();
    var tempB = b.clone();
 
    tempA.normalize();
    tempB.normalize();
 
    var cosine = tempA.dot(tempB);

    if(cosine > 1.0){
        return 0;
    } else {
        return Math.acos(cosine);
    }  
  }

  Vec3.subtract = function(a, b){
    return a.clone().subtract(b);
  }
  
  return Vec3;
})