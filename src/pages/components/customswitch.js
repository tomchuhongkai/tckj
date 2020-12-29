import React, { Component } from 'react'
import { StyleSheet, Image, TouchableOpacity } from 'react-native'
import { scaleSizeW,setSpText } from '../../tools/util';

class CustomSwitch extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let checked = require('../../../images/Switch-on.png');
        let unChecked = require('../../../images/Switch-off.png');
        if (this.props.Value) {
            return (<TouchableOpacity onPress={() => { this.props.onChange(!this.props.Value) }}>
                <Image source={checked} style={[styles.imageSize,this.props.style===undefined?null:this.props.style]} />
            </TouchableOpacity>);
        }
        return (<TouchableOpacity onPress={() => { this.props.onChange(!this.props.Value) }}>
            <Image source={unChecked} style={[styles.imageSize,this.props.style===undefined?null:this.props.style]} />
        </TouchableOpacity>);
    }
}

const styles = StyleSheet.create({
    imageSize: {
        width: scaleSizeW(54),
        height: scaleSizeW(54),
    }
})

export default CustomSwitch
