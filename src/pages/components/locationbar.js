import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, PermissionsAndroid, Platform, TouchableOpacity } from 'react-native'
import { scaleSizeW } from '../../tools/util'
import Geolocation from '@react-native-community/geolocation';
import { Toast } from '../../tools/tool'
import * as api from '../../mocks/api'
import commonStyle from '../../tools/commonstyles';

class LocationBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Address: "",
            Lat: 0,
            Lng: 0,
            infomation: ''
        }
    }
    componentDidMount = () => {
        this.requestPosition();
    }
    requestPosition = async () => {
        if (Platform.OS == 'ios') {
            this.doGetPosition();
        } else {
            const permissions = [
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ]
            const granteds = await PermissionsAndroid.requestMultiple(permissions);
            if (granteds["android.permission.ACCESS_FINE_LOCATION"] === "granted") {
                this.getPosition();
            } else {
                Toast.info("定位权限被禁止")
            }
        }
    }
    getPosition = (title) => {
        let that = this
        Geolocation.getCurrentPosition(
            (position) => {
                let coords = position.coords;
                that.setState({
                    infomation: title === undefined ? '正在定位中...' : title
                })
                api.GetCurrentLocation(coords.latitude, coords.longitude).then((res) => {
                    if (res.data.formattedAddress !== '[]') {
                        that.setState({
                            infomation: '',
                            Address: res.data.formattedAddress,
                            Lat:coords.latitude,
                            Lng:coords.longitude
                        })
                        if (that.props.textChange !== undefined) {
                            that.props.textChange(res.data.formattedAddress)
                        }
                    }
                }, err => {
                    console.log('err', err)
                    that.setState({
                        infomation: '定位失败'
                    })
                })
            },
            (error) => () => {
                Toast.info(JSON.stringify(error));
            },
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
        );
    }
    setAddr = (v) => {
        this.setState({
            infomation: '',
            Address: v
        })
        this.props.textChange(v);
    }
    render() {

        const { Lat, Lng, Address, infomation } = this.state;
        let that = this;
        if (Address === '' && infomation === '') {
            return null;
        }
        return (<TouchableOpacity onPress={() => {
            if (Address !== '') {
                this.props.navigation.navigate('Location', { lat: Lat, lng: Lng, callback: that.setAddr,title:Address })
            } else {
                that.getPosition('正在重新定位中...');
            }
        }} style={commonStyle.location_row}>
            <Image source={require('../../../images/icon-address.png')} style={{ width: scaleSizeW(22), height: scaleSizeW(26) }} />
            <View style={commonStyle.location_content}>
                <Text numberOfLines={1} style={commonStyle.location_content_text}>{Address === '' ? infomation : Address}</Text>
            </View>
        </TouchableOpacity>)
    }
}

export default LocationBar
