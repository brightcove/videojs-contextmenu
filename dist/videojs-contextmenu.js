/**
 * videojs-contextmenu
 * @version 1.2.2
 * @copyright 2017 Brightcove, Inc.
 * @license Apache-2.0
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.videojsContextmenu = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/**
 * @module plugin
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _videoJs = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _videoJs2 = _interopRequireDefault(_videoJs);

// vjs 5/6 cross compatibility.
var registerPlugin = _videoJs2['default'].registerPlugin || _videoJs2['default'].plugin;

/* eslint func-style: 0 */

var defaults = {
  cancel: true,
  sensitivity: 10,
  wait: 500,
  disabled: false
};

var EVENT_NAME = 'vjs-contextmenu';

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
  var abstracted = {
    target: player,
    type: EVENT_NAME
  };

  ['clientX', 'clientY', 'pageX', 'pageY', 'screenX', 'screenY'].forEach(function (k) {
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
  var current = this.contextmenu.current;

  if (!current) {
    return;
  }

  var wait = this.contextmenu.options.wait;

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
  var current = this.contextmenu.current;

  if (!current) {
    return;
  }

  var touch = e.touches[0];
  var sensitivity = this.contextmenu.options.sensitivity;

  // Cancel the current touch if the pointer has moved in either direction
  // more than the sensitivity number of pixels.
  if (touch.screenX - current.screenX > sensitivity || touch.screenY - current.screenY > sensitivity) {
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

  var touch = e.touches[0];

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

  sendAbstractedEvent(this, e);

  // If we get a "contextmenu" event, we can rely on that going forward
  // because this client supports it; so, we can stop listening for
  // touch events.
  this.off(['touchcancel', 'touchend'], handleTouchEnd);
  this.off('touchmove', handleTouchMove);
  this.off('touchstart', handleTouchStart);
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
  var _this = this;

  this.contextmenu.options = _videoJs2['default'].mergeOptions(defaults, options);
  this.contextmenu.VERSION = '1.2.2';

  this.on('contextmenu', handleContextMenu);
  this.on(['touchcancel', 'touchend'], handleTouchEnd);
  this.on('touchmove', handleTouchMove);
  this.on('touchstart', handleTouchStart);

  this.ready(function () {
    return _this.addClass(EVENT_NAME);
  });
}

registerPlugin('contextmenu', contextmenu);
contextmenu.VERSION = '1.2.2';

exports['default'] = contextmenu;
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});