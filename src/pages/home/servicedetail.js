import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, StatusBar, Dimensions, Linking } from 'react-native'
import { SafeAreaView, NavigationActions, StackActions } from 'react-navigation'
import { inject, observer } from 'mobx-react'
import commonStyle from '../../tools/commonstyles'
import { config, scaleSize, setSpText, scaleSizeW, clearBoxPng, defaultAvatar } from '../../tools/util'
import CustomizeHeader from '../components/customizeheader'
import RightButton from '../components/rightButton'
import BackButton from '../components/backButton'
import HeaderTitle from '../components/headerTitle'
import AutoHeightImage from 'react-native-auto-height-image';
import AutoHeightWebView from 'react-native-autoheight-webview-fix'
import * as api from '../../mocks/api'
import Waiting from '../commons/waiting'
import CustomAttribute from '../components/customattribute'

const descimgwidth = Dimensions.get('window').width - 40;
var _this;

@inject('store')
@observer
class ServiceDetail extends Component {
    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            loaded: false,
            Detail: {
                "id": 0,
                "categoryId": 0,
                "categoryName": "",
                "title": "",
                "subTitle": null,
                "source": null,
                "shortDesc": null,
                "description": null,
                "strCreatedOn": "一周前",
                "pictures": [],
                "customAttributes": null
            },
            toastvisible:false
        }
    }
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: null,
            headerLeft: null,
            headerRight: null,
            headerStyle: {
                height: StatusBar.currentHeight,
                shadowOpacity: 0,
                elevation: 0,
                backgroundColor: '#4576f7',
            }
        }
    }
    componentDidMount = () => {
        this.loadData();
    }
    loadData = () => {
        let that = this;
        let id = this.props.navigation.getParam('id');
        api.GetNewsDetail(id)
            .then(res => {
                that.setState({
                    loaded: true,
                    Detail: res.data
                })

            })
    }

    callUser = (tel) => {
        const url = `tel:${tel}`;
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                return Alert.alert('提示', `您的设备不支持该功能，请手动拨打 ${tel}`, [
                    { text: '确定' }
                ]);
            }
            return Linking.openURL(url);
        }).catch(err => Alert(err));
    }

   

    renderCustomAttributes() {
        var data = [];
        var datatemp = [];
        let i = 0;
        for (var key in this.state.Detail.customAttributes) {
            i++;
            let item = this.state.Detail.customAttributes[key];
            if (item.value !== '' && key!=='ContactPhone' &&key !=='ServiceIntro'&&key!=='Address')
                data.push(<View key={i} style={styles.item50}>
                    <Text style={styles.itemtitle}>{item.text}</Text>
                   <TouchableOpacity onPress={()=>{
                       this.showPopup(item.value)
                       }}><Text style={styles.itemtext}>{item.value ? (item.value.length > 8 ? item.value.substr(0,8) + "..." : item.value) : ""}</Text></TouchableOpacity> 
                </View>)
             if (item.value !== '' && (key=='ServiceIntro'||key=='Address'))
             datatemp.push(<View key={i} style={styles.item100}>
                     <Text style={styles.itemtitle}>{item.text}</Text>
                     <Text style={styles.itemtext} >{item.value}</Text>
                 </View>)
        }
        data=data.concat(datatemp)
        return data;
    }

    render() {
        const { Detail } = this.state;
        if (!this.state.loaded) {
            return (<Waiting />);
        }
        
        return (<SafeAreaView style={[commonStyle.safeViewWithCusHead, styles.popbg]}>
            <ScrollView>
                <View style={commonStyle.postshow}>
                    {/* <View style={commonStyle.posttop}>
                        <View style={{ flex: 1 }}></View>
                        <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} onPress={() => { this.callUser(Detail.customAttributes.ContactPhone.value) }}>
                            <Image style={commonStyle.postphone} source={require('../../../images/icon-phone.png')} />
                            <Text style={commonStyle.phonetxt}>马上拨打</Text>
                        </TouchableOpacity>
                    </View> */}
                    <Text numberOfLines={2} style={commonStyle.postdesc}>
                        {Detail.title}
                    </Text>
                </View>
                <View style={[styles.formRowItem2, styles.margintop]}>
                    <View style={styles.sectiontitle}><Text style={styles.title}>机器信息</Text></View>
                    <View style={styles.item}>
                        <View style={[commonStyle.formRowItem_row_left, { flexWrap: 'wrap' }]}>
                            {/* {this.renderCustomAttributes()} */}
                            <CustomAttribute customAttributes={this.state.Detail.customAttributes}/>

                        </View>
                    </View>

                </View>

                {/* <View style={[styles.formRowItem2, styles.margintop]}>
                    <View style={styles.sectiontitle}><Text style={styles.title}>详细介绍</Text></View>
                    <AutoHeightWebView
                        style={{ width: "100%", }}
                        customScript={`document.body.style.background = 'white';`}
                        customStyle={`
                        * {
                            font-family: 'Times New Roman';
                        }
                        p {
                            font-size: 16px;
                        }
                        `}
                        files={[{
                            href: 'cssfileaddress',
                            type: 'text/css',
                            rel: 'stylesheet'
                        }]}
                        source={{ html: Detail.description }}
                        scalesPageToFit={true}
                        viewportContent={'width=device-width, user-scalable=no'}
                    />
                </View> */}
                <View style={[styles.formRowItem2, styles.margintop,{paddingTop:scaleSizeW(30)}]}>
                    {/* <View style={styles.sectiontitle}><Text style={styles.title}>实拍</Text></View>
                    {Detail.pictures == undefined || Detail.pictures.length == 0 ? null : <View>
                        {Detail.pictures.map((pic, subIndex) => {
                            return (<TouchableOpacity onPress={() => { this.props.navigation.navigate("MyModal", { list: Detail.pictures, index: subIndex }) }} key={subIndex}>
                                <AutoHeightImage style={styles.descimg} width={descimgwidth} source={{ uri: pic.thumbnal }} />
                            </TouchableOpacity>)
                        })}
                    </View>
                    } */}
                    <TouchableOpacity style={[commonStyle.fullWidthButton, styles.btncontact]} onPress={() => { this.callUser(Detail.customAttributes.ContactPhone.value) }}>
                        <Text style={commonStyle.fullWidthButton_text}>联系卖家</Text>
                    </TouchableOpacity>
                </View>
                
            </ScrollView>
            <CustomizeHeader Title="详情" theme='blue' goBack={()=>this.props.navigation.goBack()}/>
        </SafeAreaView>)
    }
}

export default ServiceDetail


const styles = StyleSheet.create({
    popbg: { backgroundColor: '#f4f4f4' },
    avatar: { width: scaleSize(134), height: scaleSize(134), marginRight: scaleSizeW(30) },
    phonetxt: { fontSize: scaleSize(30), color: '#333' },
    sectiontitle: { borderLeftWidth: scaleSize(10), borderLeftColor: '#4576f7', paddingLeft: scaleSize(20), marginVertical: scaleSize(20) },
    title: { fontSize: scaleSize(32), color: '#333' },
    formRowItem2: {
        paddingLeft: scaleSize(30),
        paddingRight: scaleSize(30),
        backgroundColor: '#fff',

    },
    icon: { width: scaleSize(37), height: scaleSize(37), marginRight: scaleSize(10) },
    rightarrow: { width: scaleSize(15), height: scaleSize(26) },
    margintop: { marginTop: scaleSize(20) },
    aligncenter: { alignItems: 'center', justifyContent: 'center' },
    leftimg: { width: scaleSize(184), height: scaleSize(184), borderRadius: 4, marginRight: scaleSize(10) },
    righttext: { height: scaleSize(184), justifyContent: 'space-around', flex: 1 },
    item: { marginBottom: scaleSize(20) },
    iconaddress: { width: scaleSize(22), height: scaleSize(26) },
    txtaddress: { marginLeft: scaleSize(10), marginRight: scaleSize(40), fontSize: scaleSize(24), color: '#a2a2a4', width: scaleSize(300) },
    txttime: { fontSize: scaleSize(24), color: '#b7b7b7' },
    item50: { flexDirection: 'row', marginBottom: scaleSize(28), width: '50%' },
    item100: { flexDirection: 'row', marginBottom: scaleSize(28), width: '100%' },
    itemtitle: { color: '#777777', fontSize: scaleSize(28), marginRight: scaleSize(28), width: scaleSize(140) },
    itemtext: { color: '#161616', fontSize: scaleSize(28)},
    desctext: { color: '#777777', fontSize: scaleSize(28) },
    descimg: { marginBottom: scaleSize(28) },
    btncontact: { marginBottom: scaleSize(28), backgroundColor: '#4576f7' }
})
