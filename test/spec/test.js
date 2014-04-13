/* global describe, it */
define([

  'chai'
  ,'rekapi'

  ,'rekapi.timeline'

], function (

  chai
  ,Rekapi

) {
  'use strict';

  var assert = chai.assert;

  describe('The code loads', function () {
    it('Should define Rekapi.prototype.createTimeline', function () {
      assert.isFunction(Rekapi.prototype.createTimeline);
    });
  });

  describe('Handles state of Rekapi before RekapiTimeline was instantiated',
      function () {

    describe('Adding an actor is represented on the DOM', function () {
      it('Should create a container for the actor', function () {
        var timelineEl = document.createElement('div');
        var rekapi = new Rekapi(document.body);

        rekapi.createTimeline(timelineEl);
        rekapi.addActor();

        assert.equal(
            timelineEl.querySelectorAll('.rt-actor-view').length, 1);
      });
    });

    describe('Adding a keyframe is represented on the DOM', function () {
      it('Should create an element for a single keyframe', function () {
        var timelineEl = document.createElement('div');
        var rekapi = new Rekapi(document.body);

        rekapi.createTimeline(timelineEl);
        rekapi.addActor().keyframe(0, {x: 0});

        assert.equal(
            timelineEl.querySelectorAll('.rt-keyframe-property-view').length,
            1);
      });
    });

    describe('Adding multiple keyframes is represented on the DOM',
        function () {
      it('Should create elements for multiple keyframes', function () {
        var timelineEl = document.createElement('div');
        var rekapi = new Rekapi(document.body);

        rekapi.createTimeline(timelineEl);
        rekapi.addActor().keyframe(0, {x: 0}).keyframe(1, {x: 1});

        assert.equal(
            timelineEl.querySelectorAll('.rt-keyframe-property-view').length,
            2);
      });
    });

    describe('removeKeyframe() removes a keyframe from the DOM', function () {
      it('Should remove the created element for a keyframe', function () {
        var timelineEl = document.createElement('div');
        var rekapi = new Rekapi(document.body);

        rekapi.createTimeline(timelineEl);
        var actor = rekapi.addActor();
        actor.keyframe(0, {x: 0});
        actor.removeKeyframe(0);

        assert.equal(
            timelineEl.querySelectorAll('.rt-keyframe-property-view').length,
            0);
      });
    });

    describe('removeAllKeyframes() removes all keyframe from the DOM',
        function () {
      it('Should remove the created element for a keyframe', function () {
        var timelineEl = document.createElement('div');
        var rekapi = new Rekapi(document.body);

        rekapi.createTimeline(timelineEl);
        var actor = rekapi.addActor();
        actor.keyframe(0, {x: 0}).keyframe(1, {x: 1});
        actor.removeAllKeyframes();

        assert.equal(
            timelineEl.querySelectorAll('.rt-keyframe-property-view').length,
            0);
      });
    });
  });


  describe('Handles manipulation or Rekapi after instantiating RekapiTimeline',
      function () {

    describe('Adding an actor is represented on the DOM', function () {
      it('Should create a container for the actor', function () {
        var timelineEl = document.createElement('div');
        var rekapi = new Rekapi(document.body);

        rekapi.addActor();
        rekapi.createTimeline(timelineEl);

        assert.equal(
            timelineEl.querySelectorAll('.rt-actor-view').length, 1);
      });
    });

    describe('Adding a keyframe is represented on the DOM', function () {
      it('Should create an element for a single keyframe', function () {
        var timelineEl = document.createElement('div');
        var rekapi = new Rekapi(document.body);

        rekapi.addActor().keyframe(0, {x: 0});
        rekapi.createTimeline(timelineEl);

        assert.equal(
            timelineEl.querySelectorAll('.rt-keyframe-property-view').length,
            1);
      });
    });

    describe('Adding multiple keyframes is represented on the DOM',
        function () {
      it('Should create elements for multiple keyframe', function () {
        var timelineEl = document.createElement('div');
        var rekapi = new Rekapi(document.body);

        rekapi.addActor().keyframe(0, {x: 0}).keyframe(1, {x: 1});
        rekapi.createTimeline(timelineEl);

        assert.equal(
            timelineEl.querySelectorAll('.rt-keyframe-property-view').length,
            2);
      });
    });

    describe('removeKeyframe() removes a keyframe from the DOM', function () {
      it('Should remove the created element for a keyframe', function () {
        var timelineEl = document.createElement('div');
        var rekapi = new Rekapi(document.body);

        var actor = rekapi.addActor();
        actor.keyframe(0, {x: 0});
        rekapi.createTimeline(timelineEl);
        actor.removeKeyframe(0);

        assert.equal(
            timelineEl.querySelectorAll('.rt-keyframe-property-view').length,
            0);
      });
    });

    describe('removeAllKeyframes() removes all keyframe from the DOM',
        function () {
      it('Should remove the created element for a keyframe', function () {
        var timelineEl = document.createElement('div');
        var rekapi = new Rekapi(document.body);

        var actor = rekapi.addActor();
        actor.keyframe(0, {x: 0}).keyframe(1, {x: 1});
        rekapi.createTimeline(timelineEl);
        actor.removeAllKeyframes();

        assert.equal(
            timelineEl.querySelectorAll('.rt-keyframe-property-view').length,
            0);
      });
    });
  });

});