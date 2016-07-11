/**
 * videojs-contextmenu
 * @version 1.0.0
 * @copyright 2016 Brightcove, Inc.
 * @license Apache-2.0
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.videojsContextmenu = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _videoJs = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _videoJs2 = _interopRequireDefault(_videoJs);

var defaults = {

  // Whether or not to cancel the native "contextmenu" event when it is seen.
  cancel: true,

  // The maximum number of pixels a finger can move because a touch is no
  // longer considered to be "held".
  sensitivity: 10,

  // The minimum number of milliseconds a touch must be "held" before it
  // registers.
  wait: 500
};

var EVENT_NAME = 'vjs-contextmenu';

/**
 * A cross-device context menu implementation for video.js players.
 *
 * @function contextmenu
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
var contextmenu = function contextmenu(options) {
  var _this = this;

  options = this.contextmenu = _videoJs2['default'].mergeOptions(defaults, options);

  var current = null;

  var touchEnd = function touchEnd(e) {
    if (!current) {
      return;
    }

    if (e.type === 'touchend' && Number(new Date()) - current.time >= options.wait) {
      _this.trigger(EVENT_NAME);
    }

    current = null;
  };

  var touchMove = function touchMove(e) {
    if (!current) {
      return;
    }

    var touch = e.touches[0];

    // Cancel the current touch if the pointer has moved in either direction
    // more than the sensitivity number of pixels.
    if (touch.screenX - current.x > options.sensitivity || touch.screenY - current.y > options.sensitivity) {
      current = null;
    }
  };

  var touchStart = function touchStart(e) {

    // We only care about the first touch point.
    if (current) {
      return;
    }

    var touch = e.touches[0];

    current = {
      x: touch.screenX,
      y: touch.screenY,
      time: Number(new Date())
    };
  };

  this.on('contextmenu', function (e) {
    if (options.cancel) {
      e.preventDefault();
    }

    _this.trigger(EVENT_NAME).

    // If we get a "contextmenu" event, we can rely on that going forward
    // because this client supports it; so, we can stop listening for
    // touch events.
    off(['touchcancel', 'touchend'], touchEnd).off('touchmove', touchMove).off('touchstart', touchStart);
  }).on(['touchcancel', 'touchend'], touchEnd).on('touchmove', touchMove).on('touchstart', touchStart);

  this.ready(function () {
    return _this.addClass(EVENT_NAME);
  });
};

_videoJs2['default'].plugin('contextmenu', contextmenu);
contextmenu.VERSION = '1.0.0';

exports['default'] = contextmenu;
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});