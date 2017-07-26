import React, { Component } from 'react';
import { View, Animated, PanResponder, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

class Deck extends Component {
  constructor(props) {
    super(props);

    this.position = new Animated.ValueXY();
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (event, grestureState) => true,
      onPanResponderMove: (event, gestureState) => {
        this.position.setValue({ x: gestureState.dx , y: gestureState.dy });
      },
      onPanResponderRelease: (event, grestureState) => {
        this.resetPosition();
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
