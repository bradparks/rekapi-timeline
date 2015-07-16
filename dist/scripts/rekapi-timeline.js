(function () {define('rekapi-timeline.component.container/model',[

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  var Base = Lateralus.Component.Model;
  var baseProto = Base.prototype;

  var ContainerComponentModel = Base.extend({
    /**
     * Parameters are the same as http://backbonejs.org/#Model-constructor
     * @param {Object} [attributes]
     * @param {Object} [options]
     */
    initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return ContainerComponentModel;
});

define('text',{load: function(id){throw new Error("Dynamic load not allowed: " + id);}});

define('text!rekapi-timeline.component.container/template.mustache',[],function () { return '<div class="$controlBar"></div>\n<div class="$timeline"></div>\n<div class="$details"></div>\n';});

define('rekapi-timeline/constant',[],function () {
  'use strict';

  var rekapiTimelineConstants = {
    // How many pixels wide the keyframe tracks should be for every second of
    // the animatiom.
    PIXELS_PER_SECOND: 300

    // How many milliseconds after the currently focused keyframe property to
    // add a new property when the user clicks the "add new property" button.
    ,NEW_KEYFRAME_PROPERTY_BUFFER_MS: 500

    ,DEFAULT_TIMELINE_SCALE: 1
  };

  return rekapiTimelineConstants;
});

define('rekapi-timeline.component.container/view',[

  'lateralus'

  ,'text!./template.mustache'

  ,'rekapi-timeline/constant'

], function (

  Lateralus

  ,template

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var ContainerComponentView = Base.extend({
    template: template

    ,provide: {
      /**
       * Gets the Rekapi timeline millisecond value for a slider handle-like
       * element.  This is used for converting the position of keyframe DOM
       * elements and the timeline scrubber position into the value it
       * represents in the animation.
       * @param {jQuery} $handle The handle element to retrieve the millisecond
       * value for.
       * @return {number}
       */
      timelineMillisecondForHandle: function ($handle) {
        var distanceFromLeft = parseInt($handle.css('left'), 10) -
            parseInt($handle.parent().css('border-left-width'), 10);
        var baseMillisecond = (
            distanceFromLeft / constant.PIXELS_PER_SECOND) * 1000;

        return baseMillisecond / this.lateralus.model.get('timelineScale');
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return ContainerComponentView;
});

define('rekapi-timeline.component.control-bar/model',[

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  var Base = Lateralus.Component.Model;
  var baseProto = Base.prototype;

  var ControlBarComponentModel = Base.extend({
    /**
     * Parameters are the same as http://backbonejs.org/#Model-constructor
     * @param {Object} [attributes]
     * @param {Object} [options]
     */
    initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return ControlBarComponentModel;
});


define('text!rekapi-timeline.component.control-bar/template.mustache',[],function () { return '<i class="glyphicon glyphicon-play play"></i>\n<i class="glyphicon glyphicon-pause pause"></i>\n<i class="glyphicon glyphicon-stop stop"></i>\n';});

define('rekapi-timeline.component.control-bar/view',[

  'lateralus'

  ,'text!./template.mustache'

], function (

  Lateralus

  ,template

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var ControlBarComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      'rekapi:playStateChange': function () {
        if (this.lateralus.rekapi.isPlaying()) {
          this.$el.addClass('playing');
        } else {
          this.$el.removeClass('playing');
        }
      }
    }

    ,events: {
      'click .play': function () {
        this.play();
      }

      ,'click .pause': function () {
        this.pause();
      }

      ,'click .stop': function () {
        this.emit('stopAnimation');
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);

      if (this.lateralus.isPlaying()) {
        this.$el.addClass('playing');
      }
    }

    ,play: function () {
      this.lateralus.playFromCurrent();
    }

    ,pause: function () {
      this.lateralus.pause();
    }
  });

  return ControlBarComponentView;
});

define('rekapi-timeline.component.control-bar/main',[

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,Model
  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var ControlBarComponent = Base.extend({
    name: 'control-bar'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return ControlBarComponent;
});

define('rekapi-timeline.component.control-bar', ['rekapi-timeline.component.control-bar/main'], function (main) { return main; });

define('rekapi-timeline.component.timeline/model',[

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  var Base = Lateralus.Component.Model;
  var baseProto = Base.prototype;

  var TimelineComponentModel = Base.extend({
    /**
     * Parameters are the same as http://backbonejs.org/#Model-constructor
     * @param {Object} [attributes]
     * @param {Object} [options]
     */
    initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return TimelineComponentModel;
});


define('text!rekapi-timeline.component.timeline/template.mustache',[],function () { return '<div class="$timelineWrapper timeline-wrapper">\n  <div class="$scrubber"></div>\n  <div class="$animationTracks"></div>\n</div>\n';});

define('rekapi-timeline.component.timeline/view',[

  'lateralus'

  ,'text!./template.mustache'

  ,'rekapi-timeline/constant'

], function (

  Lateralus

  ,template

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var TimelineComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      'rekapi:timelineModified': function () {
        this.updateWrapperWidth();
      }
    }

    ,provide: {
      timelineWrapperHeight: function () {
        return this.$timelineWrapper.height();
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.updateWrapperWidth();
    }

    /**
     * Determines how wide this View's element should be, in pixels.
     * @return {number}
     */
    ,getPixelWidthForTracks: function () {
      var animationLength = this.lateralus.rekapi.getAnimationLength();
      var animationSeconds = (animationLength / 1000);

      // The width of the tracks container should always be the pixel width of
      // the animation plus the width of the timeline element to allow for
      // lengthening of the animation tracks by the user.
      return (constant.PIXELS_PER_SECOND * animationSeconds) +
        this.$el.width();
    }

    ,updateWrapperWidth: function () {
      this.$timelineWrapper.css('width', this.getPixelWidthForTracks());
    }
  });

  return TimelineComponentView;
});

define('rekapi-timeline.component.scrubber/model',[

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  var Base = Lateralus.Component.Model;
  var baseProto = Base.prototype;

  var ScrubberComponentModel = Base.extend({
    /**
     * Parameters are the same as http://backbonejs.org/#Model-constructor
     * @param {Object} [attributes]
     * @param {Object} [options]
     */
    initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return ScrubberComponentModel;
});


define('text!rekapi-timeline.component.scrubber/template.mustache',[],function () { return '<div class="$scrubberWrapper scrubber-wrapper">\n  <div class="$scrubberHandle scrubber-handle">\n    <i class="glyphicon glyphicon-chevron-down scrubber-icon">&nbsp;</i>\n    <figure class="$scrubberGuide scrubber-guide"></figure>\n  </div>\n</div>\n';});

define('rekapi-timeline.component.scrubber/view',[

  'lateralus'

  ,'text!./template.mustache'

  ,'rekapi-timeline/constant'

], function (

  Lateralus

  ,template

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var ScrubberComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      'change:timelineScale': function () {
        this.render();
      }

      ,'rekapi:timelineModified': function () {
        this.render();
      }

      ,'rekapi:afterUpdate': function () {
        this.render();
      }

      ,'rekapi:addKeyframePropertyTrack': function () {
        this.resizeScrubberGuide();
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);

      this.syncContainerToTimelineLength();

      this.$scrubberHandle.dragon({
        within: this.$scrubberWrapper
        ,drag: this.onScrubberDrag.bind(this)
      });
    }

    ,deferredInitialize: function () {
      this.resizeScrubberGuide();
    }

    ,render: function () {
      this.syncContainerToTimelineLength();
      this.syncHandleToTimelineLength();
    }

    ,onScrubberDrag: function () {
      var millisecond =
        this.collectOne('timelineMillisecondForHandle', this.$scrubberHandle);
      this.lateralus.rekapi.update(millisecond);
    }

    ,syncContainerToTimelineLength: function () {
      var scaledContainerWidth =
        this.lateralus.getAnimationLength() *
        (constant.PIXELS_PER_SECOND / 1000) *
        this.lateralus.model.get('timelineScale');

      this.$scrubberWrapper.width(
        scaledContainerWidth + this.$scrubberHandle.width());
    }

    ,syncHandleToTimelineLength: function () {
      var lastMillisecondUpdated =
        this.lateralus.rekapi.getLastPositionUpdated() *
        this.lateralus.rekapi.getAnimationLength();
      var scaledLeftValue = lastMillisecondUpdated *
        (constant.PIXELS_PER_SECOND / 1000) *
        this.lateralus.model.get('timelineScale');

      this.$scrubberHandle.css('left', scaledLeftValue);
    }

    ,resizeScrubberGuide: function () {
      var wrapperHeight = this.collectOne('timelineWrapperHeight');
      var scrubberBottomBorder =
        parseInt(this.$scrubberWrapper.css('borderBottomWidth'), 10);
      this.$scrubberGuide.css('height',
        wrapperHeight - this.$el.height() + scrubberBottomBorder);
    }
  });

  return ScrubberComponentView;
});

define('rekapi-timeline.component.scrubber/main',[

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,Model
  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var ScrubberComponent = Base.extend({
    name: 'scrubber'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return ScrubberComponent;
});

define('rekapi-timeline.component.scrubber', ['rekapi-timeline.component.scrubber/main'], function (main) { return main; });

define('rekapi-timeline.component.animation-tracks/model',[

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  var Base = Lateralus.Component.Model;
  var baseProto = Base.prototype;

  var AnimationTracksComponentModel = Base.extend({
    /**
     * Parameters are the same as http://backbonejs.org/#Model-constructor
     * @param {Object} [attributes]
     * @param {Object} [options]
     */
    initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return AnimationTracksComponentModel;
});


define('text!rekapi-timeline.component.animation-tracks/template.mustache',[],function () { return '';});

define('rekapi-timeline.component.actor-tracks/model',[

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  var Base = Lateralus.Component.Model;
  var baseProto = Base.prototype;

  var ActorTracksComponentModel = Base.extend({
    /**
     * Parameters are the same as http://backbonejs.org/#Model-constructor
     * @param {Object} [attributes]
     * @param {Object} [options]
     */
    initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return ActorTracksComponentModel;
});


define('text!rekapi-timeline.component.actor-tracks/template.mustache',[],function () { return '';});

define('rekapi-timeline.component.keyframe-property-track/model',[

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  var Base = Lateralus.Component.Model;
  var baseProto = Base.prototype;

  var KeyframePropertyTrackComponentModel = Base.extend({
    defaults: {
      trackName: ''
    }
    /**
     * Parameters are the same as http://backbonejs.org/#Model-constructor
     * @param {Object} [attributes]
     * @param {Object} [options]
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return KeyframePropertyTrackComponentModel;
});


define('text!rekapi-timeline.component.keyframe-property-track/template.mustache',[],function () { return '';});

define('rekapi-timeline.component.keyframe-property/model',[

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  var Base = Lateralus.Component.Model;
  var baseProto = Base.prototype;

  var KeyframePropertyComponentModel = Base.extend({
    /**
     * Parameters are the same as http://backbonejs.org/#Model-constructor
     * @param {Object} [attributes]
     * @param {Object} [options]
     */
    initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return KeyframePropertyComponentModel;
});


define('text!rekapi-timeline.component.keyframe-property/template.mustache',[],function () { return '<button class="$handle keyframe-property" data-name="{{keyframeProperty.name}}" data-value="{{keyframeProperty.value}}" data-millisecond="{{keyframeProperty.millisecond}}">&nbsp;</button>\n';});

define('rekapi-timeline.component.keyframe-property/view',[

  'lateralus'

  ,'text!./template.mustache'

  ,'rekapi-timeline/constant'

], function (

  Lateralus

  ,template

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var KeyframePropertyComponentView = Base.extend({
    template: template

    ,events: {
      'focus button':  function () {
        this.emit('userFocusedKeyframeProperty', this);
      }
    }

    ,modelEvents: {
      change: function () {
        this.render();
      }

      ,destroy: function () {
        this.dispose();
      }
    }

    ,lateralusEvents: {
      'change:timelineScale': function () {
        this.render();
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     *   @param {KeyframePropertyTrackComponentView}
     *   keyframePropertyTrackComponentView
     *   @param {boolean=} doImmediatelyFocus
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.render();
    }

    ,deferredInitialize: function () {
      this.$el.dragon({
        within: this.keyframePropertyTrackComponentView.$el
        ,drag: this.onDrag.bind(this)
        ,dragEnd: this.onDragEnd.bind(this)
      });

      if (this.doImmediatelyFocus) {
        this.$handle.focus();
      }
    }

    ,render: function () {
      var elData = this.$el.data('dragon');
      if (elData && elData.isDragging) {
        return;
      }

      var scaledXCoordinate = (
          constant.PIXELS_PER_SECOND * this.model.get('millisecond')) /
          1000 * this.lateralus.model.get('timelineScale');

      this.$el.css({
        left: scaledXCoordinate
      });

      var model = this.model;
      this.$handle
          .attr('data-millisecond', model.get('millisecond'))
          .attr('data-value', model.get('value'));
    }

    ,onDrag: function () {
      this.updateKeyframeProperty();
    }

    // In Firefox, completing a $.fn.dragon drag does not focus the element, so
    // it must be done explicitly.
    ,onDragEnd: function () {
      this.$handle.focus();
    }

    /**
     * Reads the state of the UI and persists that to the Rekapi animation.
     */
    ,updateKeyframeProperty: function () {
      var scaledValue =
        this.collectOne('timelineMillisecondForHandle', this.$el);

      this.model.set('millisecond', Math.round(scaledValue));
      this.lateralus.update();
    }
  });

  return KeyframePropertyComponentView;
});

define('rekapi-timeline.component.keyframe-property/main',[

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,Model
  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var KeyframePropertyComponent = Base.extend({
    name: 'keyframe-property'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return KeyframePropertyComponent;
});

define('rekapi-timeline.component.keyframe-property', ['rekapi-timeline.component.keyframe-property/main'], function (main) { return main; });

define('rekapi-timeline.component.keyframe-property-track/view',[

  'lateralus'

  ,'text!./template.mustache'

  ,'rekapi-timeline.component.keyframe-property'

], function (

  Lateralus

  ,template

  ,KeyframePropertyComponent

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var KeyframePropertyTrackComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      /**
       * @param {KeyframePropertyModel} newKeyframeProperty
       */
      keyframePropertyAdded: function (newKeyframeProperty) {
        if (newKeyframeProperty.get('name') === this.model.get('trackName')) {
          this.addKeyframePropertyComponent(newKeyframeProperty, true);
        }
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     *   @param {ActorModel} actorModel
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.keyframePropertyComponents = [];
      var trackName = this.model.get('trackName');
      this.$el.attr('data-track-name', trackName);

      // Retroactively create views for any keyframeProperties that the actor
      // that hed before RekapiTimeline was initialized
      this.actorModel.keyframePropertyCollection
        .where({ name: trackName })
        .forEach(function (keyframePropertyModel) {
          this.addKeyframePropertyComponent(keyframePropertyModel, false);
        }.bind(this));
    }

    /**
     * @param {KeyframePropertyModel} keyframePropertyModel
     * @param {boolean} doImmediatelyFocus
     */
    ,addKeyframePropertyComponent:
      function (keyframePropertyModel, doImmediatelyFocus) {
      // It's important to build the DOM before initializing the View in this
      // case, the initialization logic in KeyframePropertyView is way easier
      // that way.
      var keyframePropertyEl = document.createElement('div');
      this.$el.append(keyframePropertyEl);

      var keyframePropertyComponent = this.addComponent(
          KeyframePropertyComponent, {
        el: keyframePropertyEl
        ,model: keyframePropertyModel
        ,keyframePropertyTrackComponentView: this
        ,doImmediatelyFocus: !!doImmediatelyFocus
      });

      this.keyframePropertyComponents.push(keyframePropertyComponent);
    }
  });

  return KeyframePropertyTrackComponentView;
});

define('rekapi-timeline.component.keyframe-property-track/main',[

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,Model
  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var KeyframePropertyTrackComponent = Base.extend({
    name: 'keyframe-property-track'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return KeyframePropertyTrackComponent;
});

define('rekapi-timeline.component.keyframe-property-track', ['rekapi-timeline.component.keyframe-property-track/main'], function (main) { return main; });

define('rekapi-timeline.component.actor-tracks/view',[

  'lateralus'

  ,'text!./template.mustache'

  ,'rekapi-timeline.component.keyframe-property-track'

], function (

  Lateralus

  ,template

  ,KeyframePropertyTrackComponent

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var ActorTracksComponentView = Base.extend({
    template: template

    ,modelEvents: {
      /**
       * @param {string} newTrackName
       */
      keyframePropertyTrackAdded: function (newTrackName) {
        this.addKeyframePropertyTrackComponent(newTrackName);
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.keyframePropertyTrackComponents = [];

      // Create views for any keyframes that were already defined
      this.model.getTrackNames().forEach(
          this.addKeyframePropertyTrackComponent, this);
    }

    /**
     * @param {string} trackName
     */
    ,addKeyframePropertyTrackComponent: function (trackName) {
      var keyframePropertyTrackComponent = this.addComponent(
          KeyframePropertyTrackComponent, {
        actorModel: this.model
      }, {
        modelAttributes: {
          trackName: trackName
        }
      });

      this.keyframePropertyTrackComponents.push(
        keyframePropertyTrackComponent);
      this.$el.append(keyframePropertyTrackComponent.view.$el);
    }
  });

  return ActorTracksComponentView;
});

define('rekapi-timeline.component.actor-tracks/main',[

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,Model
  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var ActorTracksComponent = Base.extend({
    name: 'actor-tracks'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return ActorTracksComponent;
});

define('rekapi-timeline.component.actor-tracks', ['rekapi-timeline.component.actor-tracks/main'], function (main) { return main; });

define('rekapi-timeline.component.animation-tracks/view',[

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

  ,'rekapi-timeline.component.actor-tracks'

], function (

  _
  ,Lateralus

  ,template

  ,ActorTracksComponent

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var AnimationTracksComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      /**
       * @param {RekapiTimelineActorModel} actorModel
       */
      actorAdded: function (actorModel) {
        this.addActorComponent(actorModel);
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.actorTracksComponents = [];

      // Backfill any preexisting ActorModels
      this.collectOne('actorCollection').each(this.addActorComponent, this);
    }

    /**
     * @param {RekapiTimelineActorModel} actorModel
     */
    ,addActorComponent: function (actorModel) {
      var actorTracksComponent = this.addComponent(ActorTracksComponent, {
        model: actorModel
      });

      this.actorTracksComponents.push(actorTracksComponent);
      this.$el.append(actorTracksComponent.view.$el);
    }
  });

  return AnimationTracksComponentView;
});

define('rekapi-timeline.component.animation-tracks/main',[

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,Model
  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var AnimationTracksComponent = Base.extend({
    name: 'animation-tracks'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return AnimationTracksComponent;
});

define('rekapi-timeline.component.animation-tracks', ['rekapi-timeline.component.animation-tracks/main'], function (main) { return main; });

define('rekapi-timeline.component.timeline/main',[

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

  ,'rekapi-timeline.component.scrubber'
  ,'rekapi-timeline.component.animation-tracks'

], function (

  Lateralus

  ,Model
  ,View
  ,template

  ,ScrubberComponent
  ,AnimationTracksComponent

) {
  'use strict';

  var Base = Lateralus.Component;

  var TimelineComponent = Base.extend({
    name: 'timeline'
    ,Model: Model
    ,View: View
    ,template: template

    ,initialize: function () {
      this.scrubberComponent = this.addComponent(ScrubberComponent, {
        el: this.view.$scrubber[0]
      });

      this.animationTracksComponent = this.addComponent(
          AnimationTracksComponent, {
        el: this.view.$animationTracks[0]
      });
    }
  });

  return TimelineComponent;
});

define('rekapi-timeline.component.timeline', ['rekapi-timeline.component.timeline/main'], function (main) { return main; });

define('rekapi-timeline.component.details/model',[

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  var Base = Lateralus.Component.Model;
  var baseProto = Base.prototype;

  var DetailsComponentModel = Base.extend({
    /**
     * Parameters are the same as http://backbonejs.org/#Model-constructor
     * @param {Object} [attributes]
     * @param {Object} [options]
     */
    initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return DetailsComponentModel;
});


define('text!rekapi-timeline.component.details/template.mustache',[],function () { return '<div class="$scrubberDetail"></div>\n<div class="$keyframePropertyDetail fill"></div>\n';});

define('rekapi-timeline.component.details/view',[

  'lateralus'

  ,'text!./template.mustache'

], function (

  Lateralus

  ,template

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var DetailsComponentView = Base.extend({
    template: template

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return DetailsComponentView;
});

define('rekapi-timeline.component.scrubber-detail/model',[

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  var Base = Lateralus.Component.Model;
  var baseProto = Base.prototype;

  var ScrubberDetailComponentModel = Base.extend({
    /**
     * Parameters are the same as http://backbonejs.org/#Model-constructor
     * @param {Object} [attributes]
     * @param {Object} [options]
     */
    initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return ScrubberDetailComponentModel;
});


define('text!rekapi-timeline.component.scrubber-detail/template.mustache',[],function () { return '<label class="label-input-pair row">\n  <p>Zoom:</p>\n  <input type="number" class="$scrubberScale scrubber-scale" value="{{initialZoom}}" min="0">\n</label>\n';});

define('rekapi-timeline.component.scrubber-detail/view',[

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

], function (

  _
  ,Lateralus

  ,template

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var ScrubberDetailComponentView = Base.extend({
    template: template

    ,events: {
      'change .scrubber-scale': function () {
        if (this.$scrubberScale[0].validity.valid) {
          this.lateralus.model.set(
            'timelineScale', (this.$scrubberScale.val() / 100));
        }
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }

    /**
     * @override
     */
    ,getTemplateRenderData: function () {
      var renderData = baseProto.getTemplateRenderData.apply(this, arguments);

      _.extend(renderData, {
        initialZoom: this.lateralus.model.get('timelineScale') * 100
      });

      return renderData;
    }
  });

  return ScrubberDetailComponentView;
});

define('rekapi-timeline.component.scrubber-detail/main',[

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,Model
  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var ScrubberDetailComponent = Base.extend({
    name: 'scrubber-detail'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return ScrubberDetailComponent;
});

define('rekapi-timeline.component.scrubber-detail', ['rekapi-timeline.component.scrubber-detail/main'], function (main) { return main; });

define('rekapi-timeline.component.keyframe-property-detail/model',[

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  var Base = Lateralus.Component.Model;
  var baseProto = Base.prototype;

  var KeyframePropertyDetailComponentModel = Base.extend({
    /**
     * Parameters are the same as http://backbonejs.org/#Model-constructor
     * @param {Object} [attributes]
     * @param {Object} [options]
     */
    initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return KeyframePropertyDetailComponentModel;
});


define('text!rekapi-timeline.component.keyframe-property-detail/template.mustache',[],function () { return '<h1 class="$propertyName keyframe-property-name">Detail</h1>\n<label class="label-input-pair row keyframe-property-millisecond">\n  <p>Millisecond:</p>\n  <input class="$propertyMillisecond property-millisecond" type="number" value="" name="millisecond">\n</label>\n<label class="label-input-pair row keyframe-property-value">\n  <p>Value:</p>\n  <input class="$propertyValue property-value" type="text" value="" name="value">\n</label>\n<label class="label-input-pair row select-container keyframe-property-easing">\n  <p>Easing:</p>\n  <select class="$propertyEasing" name="easing"></select>\n</label>\n<button class="field-button add">Add a new keyframe</button>\n<button class="field-button delete">Remove this keyframe</button>\n';});

define('rekapi-timeline.component.keyframe-property-detail/view',[

  'underscore'
  ,'lateralus'
  ,'shifty'

  ,'text!./template.mustache'

  ,'rekapi-timeline/constant'

], function (

  _
  ,Lateralus
  ,Tweenable

  ,template

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var KeyframePropertyDetailComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      /**
       * @param {KeyframePropertyComponentView} keyframePropertyView
       */
      userFocusedKeyframeProperty: function (keyframePropertyView) {
        if (this.keyframePropertyModel) {
          this.stopListening(this.keyframePropertyModel);
        }

        this.keyframePropertyModel = keyframePropertyView.model;
        this.listenTo(this.keyframePropertyModel, 'change',
          this.render.bind(this));

        var inputs = [];
        _.each(Tweenable.prototype.formula, function (formula, name) {
          var option = document.createElement('option');
          option.innerHTML = name;
          inputs.push(option);
        }, this);

        this.$propertyEasing.children().remove();
        this.$propertyEasing.append(inputs).val(
          this.keyframePropertyModel.get('easing'));

        this.render();
      }
    }

    ,events: {
      'change input': 'onChangeInput'
      ,'change select': 'onChangeInput'

      ,'click .add': function () {
        this.addNewKeyframeProperty();
      }

      ,'click .delete': function () {
        this.deleteCurrentKeyframeProperty();
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }

    ,render: function () {
      this.$propertyName.text(this.keyframePropertyModel.get('name'));
      this.$propertyMillisecond.val(
        this.keyframePropertyModel.get('millisecond'));
      this.$propertyValue.val(this.keyframePropertyModel.get('value'));
    }

    /**
     * @param {jQuery.Event} evt
     */
    ,onChangeInput: function (evt) {
      if (!this.keyframePropertyModel) {
        return;
      }

      var $target = $(evt.target);
      var val = $target.val();

      // If the inputted value string can be coerced into an equivalent Number,
      // do it.  Keyframe property values are initially set up as numbers, and
      // this cast prevents the user from inadvertently setting inconsistently
      // typed keyframe property values, thus breaking Rekapi.
      // jshint eqeqeq: false
      var coercedVal = val == +val ? +val : val;

      this.keyframePropertyModel.set($target.attr('name'), coercedVal);
      this.lateralus.update();
    }

    ,addNewKeyframeProperty: function () {
      if (!this.keyframePropertyModel) {
        return;
      }

      var keyframePropertyModel = this.keyframePropertyModel;
      var actor = keyframePropertyModel.getOwnerActor();

      var targetMillisecond =
        keyframePropertyModel.get('millisecond') +
        constant.NEW_KEYFRAME_PROPERTY_BUFFER_MS;
      var keyframeObject = {};
      keyframeObject[keyframePropertyModel.get('name')] =
        keyframePropertyModel.get('value');

      actor.keyframe(
        targetMillisecond
        ,keyframeObject
        ,keyframePropertyModel.get('easing'));
    }

    ,deleteCurrentKeyframeProperty: function () {
      if (!this.keyframePropertyModel) {
        return;
      }

      var keyframePropertyModel = this.keyframePropertyModel;
      keyframePropertyModel.getOwnerActor().removeKeyframeProperty(
        keyframePropertyModel.get('name')
        ,keyframePropertyModel.get('millisecond'));
    }
  });

  return KeyframePropertyDetailComponentView;
});

define('rekapi-timeline.component.keyframe-property-detail/main',[

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,Model
  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var KeyframePropertyDetailComponent = Base.extend({
    name: 'keyframe-property-detail'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return KeyframePropertyDetailComponent;
});

define('rekapi-timeline.component.keyframe-property-detail', ['rekapi-timeline.component.keyframe-property-detail/main'], function (main) { return main; });

define('rekapi-timeline.component.details/main',[

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

  ,'rekapi-timeline.component.scrubber-detail'
  ,'rekapi-timeline.component.keyframe-property-detail'

], function (

  Lateralus

  ,Model
  ,View
  ,template

  ,ScrubberDetailComponent
  ,KeyframePropertyDetailComponent

) {
  'use strict';

  var Base = Lateralus.Component;

  var DetailsComponent = Base.extend({
    name: 'details'
    ,Model: Model
    ,View: View
    ,template: template

    ,initialize: function () {
      this.scrubberDetailComponent =
        this.addComponent(ScrubberDetailComponent, {
        el: this.view.$scrubberDetail[0]
      });

      this.keyframePropertyDetailComponent =
        this.addComponent(KeyframePropertyDetailComponent, {
        el: this.view.$keyframePropertyDetail[0]
      });
    }
  });

  return DetailsComponent;
});

define('rekapi-timeline.component.details', ['rekapi-timeline.component.details/main'], function (main) { return main; });

define('rekapi-timeline.component.container/main',[

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

  ,'rekapi-timeline.component.control-bar'
  ,'rekapi-timeline.component.timeline'
  ,'rekapi-timeline.component.details'

], function (

  Lateralus

  ,Model
  ,View
  ,template

  ,ControlBarComponent
  ,TimelineComponent
  ,DetailsComponent

) {
  'use strict';

  var Base = Lateralus.Component;

  var ContainerComponent = Base.extend({
    name: 'container'
    ,Model: Model
    ,View: View
    ,template: template

    ,initialize: function () {
      this.controlBar = this.addComponent(ControlBarComponent, {
        el: this.view.$controlBar[0]
      });

      this.timelineComponent = this.addComponent(TimelineComponent, {
        el: this.view.$timeline[0]
      });

      this.detailsComponent = this.addComponent(DetailsComponent, {
        el: this.view.$details[0]
      });
    }
  });

  return ContainerComponent;
});

define('rekapi-timeline.component.container', ['rekapi-timeline.component.container/main'], function (main) { return main; });

define('rekapi-timeline/utils',[

  'underscore'

], function (

  _

) {
  'use strict';

  return  {
    /**
     * @param {Function} Source A constructor from which to steal prototype
     * methods.
     * @param {Function} Target A constructor whose instances Source's methods
     * should be .apply-ed to.
     * @param {Object} opts
     * @param {Array.<string>} [opts.blacklistedMethodNames] A list of method
     * names that should not be copied over from Source.prototype.
     * @param {function} [opts.subject] A function that returns the Object that
     * Source's methods should be applied to.
     */
    proxy: function (Source, Target, opts) {
      opts = opts || {};
      var blacklistedMethodNames = opts.blacklistedMethodNames || [];
      var subject = opts.subject;

      var whitelistedMethodNames =
        _.difference(Object.keys(Source.prototype), blacklistedMethodNames);
      var sourceProto = Source.prototype;
      var targetProto = Target.prototype;

      whitelistedMethodNames.forEach(function (methodName) {
        var method = sourceProto[methodName];
        targetProto[methodName] = function () {
          var target = subject ? subject.call(this) : this;
          return method.apply(target, arguments);
        };
      }, this);
    }
  };
});

define('rekapi-timeline/model',[

  'underscore'
  ,'lateralus'

  ,'rekapi-timeline/constant'

], function (

  _
  ,Lateralus

  ,constant

) {
  'use strict';

  var RekapiTimelineModel = Lateralus.Model.extend({
    defaults: {
      timelineScale: constant.DEFAULT_TIMELINE_SCALE
    }
  });

  return RekapiTimelineModel;
});

define('rekapi-timeline/models/keyframe-property',[

  'underscore'
  ,'backbone'
  ,'lateralus'
  ,'rekapi'

  ,'rekapi-timeline/utils'

], function (

  _
  ,Backbone
  ,Lateralus
  ,Rekapi

  ,utils

) {
  'use strict';

  var Base = Lateralus.Component.Model;

  var KeyframePropertyModel = Base.extend({
    defaults: {
      keyframeProperty: Rekapi.KeyframeProperty
    }

    ,lateralusEvents: {
      /**
       * @param {Rekapi} rekapi
       * @param {Rekapi.KeyframeProperty} keyframeProperty
       */
      'rekapi:removeKeyframeProperty': function (rekapi, keyframeProperty) {
        if (keyframeProperty === this.attributes) {
          this.destroy();
        }
      }
    }

    /**
     * @param {Object} attributes
     *   @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    ,initialize: function () {
      // Have all Backbone.Model.prototype methods act upon the
      // Rekapi.KeyframeProperty instance.
      this.attributes = this.attributes.keyframeProperty;

      this.id = this.attributes.id;
    }

    /**
     * @override
     */
    ,set: function (key, value) {
      Backbone.Model.prototype.set.apply(this, arguments);

      if (key in this.attributes) {
        // Modify the keyframeProperty via its actor so that the state of the
        // animation is updated.
        var obj = {};
        obj[key] = value;
        this.attributes.actor.modifyKeyframeProperty(
            this.attributes.name, this.attributes.millisecond, obj);
      }
    }

    /**
     * @return {RekapiTimelineActorModel}
     */
    ,getOwnerActor: function () {
      return this.collection.actorModel;
    }

    /**
     * Overrides the standard Backbone.Model#destroy behavior, as there is no
     * server data that this model is tied to.
     * @override
     */
    ,destroy: function () {
      this.trigger('destroy');
    }
  });

  utils.proxy(Rekapi.KeyframeProperty, KeyframePropertyModel);

  return KeyframePropertyModel;
});

define('rekapi-timeline/collections/keyframe-property',[

  'backbone'
  ,'lateralus'

  ,'rekapi-timeline/models/keyframe-property'

], function (

  Backbone
  ,Lateralus

  ,KeyframePropertyModel

) {
  'use strict';

  var Base = Lateralus.Component.Collection;

  var KeyframePropertyCollection = Base.extend({
    model: KeyframePropertyModel

    ,lateralusEvents: {
      /**
       * @param {Rekapi} rekapi
       * @param {Rekapi.KeyframeProperty} keyframeProperty
       */
      'rekapi:addKeyframeProperty': function (rekapi, keyframeProperty) {
        if (keyframeProperty.actor.id === this.actorModel.get('id')) {
          this.addKeyframePropertyToCollection(keyframeProperty);
        }
      }

      /**
       * @param {Rekapi} rekapi
       * @param {Rekapi.KeyframeProperty} keyframeProperty
       */
      ,'rekapi:removeKeyframeProperty': function (rekapi, keyframeProperty) {
        if (keyframeProperty.actor.id === this.actorModel.get('id')) {
          this.removeKeyframePropertyFromCollection(keyframeProperty);
        }
      }
    }

    /**
     * @param {null} models Should not contain anything.
     * @param {Object} opts
     *   @param {ActorModel} actorModel The actorModel that "owns" this
     *   collection.
     */
    ,initialize: function (models, opts) {
      this.actorModel = opts.actorModel;
    }

    /**
     * @param {Rekapi.KeyframeProperty} keyframeProperty
     * @return {KeyframePropertyModel} The keyframe property model that was
     * added.
     */
    ,addKeyframePropertyToCollection: function (keyframeProperty) {
      var keyframePropertyModel = this.initModel(KeyframePropertyModel, {
        keyframeProperty: keyframeProperty
      });

      this.emit('keyframePropertyAdded', this.add(keyframePropertyModel));
      return keyframePropertyModel;
    }

    /**
     * @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    ,removeKeyframePropertyFromCollection: function (keyframeProperty) {
      this.remove(keyframeProperty.id);
    }
  });

  return KeyframePropertyCollection;
});

define('rekapi-timeline/models/actor',[

  'lateralus'
  ,'rekapi'

  ,'rekapi-timeline/collections/keyframe-property'

  ,'rekapi-timeline/utils'

], function (

  Lateralus
  ,Rekapi

  ,KeyframePropertyCollection

  ,utils

) {
  'use strict';

  var Base = Lateralus.Component.Model;

  var ActorModel = Base.extend({
    defaults: {
      actor: Rekapi.Actor
    }

    ,lateralusEvents: {
      /**
       * @param {Rekapi} rekapi
       * @param {Rekapi.KeyframeProperty} keyframeProperty
       */
      'rekapi:addKeyframePropertyTrack': function (rekapi, keyframeProperty) {
        if (keyframeProperty.actor === this.attributes) {
          this.addKeyframePropertyTrack(keyframeProperty.name);
        }
      }
    }

    /**
     * @param {Object} attrs
     *   @param {Rekapi.Actor} actor
     */
    ,initialize: function () {
      // Have all Backbone.Model.prototype methods act upon the
      // Rekapi.Actor instance.
      this.attributes = this.attributes.actor;

      this.getTrackNames().forEach(this.addKeyframePropertyTrack, this);

      this.keyframePropertyCollection = this.initCollection(
        KeyframePropertyCollection
        ,null
        ,{ actorModel: this }
      );

      // Backfill the collection with any keyframeProperties the actor may
      // already have.
      this.getTrackNames().forEach(function (trackName) {
        this.getPropertiesInTrack(trackName).forEach(
          this.keyframePropertyCollection.addKeyframePropertyToCollection,
          this.keyframePropertyCollection);
      }, this);
    }

    /**
     * @param {string} trackName
     */
    ,addKeyframePropertyTrack: function (trackName) {
      this.emit('keyframePropertyTrackAdded', trackName);
    }
  });

  utils.proxy(Rekapi.Actor, ActorModel, {
    subject: function () {
      return this.attributes;
    }
  });

  return ActorModel;
});

define('rekapi-timeline/collections/actor',[

  'underscore'
  ,'backbone'
  ,'lateralus'

  ,'rekapi-timeline/models/actor'

], function (

  _
  ,Backbone
  ,Lateralus

  ,ActorModel

) {
  'use strict';

  var Base = Lateralus.Component.Collection;

  var ActorCollection = Base.extend({
    model: ActorModel

    ,provide: {
      /**
       * @return {ActorCollection}
       */
      actorCollection: function () {
        return this;
      }
    }

    ,lateralusEvents: {
      /**
       * @param {Rekapi} rekapi
       * @param {Rekapi.Actor} actor
       */
      'rekapi:addActor': function (rekapi, actor) {
        this.addActor(actor);
      }
    }

    ,initialize: function () {
      _.each(this.lateralus.getAllActors(), this.addActor, this);
    }

    /**
     * @param {Rekapi.Actor} actor
     */
    ,addActor: function (actor) {
      var actorModel = this.initModel(ActorModel, { actor: actor });
      this.emit('actorAdded', this.add(actorModel));
    }
  });

  return ActorCollection;
});

define('rekapi-timeline/rekapi-timeline',[

  'underscore'
  ,'lateralus'
  ,'rekapi'

  ,'rekapi-timeline.component.container'

  ,'rekapi-timeline/utils'
  ,'rekapi-timeline/model'
  ,'rekapi-timeline/collections/actor'

  // Silent dependency
  ,'jquery-dragon'

], function (

  _
  ,Lateralus
  ,Rekapi

  ,ContainerComponent

  ,utils
  ,RekapiTimelineModel
  ,ActorCollection

) {
  'use strict';

  /**
   * @param {Element} el
   * @param {Rekapi} rekapi The Rekapi instance that this widget represents.
   * @extends {Lateralus}
   * @constuctor
   */
  var RekapiTimeline = Lateralus.beget(function (el, rekapi) {
    Lateralus.apply(this, arguments);
    this.rekapi = rekapi;

    // Amplify all Rekapi events to "rekapi:" lateralusEvents.
    this.getEventNames().forEach(function (eventName) {
      this.rekapi.on(eventName, function () {
        this.emit.apply(
          this, ['rekapi:' + eventName].concat(_.toArray(arguments)));
      }.bind(this));
    }.bind(this));

    this.actorCollection = this.initCollection(ActorCollection);

    this.containerComponent = this.addComponent(ContainerComponent, {
      el: el
    });
  }, {
    Model: RekapiTimelineModel
  });

  _.extend(RekapiTimeline.prototype, {
    lateralusEvents: {
      stopAnimation: function () {
        this.stop().update(0);
      }
    }
  });

  // Decorate the Rekapi prototype with an init method.
  /**
   * @param {HTMLElement} el The element to contain the widget.
   */
  Rekapi.prototype.createTimeline = function (el) {
    return new RekapiTimeline(el, this);
  };

  utils.proxy(Rekapi, RekapiTimeline, {
    blacklistedMethodNames: ['on', 'off']
    ,subject: function () {
      return this.rekapi;
    }
  });

  return RekapiTimeline;
});

define('rekapi-timeline', ['rekapi-timeline/rekapi-timeline'], function (main) { return main; });

}());