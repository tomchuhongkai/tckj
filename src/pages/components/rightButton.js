import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import { scaleSizeW } from '../../tools/util';

class RightButton extends Component {
    render() {
        if (this.props.children === undefined || this.props.children === null || this.props.children.length === 0) {
            return <View style={{ marginRight: scaleSizeW(40), width: scaleSizeW(130) }}></View>;
        }
        return (<View style={{ marginRight: scaleSizeW(40), width: scaleSizeW(130),flex:1,justifyContent:'flex-end',flexDirection:'row' }}>
            {this.props.children}
        </View>);
    }
}

export default RightButton;