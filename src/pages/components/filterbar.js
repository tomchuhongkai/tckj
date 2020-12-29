import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, Button,Platform,Dimensions } from 'react-native'
import { setSpText, scaleSizeW } from '../../tools/util';
import commonStyle from '../../tools/commonstyles';
import Modal from 'react-native-modal'
const deviceHeight = Platform.OS === "ios"
    ? Dimensions.get("window").height
    : Dimensions.get("screen").height;

class FilterBar extends Component {
    constructor(props) {
        super(props);
}
    render() {
        return (
            <Modal deviceHeight={deviceHeight} isVisible={this.props.visible} onBackdropPress={this.props.onClose}>
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'column' }}>
                    <View style={[styles.dialog]}>
                        {this.props.children}
                        <View style={commonStyle.dialog_footer}>
                            <TouchableOpacity onPress={this.props.onClose} >
                                <Text style={[commonStyle.dialog_title_text,{ alignSelf: 'center' }]}>取消</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>)
    }
}

export default FilterBar;

const styles = StyleSheet.create({
    dialog: {
        width: '100%',
        borderRadius: scaleSizeW(10),
        paddingTop: scaleSizeW(40),
        position: 'relative',
        paddingBottom: scaleSizeW(90)
    },
    item_line: {
        height: scaleSizeW(60),
        lineHeight: scaleSizeW(60),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    item_text: {
        fontSize: setSpText(28),
        color: '#000',
    },
    select_style: {
        alignItems: 'flex-start',
        borderBottomColor: '#ccc', borderBottomWidth: 1,

        height: scaleSizeW(70),
        position: 'relative'
    },
    dropIcon: {
        width: scaleSizeW(30),
        height: scaleSizeW(18),
        position: 'absolute',
        right: scaleSizeW(10),
        bottom: scaleSizeW(40)
    }
})