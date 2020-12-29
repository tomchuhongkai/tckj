import React, { Component } from 'react'
import { View, StyleSheet, Image, Text } from 'react-native'
import { scaleSizeW, setSpText } from '../../tools/util'

class NoRecords extends Component {
    render() {
        return (
            <View style={styles.no_record}>
                <Image style={{ width: scaleSizeW(300), height: scaleSizeW(300) }} source={require('../../../images/icon-nodata.png')} />
                {this.props.renderText === undefined ? null : this.props.renderText(styles.textStyle, styles.textBigStyle,styles.containerStyle)}
            </View>
        )
    }
}

export default NoRecords

const styles = StyleSheet.create({
    no_record: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textBigStyle: {
        fontSize: setSpText(36),
        color: '#b6b9bf'
    },
    textStyle: {
        fontSize: setSpText(28),
        color: '#b6b9bf'
    },
    containerStyle: {
        marginTop:scaleSizeW(80),
        alignItems:'center',
        justifyContent:'center'
    }
})