/**
 * @module plugin
 */
import videojs from 'video.js';

/* eslint func-style: 0 */

const defaults = {
  cancel: true,
  sensitivity: 10,
  wait: 500,
  disabled: false
};

const EVENT_NAME = 'vjs-contextmenu';

/**
 * Abstracts a DOM standard event into a vjs-contextmenu event.
 *
 * @private
 * @param  {Player} player
 * @param  {Event} event
 *         A triggering, native event.
 * @return {Player}
 */
function sendAbstractedEvent(player, event) {
  if (player.contextmenu.options.disabled) {
    // videojs-contextmenu is disabled
    return player;
  }
  const abstracted = {
    target: player,
    type: EVENT_NAME
  };

  [
    'clientX',
    'clientY',
    'pageX',
    'pageY',
    'screenX',
    'screenY'
  ].forEach(k => {
    abstracted[k] = event[k];
  });

  return player.trigger(abstracted);
}

/**
 * Handles both touchcancel and touchend events.
 *
 * @private
 * @param  {Event} e
 */
function handleTouchEnd(e) {
  const current = this.contextmenu.current;

  if (!current) {
    return;
  }

  const wait = this.contextmenu.options.wait;

  if (e.type === 'touchend' && Number(new Date()) - current.time >= wait) {
    sendAbstractedEvent(this, e);
  }

  this.contextmenu.current = null;
}

/**
 * Handles touchmove events.
 *
 * @private
 * @param  {Event} e
 */
function handleTouchMove(e) {
  const current = this.contextmenu.current;

  if (!current) {
    return;
  }

  const touch = e.touches[0];
  const sensitivity = this.contextmenu.options.sensitivity;

  // Cancel the current touch if the pointer has moved in either direction
  // more than the sensitivity number of pixels.
  if (
    touch.screenX - current.screenX > sensitivity ||
    touch.screenY - current.screenY > sensitivity
  ) {
    this.contextmenu.current = null;
  }
}

/**
 * Handles touchstart events.
 *
 * @private
 * @param  {Event} e
 */
function handleTouchStart(e) {

  // We only care about the first touch point.
  if (this.contextmenu.current) {
    return;
  }

  const touch = e.touches[0];

  this.contextmenu.current = {
    screenX: touch.screenX,
    screenY: touch.screenY,
    time: Number(new Date())
  };
}

/**
 * Handles contextmenu events.
 *
 * @private
 * @param  {Event} e
 */
function handleContextMenu(e) {
  if (this.contextmenu.options.cancel && !this.contextmenu.options.disabled) {
    e.preventDefault();
  }

  sendAbstractedEvent(this, e).

    // If we get a "contextmenu" event, we can rely on that going forward
    // because this client supports it; so, we can stop listening for
    // touch events.
    off(['touchcancel', 'touchend'], handleTouchEnd).
    off('touchmove', handleTouchMove).
    off('touchstart', handleTouchStart);
}

/**
 * A cross-device context menu implementation for video.js players.
 *
 * @param    {Object}  [options={}]
 * @param    {Boolean} [cancel=true]
 *           Whether or not to cancel the native "contextmenu" event when
 *           it is seen.
 *
 * @param    {Number} [sensitivity=10]
 *           The maximum number of pixels a finger can move because a touch
 *           is no longer considered to be "held".
 *
 * @param    {Number} [wait=500]
 *           The minimum number of milliseconds a touch must be "held" before
 *           it registers.
 */
function contextmenu(options) {
  const isFirstInit = this.contextmenu === contextmenu;

  if (isFirstInit) {

    // Wrap the plugin function with an player instance-specific function. This
    // allows us to attach the modal to it without affecting other players on
    // the page.
    this.contextmenu = function() {
      contextmenu.apply(this, arguments);
    };

    this.contextmenu.VERSION = '__VERSION__';
  }

  this.contextmenu.options = videojs.mergeOptions(defaults, options);

  // When re-initing, we only want to update options; so, we bail out to
  // prevent any doubling-up of event listeners.
  if (!isFirstInit) {
    return;
  }

  this.
    on('contextmenu', handleContextMenu).
    on(['touchcancel', 'touchend'], handleTouchEnd).
    on('touchmove', handleTouchMove).
    on('touchstart', handleTouchStart);

  this.ready(() => this.addClass(EVENT_NAME));
}

videojs.plugin('contextmenu', contextmenu);
contextmenu.VERSION = '__VERSION__';

export default contextmenu;
