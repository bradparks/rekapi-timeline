define([

  'jquery'
  ,'underscore'
  ,'backbone'
  ,'mustache'

  ,'rekapi.timeline.constants'

  ,'text!templates/keyframe-property.mustache'

], function (

  $
  ,_
  ,Backbone
  ,Mustache

  ,rekapiTimelineConstants

  ,KeyframePropertyTemplate

) {
  'use strict';

  var KeyframePropertyView = Backbone.View.extend({
    events: {
      'focus button': 'onFocus'
    }

    /**
     * @param {Object}
     *   @param {RekapiTimeline} rekapiTimeline
     *   @param {KeyframePropertyTrackView} keyframePropertyTrackView
     */
    ,initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.keyframePropertyTrackView = opts.keyframePropertyTrackView;
      this.$el.addClass('rt-keyframe-property-view');
      this.initialRender();
      this.$handle = this.$el.find('.rt-keyframe-property');

      if (this.rekapiTimeline.hasRendered) {
        this.onInitialTimelineDOMRender();
      } else {
        this.listenToOnce(this.rekapiTimeline, 'initialDOMRender',
            _.bind(this.onInitialTimelineDOMRender, this));
      }

      this.listenTo(this.model, 'destroy', _.bind(this.dispose, this));
    }

    ,initialRender: function () {
      this.$el.html(Mustache.render(
          KeyframePropertyTemplate, this.model.getKeyframeProperty()));
    }

    ,onInitialTimelineDOMRender: function () {
      this.$el.dragon({
        within: this.keyframePropertyTrackView.$el
        ,drag: _.bind(this.onDrag, this)
        ,dragEnd: _.bind(this.onDragEnd, this)
      });
    }

    ,render: function () {
      this.$el.css({
        left: (
            rekapiTimelineConstants.PIXELS_PER_SECOND
            * this.model.get('millisecond')) / 1000
      });
    }

    ,onFocus: function (evt) {
      evt.targetView = this;
      this.rekapiTimeline.trigger('focusKeyframeProperty', evt);
    }

    ,onDrag: function () {
      this.updateKeyframeProperty();
    }

    // In Firefox, completing a $.fn.dragon drag does not focus the element, so
    // it must be done explicity.
    ,onDragEnd: function () {
      this.$handle.focus();
    }

    /**
     * Reads the state of the UI and persists that to the Rekapi animation.
     */
    ,updateKeyframeProperty: function () {
      var scaledValue = Math.round(
          this.rekapiTimeline.getTimelineMillisecondForHandle(this.$el));

      // Modify the keyframeProperty via its actor so that the state of the
      // animation is updated.
      var model = this.model;
      model.set('millisecond', scaledValue);

      // FIXME: Updating the Rekapi data should be done in the model, not the
      // view.
      model.getActor().modifyKeyframeProperty(
          model.get('name'), model.get('millisecond'), {
            millisecond: scaledValue
          });

      this.rekapiTimeline.update();
    }

    ,dispose: function () {
      this.rekapiTimeline.dispose(this);
    }
  });

  return KeyframePropertyView;
});
