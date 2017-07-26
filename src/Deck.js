import React, { Component } from 'react';
import { View, Animated, PanResponder, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;

class Deck extends Component {
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
          // this.forceSwipeRight()
        } else if ((gestureState.dx < -SWIPE_THRESHOLD) && !isTooSlow) {
          console.log('Dislikes :(');
        } else {
          this.resetPosition();
        }
      }
    });
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
      outputRange: ['-80deg', '0deg', '80deg']
    })

    return {
      ...position.getLayout(),
      transform: [{ rotate }]
    }
  }

  renderCards() {
    return this.props.data.map((item, index) => {
      if (index === 0) {
        return (
          <Animated.View
            key={item.id}
            style={this.getCardStyle()}
            {...this.panResponder.panHandlers}
          >
            {this.props.renderCard(item)}
          </Animated.View>
        )
      }

      return this.props.renderCard(item);
    });
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
