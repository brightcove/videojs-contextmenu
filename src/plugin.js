import videojs from 'video.js';

const defaults = {

  // Whether or not to cancel the native "contextmenu" event when it is seen.
  cancel: true,

  // The maximum number of pixels a finger can move because a touch is no
  // longer considered to be "held".
  sensitivity: 10,

  // The minimum number of milliseconds a touch must be "held" before it
  // registers.
  wait: 500
};

const EVENT_NAME = 'vjs-contextmenu';

/**
 * A cross-device context menu implementation for video.js players.
 *
 * @function contextmenu
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
const contextmenu = function(options) {
  options = this.contextmenu = videojs.mergeOptions(defaults, options);

  let current = null;

  const touchEnd = (e) => {
    if (!current) {
      return;
    }

    if (e.type === 'touchend' && Number(new Date()) - current.time >= options.wait) {
      this.trigger(EVENT_NAME);
    }

    current = null;
  };

  const touchMove = (e) => {
    if (!current) {
      return;
    }

    const touch = e.touches[0];

    // Cancel the current touch if the pointer has moved in either direction
    // more than the sensitivity number of pixels.
    if (
      touch.screenX - current.x > options.sensitivity ||
      touch.screenY - current.y > options.sensitivity
    ) {
      current = null;
    }
  };

  const touchStart = (e) => {

    // We only care about the first touch point.
    if (current) {
      return;
    }

    const touch = e.touches[0];

    current = {
      x: touch.screenX,
      y: touch.screenY,
      time: Number(new Date())
    };
  };

  this.
    on('contextmenu', (e) => {
      if (options.cancel) {
        e.preventDefault();
      }

      this.
        trigger(EVENT_NAME).

        // If we get a "contextmenu" event, we can rely on that going forward
        // because this client supports it; so, we can stop listening for
        // touch events.
        off(['touchcancel', 'touchend'], touchEnd).
        off('touchmove', touchMove).
        off('touchstart', touchStart);
    }).
    on(['touchcancel', 'touchend'], touchEnd).
    on('touchmove', touchMove).
    on('touchstart', touchStart);

  this.ready(() => this.addClass(EVENT_NAME));
};

videojs.plugin('contextmenu', contextmenu);
contextmenu.VERSION = '__VERSION__';

export default contextmenu;
