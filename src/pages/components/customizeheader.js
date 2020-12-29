import React from 'react'
import { View, TouchableOpacity, StyleSheet, Text, Image } from "react-native";
import commonStyle from '../../tools/commonstyles'
import { scaleSizeW, setSpText } from '../../tools/util'
let theme_default = require('../../../images/back_icon.png');
let theme_blue = require('../../../images/back_icon_white.png');
class CustomizeHeader extends React.Component {
    render() {
        let _styles = [commonStyle.popup_container_closeline, {
            position: 'absolute',
            left: 0,
            bottom: 0,
            top: 0,
            zIndex: 999,
            backgroundColor: '#fff',
        }];
        let _textStyle = [styles.headerTitleText];
        if (this.props.textStyle !== undefined) {
            _textStyle.push(this.props.textStyle);
        }
        if (this.props.theme !== undefined) {
            _styles.push(styles[`theme_${this.props.theme}`]);
            _textStyle.push(styles[`theme_${this.props.theme}_text`]);
        }
        if (this.props.style !== undefined) {
            _styles.push(this.props.style);
        }
        return (<View style={_styles}>
            {this.props.Title === undefined ? null : <View style={[styles.headerTitle]}>
                <View style={{maxWidth:scaleSizeW(560)}}><Text numberOfLines={1} style={_textStyle}>{this.props.Title}</Text></View>
            </View>}
            {this.props.showBack === true || this.props.showBack === undefined ? <TouchableOpacity onPress={this.props.goBack} style={commonStyle.popup_container_back}>
                <Image source={this.props.theme === 'blue' ? theme_blue : theme_default} style={[commonStyle.popup_container_back_img]} />
            </TouchableOpacity> : null}
            {this.props.children !== undefined ? this.props.children : null}
        </View>)
    }
}

export default CustomizeHeader

const styles = StyleSheet.create({
    headerTitle: {
        position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerTitleText: {
        color: '#000', fontSize: setSpText(32)
    },
    theme_blue: {
        backgroundColor: '#4576f7'
    },
    theme_blue_text: {
        color: '#fff'
    }
})