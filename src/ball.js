import React, { Component } from 'react';
import { View, Animated } from 'react-native';

class Ball extends Component {
  componentWillMount() {
    console.log('Mounding');
    this.position = new Animated.ValueXY(0,0);
    this.moveBall = Animated.spring(this.position, {
      toValue: { x: 200, y: 200 }
    }).start()
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
