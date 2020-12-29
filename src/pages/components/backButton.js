import React, { Component } from 'react'
import { View,TouchableOpacity,Image } from 'react-native'
import {  scaleSizeW } from '../../tools/util';

class BackButton extends Component {
    render() {
        return (<View style={{marginLeft:scaleSizeW(0),width:scaleSizeW(130)}}><TouchableOpacity style={{paddingLeft:scaleSizeW(40)}} onPress={()=>this.props.goBack()}><Image style={{width:scaleSizeW(18),height:scaleSizeW(30)}} source={this.props.color==='white'? require('../../../images/back_icon_white.png'): require('../../../images/back_icon.png')} /></TouchableOpacity></View>);
    }
}

export default BackButton;