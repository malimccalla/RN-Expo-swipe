import React, { Component } from 'react';
import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager
} from 'react-native';

import styles from './Deck.styles';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;
const RIGHT = 'right';
const LEFT = 'left';

class Deck extends Component {
  static defaultProps = {
    onSwipeRight: () => console.log('onSwipeRight has not been set'),
    onSwipeLeft: () => console.log('onSwipeLeft has not been set'),
    renderNoMoreCards: () => console.log('renderNoMoreCards has not been set')
  }

  constructor(props) {
    super(props);

    this.position = new Animated.ValueXY();
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (event, grestureState) => true,
      onPanResponderMove: (event, gestureState) => {
        this.position.setValue({ x: gestureState.dx , y: gestureState.dy });
      },
      onPanResponderRelease: (event, gestureState) => {
        const isTooSlow = Math.abs(gestureState.vx) < 0.3;
        if ((gestureState.dx > SWIPE_THRESHOLD) && !isTooSlow) {
          this.forceSwipe(RIGHT);
        } else if ((gestureState.dx < -SWIPE_THRESHOLD) && !isTooSlow) {
          this.forceSwipe(LEFT);
        } else {
          this.resetPosition();
        }
      }
    });

    this.state = { index: 0 };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({ index: 0 });
    }
  }

  componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  }

  forceSwipe(direction) {
    const x = direction === RIGHT ? SCREEN_WIDTH : -SCREEN_WIDTH;

    Animated.timing(this.position, {
      toValue: { x , y: -300 },
      duration: SWIPE_OUT_DURATION
    }).start(() => {
      this.onSwipeComplete(direction);
    })
  }

  onSwipeComplete(direction) {
    const { onSwipeRight, onSwipeLeft } = this.props;
    const item = this.props.data[this.state.index];

    this.position.setValue({ x: 0, y: 0 });
    this.setState({ index: this.state.index + 1 });

    direction === RIGHT ? onSwipeRight(item) : onSwipeLeft(item);
  }

  resetPosition() {
    Animated.spring(this.position, {
      toValue: { x: 0, y: 0}
    }).start();
  }

  getCardStyle() {
    const { position } = this;
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: ['20deg', '0deg', '-20deg']
    });

    const scale = position.y.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: [0.8, 1, 0.8]
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }, { scale }]
    }
  }

  renderCards() {
    if (this.state.index >= this.props.data.length) {
      return this.props.renderNoMoreCards();
    }

    return this.props.data.map((item, i) => {
      if (i < this.state.index) {
        return null;
      }

      if (i === this.state.index) {
        return (
          <Animated.View
            key={item.id}
            style={[this.getCardStyle(), styles.cardStyle]}
            {...this.panResponder.panHandlers}
          >
            {this.props.renderCard(item)}
          </Animated.View>
        )
      }

      return (
        <Animated.View
          key={item.id}
          style={[styles.cardStyle, { top: 10 * (i - this.state.index)}]}
        >
          {this.props.renderCard(item)}
        </Animated.View>
      )
    }).reverse();
  }

  render() {
    return (
      <View>
        {this.renderCards()}
      </View>
    );
  }
}

export default Deck;
