import React, { Component } from 'react'
import { View, Animated, StyleSheet, TouchableOpacity, Text } from 'react-native'
import {  scaleSizeW, setSpText } from '../../tools/util'
let _width = scaleSizeW(60);

class SlideBar extends Component {
    constructor(props) {
        super(props);
        let _noText = this.props.NoText === undefined ? "否" : this.props.NoText;
        let _yesText = this.props.YesText === undefined ? "是" : this.props.YesText;
        let _value = this.props.defaultValue === undefined ? false : this.props.defaultValue;
        let _left = _value ? new Animated.Value(_width) : new Animated.Value(0);
        this.state = {
            left: _left,
            yesText: _yesText,
            noText: _noText,
            text: _value ? _yesText : _noText
        }
    }
    slideIt = () => {
        let that = this;
        if (this.state.left._value === 0) {
            Animated.timing(this.state.left, {
                toValue: _width,
                duration: 200
            }).start(() => {
                that.setState({
                    text: that.state.yesText
                })
                if (that.props.onChange)
                    that.props.onChange(true);
            })
        } else {
            Animated.timing(this.state.left, {
                toValue: 0,
                duration: 200
            }).start(() => {
                that.setState({
                    text: that.state.noText
                })
                if (that.props.onChange)
                    that.props.onChange(false);
            })
        }
    }
    render() {
        let backgroundColor = this.state.left.interpolate({
            inputRange: [0, _width],
            outputRange: ['#fff', '#fc4185']
        })
        let textLeft = this.state.left.interpolate({
            inputRange: [0, _width],
            outputRange: [_width, 0]
        })
        return (
            <View style={styles.slide_container}>
                <View style={styles.bar_container}></View>
                <Animated.View style={[styles.slide_circle, { left: this.state.left, backgroundColor: backgroundColor }]}>
                    <TouchableOpacity onPress={this.slideIt} style={{ flex: 1 }}></TouchableOpacity>
                </Animated.View>
                <Animated.View style={[{ left: textLeft, width: _width, height: _width }, styles.text_container]}>
                    <Text style={styles.text}>{this.state.text}</Text>
                </Animated.View>
            </View>
        )
    }
}

export default SlideBar

const styles = StyleSheet.create({
    slide_container: {
        width: scaleSizeW(120),
        height: scaleSizeW(60),
        position: 'relative'
    },
    bar_container: {
        width: scaleSizeW(120),
        height: scaleSizeW(40),
        borderRadius: scaleSizeW(20),
        backgroundColor: '#dcdcdc',
        position: 'absolute',
        left:0,
        right:0,
        top:scaleSizeW(11),
        zIndex:0
    },
    slide_circle: {
        width: scaleSizeW(60),
        height: scaleSizeW(60),
        borderRadius: scaleSizeW(30),
        backgroundColor: '#fff',
        position: 'absolute',
        borderWidth: scaleSizeW(1),
        borderColor: '#dcdcdc',
        zIndex:2
    },
    text_container: {
        flexDirection: 'row', display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: setSpText(28),
        color: '#000'
    }
})
