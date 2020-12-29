import React, { Component } from 'react'
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native'
import { scaleSizeW,setSpText } from '../../tools/util';


class CheckBox extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let checked = require('../../../images/checked-new-2.png');
        let unChecked = require('../../../images/unchecked-new.png');
        if (this.props.mode != 'single') {
            let _class=[styles.text];
            if(this.props.isChecked)
                _class.push(styles.text_select)
            return (<TouchableOpacity underlayColor='#fff' onPress={() => { this.props.onChange(!this.props.isChecked) }}>
                <View style={styles.checkboxContainer}>
                {this.props.isChecked ? <Image source={checked} style={styles.imageSize} /> :
                    <Image source={unChecked} style={styles.imageSize} />}
                <Text style={_class}>{this.props.label}</Text>
            </View></TouchableOpacity>);
        } else {
            var items = this.props.data.map((item, index) => {
                return <View style={this.props.bodyStyle} key={index}>
                    <TouchableOpacity onPress={() => { this.props.onChange(item.key) }}>
                        <View style={styles.checkboxContainer}>
                            {this.props.value === item.key ? <Image source={checked} style={styles.imageSize} /> :
                                <Image source={unChecked} style={styles.imageSize} />}
                            <Text style={{ color: '#000', fontSize: setSpText(30) }}>{item.value}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            })
            return <View style={styles.checkboxContainer}>{items}</View>
        }
    }
}

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        marginRight: 10,
        justifyContent:'center',
        alignItems:'center'
    },
    imageSize: {
        // marginRight: 5,
        // marginTop: 3,
        width:16,height:16
    },
    text:{
        color:'#ccc',fontSize: setSpText(30),marginLeft:scaleSizeW(10)
    },
    text_select:{
        color:'#000'
    }
})

export default CheckBox
