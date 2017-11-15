// TODO: This code depends on some ES6 built-ins so document the need for this
// environment dependency: https://babeljs.io/docs/usage/polyfill/

import { Rekapi } from 'rekapi';
import { Tweenable } from 'shifty';
import React, { Component } from 'react';
import Details from './details';
import Timeline from './timeline';
import BottomFrame from './bottom-frame';

import {
  newPropertyMillisecondBuffer
} from './constants';

/**
 * @typedef RekapiTimeline.propertyCursor
 * @type {Object}
 * @property {string} property
 * @property {number} millisecond
 */

/**
 * @typedef RekapiTimeline.props
 * @type {Object}
 * @property {external:rekapi.Rekapi} rekapi
 */

/**
 * @typedef RekapiTimeline.state
 * @type {Object}
 * @property {external:rekapi.timelineData} rekapi
 * @property {RekapiTimeline.propertyCursor|{}} propertyCursor
 * @property {Array.<string>} easingCurves
 */

export default class RekapiTimeline extends Component {
  /**
   * @param {RekapiTimeline.props} props
   * @constructs RekapiTimeline
   */
  constructor ({ rekapi = new Rekapi() }) {
    super(arguments[0]);

    this.bindMethods();

    this.state = {
      rekapi: rekapi.exportTimeline(),
      propertyCursor: {},
      easingCurves: Object.keys(Tweenable.formulas)
    };

    rekapi.on('timelineModified', () => {
      this.setState({
        rekapi: rekapi.exportTimeline()
      });
    });
  }

  /**
   * @method RekapiTimeline#bindMethods
   * @returns {undefined}
   * @private
   */
  bindMethods () {
    [
      'handleAddKeyframeButtonClick',
      'handleDeleteKeyframeButtonClick',
      'handleEasingSelectChange'
    ].forEach(method => this[method] = this[method].bind(this));
  }

  /**
   * Method to be called after {@link external:shifty.setBezierFunction} and
   * {@link external:shifty.unsetBezierFunction} are called.  This is needed to
   * update the easing list after {@link external:shifty.Tweenable.formulas} is
   * modified which cannot be done automatically in a cross-browser compatible,
   * performant way.
   * @method RekapiTimeline#updateEasingList
   * @returns {undefined}
   */
  updateEasingList () {
    this.setState({
      easingCurves: Object.keys(Tweenable.formulas)
    });
  }

  /**
   * Returns the current {@link external:rekapi.Actor}.
   * @method RekapiTimeline#getActor
   * @returns {external:rekapi.Actor|undefined}
   * @private
   */
  getActor () {
    return this.props.rekapi.getAllActors()[0];
  }

  /**
   * @method RekapiTimeline#handleAddKeyframeButtonClick
   * @returns {undefined}
   */
  handleAddKeyframeButtonClick () {
    const { props, state } = this;
    const { propertyCursor } = state;

    if (!Object.keys(propertyCursor).length) {
      return;
    }

    const keyframeProperty = RekapiTimeline.computeHighlightedKeyframe(
      props.rekapi,
      propertyCursor
    );

    const newPropertyMillisecond =
      propertyCursor.millisecond + newPropertyMillisecondBuffer;

    this.getActor().keyframe(
      newPropertyMillisecond,
      {
        [propertyCursor.property]: keyframeProperty.value
      }
    );

    this.setState({
      propertyCursor: {
        property: propertyCursor.property,
        millisecond: newPropertyMillisecond
      }
    });
  }

  /**
   * @method RekapiTimeline#handleDeleteKeyframeButtonClick
   * @returns {undefined}
   */
  handleDeleteKeyframeButtonClick () {
    const { millisecond, property } = this.state.propertyCursor;

    const priorProperty = this.getActor().getPropertiesInTrack(property).find(
      ({ nextProperty }) =>
        nextProperty && nextProperty.millisecond === millisecond
    );

    this.getActor().removeKeyframeProperty(
      property,
      millisecond
    );

    this.setState({
      propertyCursor: (priorProperty ?
        {
          property: priorProperty.name,
          millisecond: priorProperty.millisecond
        } :
        {}
      )
    });
  }

  /**
   * @method RekapiTimeline#handleEasingSelectChange
   * @param {external:React.SyntheticEvent} e
   * @returns {undefined}
   */
  handleEasingSelectChange (e) {
    const { value: easing } = e.target;
    const { propertyCursor: { property, millisecond } } = this.state;

    this.getActor().modifyKeyframeProperty(
      property,
      millisecond,
      { easing }
    );
  }

  render () {
    const { props, state } = this;

    const keyframeProperty = props.rekapi ?
      RekapiTimeline.computeHighlightedKeyframe(
        props.rekapi,
        state.propertyCursor
      ) :
      {};

    const isAnyKeyframeHighlighted = !!Object.keys(keyframeProperty).length;

    return (
      <div className="rekapi-timeline">
        <Details
          easingCurves={state.easingCurves}
          keyframeProperty={keyframeProperty}
          handleAddKeyframeButtonClick={this.handleAddKeyframeButtonClick}
          handleDeleteKeyframeButtonClick={this.handleDeleteKeyframeButtonClick}
          handleEasingSelectChange={this.handleEasingSelectChange}
        />
        <Timeline />
        <BottomFrame />
      </div>
    );
  }
}

Object.assign(RekapiTimeline, {
  /**
   * Compute a {@link external:rekapi.propertyData} from a
   * {@link RekapiTimeline.propertyCursor} and a
   * {@link external:rekapi.Rekapi}.
   * @returns {external:rekapi.propertyData|{}} Is `{}` if the
   * {@link external:rekapi.KeyframeProperty} referenced by `propertyCursor`
   * cannot be found.
   * @method RekapiTimeline.computeHighlightedKeyframe
   * @param {external:rekapi.Rekapi} rekapi
   * @param {RekapiTimeline.propertyCursor} propertyCursor
   * @static
   */
  computeHighlightedKeyframe (rekapi, { property, millisecond }) {
    const [ actor ] = rekapi.getAllActors();

    if (!actor
      || property === undefined
      || millisecond === undefined
      || !actor.getPropertiesInTrack(property).length
    ) {
      return {};
    }

    const keyframeProperty = actor.getKeyframeProperty(property, millisecond);
    return keyframeProperty ? keyframeProperty.exportPropertyData() : {};
  }
});
