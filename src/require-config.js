requirejs.config({
    baseUrl: 'src/flocking',
    paths: {
      debugPanel : "../debug/debug-panel",
      vendor: '../vendor',
      math: '../math',
      
      stats:'../vendor/stats',
      text : "../vendor/require-text",
      lodash: '../vendor/lodash',
      pixi: '../vendor/pixi.dev',
      glmatrix: '../vendor/gl-matrix',
      domReady : "../vendor/require-domReady"
    },
    
    map: {
      "*": {
        underscore: 'lodash'  
      }
    },

    shim: {
      tweening: {
          exports: "TweenMax"
      },
      
      stats: {
        exports: 'Stats'
      }

    }
});