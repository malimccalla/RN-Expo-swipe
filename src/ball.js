import React, { Component } from 'react';
import { View, Animated } from 'react-native';

class Ball extends Component {
  componentWillMount() {
    this.position = new Animated.ValueXY(0,0);
    console.log('Position before', this.position.getLayout());
    this.moveBall = Animated.spring(this.position, {
      toValue: { x: 200, y: 200 }
    }).start()
    console.log('Position after', this.position);
  }

  render() {
    return (
      <Animated.View style={this.position.getLayout()}>
        <View style={styles.ball}/>
      </Animated.View>
    );
  }
}

const styles = {
  ball: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 30,
    borderColor: 'black'
  }
};

export default Ball;
