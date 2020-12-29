import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { observer, inject } from 'mobx-react'
import { config, scaleSize, setSpText, scaleSizeW } from '../../tools/util'
import commonStyle from '../../tools/commonstyles'
import {WToast} from 'react-native-smart-tip'

 
@inject('store')
@observer
class CustomAttribute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toastvisible: false
        }
    }

    showPopup = (text) => {
        const toastOpts = {
            data: text,
            textColor: '#ffffff',
            backgroundColor: '#444444',
            duration: WToast.duration.SHORT, //1.SHORT 2.LONG
            position: WToast.position.CENTER, // 1.TOP 2.CENTER 3.BOTTOM
            // icon: <Image source={require('../data/img/success.png')} style={{width: 32,height: 32,resizeMode: 'contain'}}/>
        }
        WToast.show(toastOpts)
    }
    render() {
        var data = [];
        var datatemp = [];
        var location=[];
        let i = 0;
        var filter = this.props.filter;
        for (var key in this.props.customAttributes) {
            i++;
            let item = this.props.customAttributes[key];
            // key!=='ContactPhone' &&key !=='ServiceIntro'&&key!=='Address'
            if (item.value !== '' && key !== 'ContactPhone' && key !== 'ServiceIntro' && key !== 'Address' && key !== 'companyaddress' && key !== 'Description')
                data.push(<View key={i} style={styles.item50}>
                    <Text style={styles.itemtitle}>{item.text}</Text>
                    <TouchableOpacity onPress={() => {
                        this.showPopup(item.value)
                    }}><Text style={styles.itemtext}>{item.value ? (item.value.length > 11 ? item.value.substr(0, 8) + "..." : item.value) : ""}</Text></TouchableOpacity>
                </View>)
            if (item.value !== '' && (key == 'ServiceIntro' || key == 'companyaddress'))
                datatemp.push(<View key={i} style={styles.item100}>
                    <Text style={styles.itemtitle}>{item.text}</Text>
                    <Text style={[styles.itemtext, { flex: 1 }]} >{item.value}</Text>
                </View>)
            if (item.value !== '' && key == 'Address') {
                location.push(
                    <View key={i} style={[commonStyle.location_row,{width:'100%',paddingLeft:0,paddingRight:0}]}>
                        <Image source={require('../../../images/icon-address.png')} style={{ width: scaleSizeW(22), height: scaleSizeW(26) }} />
                        <View style={commonStyle.location_content}>
                            <Text style={commonStyle.location_content_text}>{item.value}</Text>
                        </View>
                    </View>
                )
            }
        }
        data = data.concat(datatemp);
        data = data.concat(location);
        return (data);

    }
}

export default CustomAttribute;


const styles = StyleSheet.create({
    itemtitle: { color: '#777777', fontSize: scaleSize(28), marginRight: scaleSize(20), width: scaleSize(148) },
    itemtext: { color: '#161616', fontSize: scaleSize(28) },
    item50: { flexDirection: 'row', marginBottom: scaleSize(28), width: '50%' },
    item100: { flexDirection: 'row', marginBottom: scaleSize(28) },


})