import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import * as utils from '../../tools/util'

class LongTouchAction extends Component {
    render() {
        if (this.props.children.length === 0)
            return null;
        if (!this.props.Show)
            return null;
        return (
            <TouchableOpacity onPress={() => {
                if (this.props.onClose)
                    this.props.onClose()
            }} style={styles.long_touch_buttons}>
                <View style={styles.button_container}>
                    {this.props.children}
                </View>
            </TouchableOpacity>
        );
    }
}

export default LongTouchAction;

const styles = StyleSheet.create({
    long_touch_buttons: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 999,
        top: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    button_container: {
        minHeight: utils.scaleSizeW(60),
        width: utils.scaleSizeW(250),
        borderColor: '#dedede',
        borderWidth: utils.scaleSizeW(1),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingTop: utils.scaleSizeW(20),
        paddingBottom: utils.scaleSizeW(20)
    }
})