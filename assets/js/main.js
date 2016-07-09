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

})( window );

function init() {
  addStars();
  animateAsteroids();
}

function setPageView(value) {
  _gaq.push(['_trackPageview', value]);
};

function setEvent(category, action, label) {
  _gaq.push(['_trackEvent', category, action, label]);
};

function addStars() {
  var shouldAnimate = true;
  var count = 60;

  var twinkleDiv = document.getElementById("twinkle");

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
      image.src = "assets/img/star.png";
      image.className = "little-star";
      image.id = "star" + i;
      image.style.left = parseInt(Math.random() * 1600)+'px';
      image.style.bottom = parseInt(Math.random() * 1200)+'px';
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
      var x = 2000 * t;
      var y = 120 + Math.pow(t - 0.5, 2) * 1000 + yOffsets[index];
      var s = Math.min(Math.min(t / 0.1, (1 - t) / 0.1), 1);
      asteroidDiv.style[transformProperty] = "translateX(" + x + "px) translateY(" + y + "px) rotate(" + r + "deg) scale(" + s + ") ";
    }

    requestAnimationFrame(animate);
  };

  animate();
};

var demoDiv = document.getElementById('demo');
var videoContainerDiv = document.getElementById('video-container');

function viewDemo () {
  demoDiv.className = "active";
  videoContainerDiv.innerHTML = '<iframe class="youtube-player" type="text/html" width="853" height="505" src="http://www.youtube.com/embed/626CEirW5to?autoplay=1&rel=0&vq=hd720" frameborder="0"></iframe>';
};

function closeDemo () {
  demoDiv.className = "";
  videoContainerDiv.innerHTML = "";
};
