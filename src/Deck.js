import React, { Component } from 'react';
import { View, Animated, PanResponder } from 'react-native';

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
        console.log('Released!');
      }
    });
  }

  renderCards() {
    return this.props.data.map((item) => {
      return this.props.renderCard(item);
    });
  }

  render() {
    return (
      <Animated.View { ...this.panResponder.panHandlers}
        style={this.position.getLayout()}
      >
        {this.renderCards()}
      </Animated.View>
    );
  }
}

export default Deck;
