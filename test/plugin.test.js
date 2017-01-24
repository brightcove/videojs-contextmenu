import document from 'global/document';
import QUnit from 'qunit';
import sinon from 'sinon';
import videojs from 'video.js';
import plugin from '../src/plugin';

const Player = videojs.getComponent('Player');

QUnit.test('the environment is sane', function(assert) {
  assert.strictEqual(typeof Array.isArray, 'function', 'es5 exists');
  assert.strictEqual(typeof sinon, 'object', 'sinon exists');
  assert.strictEqual(typeof videojs, 'function', 'videojs exists');
  assert.strictEqual(typeof plugin, 'function', 'plugin is a function');
});

QUnit.module('videojs-contextmenu', {

  beforeEach() {

    // Mock the environment's timers because certain things - particularly
    // player readiness - are asynchronous in video.js 5. This MUST come
    // before any player is created; otherwise, timers could get created
    // with the actual timer methods!
    this.clock = sinon.useFakeTimers();

    this.fixture = document.getElementById('qunit-fixture');
    this.video = document.createElement('video');
    this.fixture.appendChild(this.video);
    this.player = videojs(this.video);
    this.player.contextmenu();
    this.spy = sinon.spy();
    this.player.on('vjs-contextmenu', this.spy);

    // Tick the clock forward enough to trigger the player to be "ready".
    this.clock.tick(1);
  },

  afterEach() {
    this.player.dispose();
    this.clock.restore();
  }
});

QUnit.test('registers itself with video.js', function(assert) {
  assert.strictEqual(
    typeof Player.prototype.contextmenu,
    'function',
    'videojs-contextmenu plugin was registered'
  );

  assert.ok(
    this.player.hasClass('vjs-contextmenu'),
    'the plugin adds a class to the player'
  );
});

QUnit.test('sends a "vjs-contextmenu" event when a native "contextmenu" event occurs', function(assert) {
  assert.notOk(this.spy.called, '"vjs-contextmenu" has not been triggered yet');
  this.player.trigger('contextmenu');
  assert.ok(this.spy.calledOnce, '"contextmenu" triggered a "vjs-contextmenu"');
});

QUnit.test('sends a "vjs-contextmenu" on long touch', function(assert) {
  this.player.trigger({
    type: 'touchstart',
    touches: [{
      screenX: 1,
      screenY: 1
    }]
  });

  this.clock.tick(1000);
  assert.notOk(this.spy.called, '"vjs-contextmenu" was not triggered between "touchstart" and "touchend"');
  this.player.trigger({type: 'touchend'});
  assert.ok(this.spy.calledOnce, '"vjs-contextmenu" was triggered once a "touchend" triggered');
});

QUnit.test('stops listening for touches if it encounters a native "contextmenu" event', function(assert) {
  assert.notOk(this.spy.called, '"vjs-contextmenu" has not been triggered yet');
  this.player.trigger('contextmenu');
  assert.ok(this.spy.calledOnce, '"contextmenu" triggered a "vjs-contextmenu"');

  this.player.trigger({
    type: 'touchstart',
    touches: [{
      screenX: 1,
      screenY: 1
    }]
  });

  this.clock.tick(1000);

  this.player.trigger({
    type: 'touchend'
  });

  assert.ok(this.spy.calledOnce, 'touches did not trigger a second "vjs-contextmenu"');
  this.player.trigger('contextmenu');
  assert.ok(this.spy.calledTwice, '"contextmenu" triggered a second "vjs-contextmenu"');
});

QUnit.test('will not fire "vjs-contextmenu" if the touch point has moved beyond the sensitivity range in either direction', function(assert) {
  this.player.trigger({
    type: 'touchstart',
    touches: [{
      screenX: 1,
      screenY: 1
    }]
  });

  this.player.trigger({
    type: 'touchmove',
    touches: [{
      screenX: 12,
      screenY: 1
    }]
  });

  this.clock.tick(1000);

  this.player.trigger({
    type: 'touchend'
  });

  assert.notOk(this.spy.called, '"vjs-contextmenu" was not triggered because the touch point moved');

  this.player.trigger({
    type: 'touchstart',
    touches: [{
      screenX: 1,
      screenY: 1
    }]
  });

  this.player.trigger({
    type: 'touchmove',
    touches: [{
      screenX: 1,
      screenY: 12
    }]
  });

  this.clock.tick(1000);

  this.player.trigger({
    type: 'touchend'
  });

  assert.notOk(this.spy.called, '"vjs-contextmenu" was not triggered because the touch point moved');
});
