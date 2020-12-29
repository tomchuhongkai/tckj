import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, Dimensions } from 'react-native'
import { scaleSizeW,setSpText } from '../../tools/util';
const deviceWidth = Platform.OS === "ios"
    ? Dimensions.get("window").width
    : Dimensions.get("screen").width;
class CustomPickerShow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: props.keyName === undefined ? 'Value' : props.keyName,
            value: props.valueName === undefined ? 'Text' : props.valueName
        }
    }
    showPop = () => {
        this.setState({ Visible: true })
    }
    render() {
        return (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <View style={[styles.dialog]}>
                            <FlatList
                                contentContainerStyle={{ flexGrow: 1, alignItems: 'flex-start', alignSelf: 'center' }}
                                data={this.props.Items}
                                extraData={this.props}
                                keyExtractor={this._keyExtractor}
                                renderItem={this._renderItem}>
                            </FlatList>
                        </View>
                    </View>
          )
    }
    _keyExtractor = (item, index) => {
        return index.toString();
    }
    _renderItem = ({ item }) => {
        let v = typeof (item) === 'object' ? item[this.state.key] : item;
        if (v.toString() === '0')
            return null
        return (
            <TouchableOpacity onPress={() => {  this.props.onChange(v,item); }} >
              <View style={[styles.item_line,this.props.SelectedValue==item[this.state.key]?styles.item_line_cur:null]}>
        <Text style={[styles.item_text,this.props.SelectedValue==item[this.state.key]?styles.item_text_cur:null]}>{typeof (item) === 'object' ? item[this.state.value] : item}</Text>
              </View>
            </TouchableOpacity>)
    }
}

export default CustomPickerShow;

const styles = StyleSheet.create({
    dialog: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 0,
        paddingTop: scaleSizeW(40),
        position: 'relative',
        paddingBottom: scaleSizeW(30)
    },
    item_line: {
        height: scaleSizeW(90),
        lineHeight: scaleSizeW(90),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#efefef',
        width:deviceWidth,marginBottom:scaleSizeW(20)
    },
    item_line_cur:{
        backgroundColor:'#fc4185'
    },

    item_text: {
        fontSize: setSpText(28),
        color: '#000',
    },
    item_text_cur:{color:'#fff'},
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