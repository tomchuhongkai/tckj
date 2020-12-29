import React, { Component } from 'react'
import { View,Text,TouchableOpacity } from 'react-native'
import { scaleSizeW, setSpText } from '../../tools/util';

class EditButton extends Component {
    render() {
        return (<View style={{marginLeft:scaleSizeW(40),width:scaleSizeW(100)}}><TouchableOpacity onPress={()=>this.props.action()}><Text style={{color:'#2196f3',fontSize:setSpText(26)}}>{this.props.ButtonName}</Text></TouchableOpacity></View>);
    }
}

export default EditButton;