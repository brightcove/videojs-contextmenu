# videojs-contextmenu

**DEPRECATED Please use https://github.com/brightcove/videojs-contextmenu-ui**

[![Build Status](https://travis-ci.org/brightcove/videojs-contextmenu.svg?branch=master)](https://travis-ci.org/brightcove/videojs-contextmenu)
[![Greenkeeper badge](https://badges.greenkeeper.io/brightcove/videojs-contextmenu.svg)](https://greenkeeper.io/)
[![Slack Status](http://slack.videojs.com/badge.svg)](http://slack.videojs.com)

[![NPM](https://nodei.co/npm/videojs-contextmenu.png?downloads=true&downloadRank=true)](https://nodei.co/npm/videojs-contextmenu/)

A cross-device context menu implementation for video.js players.

Most desktop browsers support the [DOM standard `contextmenu` event][contextmenu], but some mobile browsers, lacking a right mouse button, do not. This plugin will fire a custom `vjs-contextmenu` event when it sees a `contextmenu` event _or_ after a long touch.

For purposes of this plugin, a **long touch** is defined as a single touch which is held for a customizable number of milliseconds. In the intervening time, the touch must not move except within a customizable sensitivity range.

Maintenance Status: **Archived/Unmaintained**

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
  - [`cancel`](#cancel)
  - [`sensitivity`](#sensitivity)
  - [`wait`](#wait)
  - [`disabled`](#disabled)
- [Inclusion](#inclusion)
  - [`<script>` Tag](#script-tag)
  - [Browserify](#browserify)
  - [RequireJS/AMD](#requirejsamd)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

```sh
npm install --save videojs-contextmenu
```

## Usage

The plugin is invoked as a method of a video.js `Player` object:

```js
player.contextmenu();
```

After the plugin is invoked, you can listen to the `vjs-contextmenu` event:

```js
player.on('vjs-contextmenu', function() {
  alert('open a context menu!');
});
```

When using the [videojs-contextmenu-ui][ui] plugin, you won't need to listen to this event at all (unless you want to perform additional tasks, of course).

## Options

Options may be passed to the plugin in a plain object:

```js
player.contextmenu({sensitivity: 15, wait: 1000});
```

### `cancel`

**Type**: Boolean
**Default**: `true`

This option will suppress the native `contextmenu` event if it is seen. This tends to be desirable because the point of this plugin is to normalize this event and the long touch equivalent.

### `sensitivity`

**Type**: Number
**Default**: `10`

_Only used for detection of a long touch._ The maximum number of pixels a touch can move while waiting for a long touch detection. This value is inclusive; so, by default, if the finger moves by 10 pixels it may still count as a long touch.

### `wait`

**Type**: Number
**Default**: `500`

_Only used for detection of a long touch._ The minimum number of milliseconds a touch must stay within the `sensitivity` range before it registers as a long touch.

### `disabled`

**Type**: Boolean
**Default**: `false`

If set to _true_, this option will disable firing `vjs-contextmenu`. Functionality can be restored at any time by setting **disabled** to false.

## Inclusion

To include videojs-contextmenu on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-contextmenu.min.js"></script>
<script>
  var player = videojs('my-video');

  player.contextmenu();
</script>
```

### Browserify

When using with Browserify, install videojs-contextmenu via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('videojs-contextmenu');

var player = videojs('my-video');

player.contextmenu();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', 'videojs-contextmenu'], function(videojs) {
  var player = videojs('my-video');

  player.contextmenu();
});
```

## License

Apache-2.0. Copyright (c) Brightcove, Inc.


[contextmenu]: https://developer.mozilla.org/en-US/docs/Web/Events/contextmenu
[ui]: https://github.com/brightcove/videojs-contextmenu-ui
[videojs]: http://videojs.com/
