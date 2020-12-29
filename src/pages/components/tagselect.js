import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Image, Dimensions } from 'react-native'
import { observer, inject } from 'mobx-react'
import { scaleSizeW, setSpText } from '../../tools/util'
var { width, height } = Dimensions.get('window');

class TagSelect extends Component {
        constructor(props) {
                super(props);

        }
        switch = (key) => {
             this.props.onChange(key)
        }
        render() {
                let itemSelectedStyle = [styles.btn, styles.btn_active];
                let itemSelectedTextStyle = [styles.btntxt, styles.btntxt_active];
                let itemStyle = [styles.btn];
                let itemTextStyle = [styles.btntxt];
                if (this.props.disabled !== undefined && this.props.disabled) {
                        itemTextStyle.push(styles.btntxt_disabled)
                }
                let itemStyleLogin = [styles.item2];
                switch (this.props.theme) {
                        default:
                                break;
                        case 'square':
                                itemSelectedStyle = [styles.square_item, styles.square_selectedItem];
                                itemSelectedTextStyle = [styles.square_item_text, styles.square_selectedItem_text];
                                itemStyle = [styles.square_item];
                                itemTextStyle = [styles.square_item_text];
                                break;
                }
                if (this.props.buttonStyle !== undefined) {
                        itemSelectedStyle.push(this.props.buttonStyle);
                        itemStyle.push(this.props.buttonStyle);
                }
                if (this.props.mode !== undefined && this.props.mode === 'multiSelector') {
                        return <TouchableOpacity disabled={this.props.disabled===true?true:false} onPress={() => { this.props.onChange(!this.props.value) }}>
                                {this.props.value ? <View style={[itemSelectedStyle, this.props.width !== undefined ? { width: scaleSizeW(this.props.width) } : null]}><Text style={itemSelectedTextStyle} numberOfLines={1}>{this.props.title}</Text></View> :
                                        <View style={[itemStyle, this.props.width !== undefined ? { width: scaleSizeW(this.props.width) } : null]}><Text style={itemTextStyle} numberOfLines={1}>{this.props.title}</Text></View>}
                        </TouchableOpacity>
                } else {
                        var items = this.props.data.map((item, index) => {
                                return <TouchableOpacity disabled={this.props.disabled===true?true:false} onPress={() => { this.switch(item.key); }} key={index}>
                                        {this.props.value === item.key ? <View style={[itemSelectedStyle]}><Text style={itemSelectedTextStyle} numberOfLines={1}>{item.value}</Text></View> :
                                                <View style={[itemStyle]}><Text style={itemTextStyle} numberOfLines={1}>{item.value}</Text></View>}
                                </TouchableOpacity>
                        })
                        return <View style={[styles.btnwrap]}>{items}</View>
                }
        }
}

const styles = StyleSheet.create({
        btnwrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'wrap' },
        btn: {
                borderRadius: scaleSizeW(4),
                backgroundColor: "#f7f7f7", width: scaleSizeW(160), margin: scaleSizeW(4), height: scaleSizeW(80),
        },
        btntxt: {
                color: "#333",
                fontSize: setSpText(28), textAlign: "center", lineHeight: scaleSizeW(80)
        },
        btntxt_disabled: {
                color: "#999"
        },
        btn_active: { backgroundColor: "#fc4185" },
        btntxt_active: { color: "#fff" },


        checkboxContainer: {
                flexDirection: 'row',
                marginRight: 10,
                flexWrap: 'wrap'
        },
        item: {
                width: scaleSizeW(180),
                height: scaleSizeW(70),
                borderWidth: 1,
                borderColor: '#cccccc',
                backgroundColor: '#f6f6f6',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: scaleSizeW(35),
                marginRight: scaleSizeW(20),
                marginBottom: scaleSizeW(20)
        },
        item_text: {
                color: '#666',
                fontSize: setSpText(30),
        },
        selectedItem: {
                borderColor: '#339ff4',
                backgroundColor: '#f4f8ff'
        },
        selectedItem_text: {
                color: '#2196f3',
        },
        square_item: {
                width: scaleSizeW(196),
                height: scaleSizeW(60),
                borderWidth: scaleSizeW(1),
                borderColor: '#f4f4f4',
                backgroundColor: '#f4f4f4',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: scaleSizeW(10),
                marginRight: scaleSizeW(20),
                marginBottom: scaleSizeW(20)
        },
        square_item_text: {
                color: '#666666',
                fontSize: setSpText(28),
        },
        square_selectedItem: {
                borderColor: '#2196f3',
                backgroundColor: '#2196f3'
        },
        square_selectedItem_text: {
                color: '#fff',
        },
        checkboxContainer2: {
                flexDirection: 'row',
                justifyContent: "space-around",
        },
        item2: {
                justifyContent: 'center',
                alignItems: 'center',
        },
        img: {
                width: scaleSizeW(108),
                height: scaleSizeW(173),
                marginBottom: scaleSizeW(24)
        },
        line: {
                width: 1, height: scaleSizeW(80), backgroundColor: "#ccc",
                position: "absolute", left: (width - scaleSizeW(80)) / 2, top: scaleSizeW(16)
        }
})

export default TagSelect