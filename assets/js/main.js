/**
 * requestAnimationFrame polyfill by Erik Möller
 * fixes from Paul Irish and Tino Zijdel
 *
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 */

/*jshint undef: true, curly: true, eqeqeq: true, browser: true */

(function( window ) {
  var lastTime = 0;
  var prefixes = 'webkit moz ms o'.split(' ');
  // get unprefixed rAF and cAF, if present
  var requestAnimationFrame = window.requestAnimationFrame;
  var cancelAnimationFrame = window.cancelAnimationFrame;
  // loop through vendor prefixes and get prefixed rAF and cAF
  var prefix;
  for( var i = 0; i < prefixes.length; i++ ) {
    if ( requestAnimationFrame && cancelAnimationFrame ) {
      break;
    }
    prefix = prefixes[i];
    requestAnimationFrame = requestAnimationFrame || window[ prefix + 'RequestAnimationFrame' ];
    cancelAnimationFrame  = cancelAnimationFrame  || window[ prefix + 'CancelAnimationFrame' ] ||
                              window[ prefix + 'CancelRequestAnimationFrame' ];
  }

  // fallback to setTimeout and clearTimeout if either request/cancel is not supported
  if ( !requestAnimationFrame || !cancelAnimationFrame ) {
    requestAnimationFrame = function( callback, element ) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
      var id = window.setTimeout( function() {
        callback( currTime + timeToCall );
      }, timeToCall );
      lastTime = currTime + timeToCall;
      return id;
    };

    cancelAnimationFrame = function( id ) {
      window.clearTimeout( id );
    };
  }

  // put in global namespace
  window.requestAnimationFrame = requestAnimationFrame;
  window.cancelAnimationFrame = cancelAnimationFrame;

  // add viewport dimens fn
  window.viewport = function() {
    return {
      // http://stackoverflow.com/a/8876069
      width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    }
  }

})( window );

function init() {
  addStars();
  animateAsteroids();
}

function addStars() {
  var shouldAnimate = true;
  var count = 60;

  var twinkleDiv = document.getElementById("twinkle");

  var viewport = window.viewport();
  var vw = viewport.width || 1600;
  var vh = viewport.height || 1200;
  count = Math.floor(Math.max(((vw * vh) / 22500), 60));

  var animation = false,
      animationstring = 'animation',
      keyframeprefix = '',
      domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
      pfx  = '';

  if( twinkleDiv.style.animationName ) { animation = true; }

  if( animation === false ) {
    for( var i = 0; i < domPrefixes.length; i++ ) {
      if( twinkleDiv.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
        pfx = domPrefixes[ i ];
        animationstring = pfx + 'Animation';
        keyframeprefix = '-' + pfx.toLowerCase() + '-';
        animation = true;
        break;
      }
    }
  }

  if(animation) {
    for(var i = 0; i < count; i++) {
      var image = new Image();
      image.src = "/assets/images/bravestman/star.png";
      image.className = "little-star";
      image.id = "star" + i;
      image.style.left = parseInt(Math.random() * vw)+'px';
      image.style.bottom = parseInt(Math.random() * vh)+'px';
      image.style.webkitAnimationDelay = (20 * i / 1000) + 's';
      image.style.mozAnimationDelay = (20 * i / 1000) + 's';
      twinkleDiv.appendChild(image);
    }
  }
};

function detectTransformProperty () {
  var prefixes = 'transform WebkitTransform MozTransform oTransform msTransform'.split(' '),
      el = document.createElement('div'),
      index = 0,
      support = false;

  while (index < prefixes.length) {
    var prefix = prefixes[index++];
    if (document.createElement('div').style[prefix] != undefined) {
      return prefix
    };
  }

  return false;
};

function animateAsteroids () {
  var transformProperty = detectTransformProperty();

  if (!transformProperty) {
    return;
  }

  var asteroidsDiv = document.getElementById('asteroids');
  asteroidsDiv.className = "animated";

  var asteroidDivs = [];
  var tOffsets = [];

  var tDuration = 100000;
  var rFastDuration = 10000;
  var rMedDuration = 15000;
  var rSlowDuration = 20000;
  var rDurations = [rFastDuration, rMedDuration, rSlowDuration, rSlowDuration, rMedDuration, rSlowDuration, rFastDuration, rMedDuration, rSlowDuration, rFastDuration, rMedDuration, rSlowDuration];
  var rDirections = [1, -1, 1, 1, -1, -1, 1, 1, -1, -1, -1, 1];
  var tOffsets = [0, 0.1, 0.15, 0.3, 0.36, 0.5, 0.56, 0.75, 0.7, 0.82, 0.89, 0.94];
  var yOffsets = [0, 70, 0, 80, 20, 30, -40, 70, 20, 10, -50, 20];

  var viewport = window.viewport();
  var w = viewport.width || 2000;
  var h = (((w > 767) ? 0.1 : 0.2) * viewport.height) || 250;
  if (w < 768) {
    yOffsets = [0, 105, 0, 120, 30, 45, -60, 105, 30, 15, -75, 30];
    tDuration = 66 * 1000;
  }

  for (var index = 1; index <= 12; index++) {
    var asteroidDiv = document.createElement('div');
    asteroidDiv.className = 'asteroid' + index;
    asteroidsDiv.appendChild(asteroidDiv);
    asteroidDivs.push(asteroidDiv);
  }

  var animate = function () {
    for (var index = 0; index < asteroidDivs.length; index++) {
      var asteroidDiv = asteroidDivs[index];
      var rDuration = rDurations[index];
      var r = ((Date.now() / rDuration) % 1) * 360 * rDirections[index];
      var t = (Date.now() / tDuration + tOffsets[index]) % 1;
      var x = w * t;
      var y = 120 + ((w > 767) ? (Math.pow(t - 0.5, 2) * 1000) : 0) + yOffsets[index];
      var s = Math.min(Math.min(t / 0.1, (1 - t) / 0.1), 1);
      asteroidDiv.style[transformProperty] = "translateX(" + x + "px) translateY(" + y + "px) rotate(" + r + "deg) scale(" + s + ") ";
    }

    requestAnimationFrame(animate);
  };

  animate();
};
