import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, StatusBar,Linking, Dimensions } from 'react-native'
import { SafeAreaView, NavigationActions, StackActions } from 'react-navigation'
import { inject, observer } from 'mobx-react'
import commonStyle from '../../../tools/commonstyles'
import { config, scaleSize, setSpText, scaleSizeW, clearBoxPng, defaultAvatar } from '../../../tools/util'
import CustomizeHeader from '../../components/customizeheader'
import AutoHeightImage from 'react-native-auto-height-image';
import AutoHeightWebView from 'react-native-autoheight-webview-fix'
import * as api from '../../../mocks/api'
import Waiting from '../../commons/waiting'
import CustomAttribute from '../../components/customattribute'

const descimgwidth = Dimensions.get('window').width - 40;

var _this;

@inject('store')
@observer
class ZhaofahuoDetailPage extends Component {
    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            loaded: false,
            Detail: null
        }
    }

    static navigationOptions = () => {
        return {
            headerTitle: null,
            headerLeft: null,
            headerRight: null,
            headerStyle: {
                height: StatusBar.currentHeight,
                shadowOpacity: 0,
                backgroundColor: '#4576f7',
                elevation: 0,
                borderWidth: 0
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
    renderCustomAttributes() {
        var data = [];
        let i = 0;
        for (var key in this.state.Detail.customAttributes) {
            i++;
            let item = this.state.Detail.customAttributes[key];
            if(item.text!="联系方式"){
            data.push(<View key={i} style={styles.item50}>
                <Text style={styles.itemtitle}>{item.text}</Text>
                <Text style={styles.itemtext}>{item.value}</Text>
            </View>)
            }
        }
        return data;
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

   desc(){
       return(  <View style={[styles.formRowItem2, styles.margintop]}>
        <View style={styles.sectiontitle}><Text style={styles.title}>详细介绍</Text></View>
        <View style={{marginBottom:scaleSize(20)}}>
            <Text>{this.state.Detail.description}</Text>
        </View>
        {/* <AutoHeightWebView
            style={{ width: "100%" }}
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
            source={{ html: this.state.Detail.description }}
            scalesPageToFit={true}
            viewportContent={'width=device-width, user-scalable=no'}
        /> */}
    </View>)
   }

    
    render() {
        const { Detail } = this.state;
        if (Detail === null) {
            return <Waiting />
        }
        return (<SafeAreaView style={[commonStyle.safeViewWithCusHead, styles.popbg]}>
            <StatusBar
                animated={true}
                hidden={false}
                backgroundColor={'transparent'}
                translucent={true}
                barStyle={'light-content'}
            />
            <ScrollView>
                <View style={commonStyle.postshow}>
                    <View style={commonStyle.posttop}>
                        {/* <View style={commonStyle.posttype}>
                            <Text style={commonStyle.posttypetxt}>{Detail.customAttributes.PersonCompany.value}</Text>
                        </View> */}
                        {/* {Detail.customAttributes.IsJiMai.value == "是" ?
                            <View style={commonStyle.posttype}>
                                <Text style={commonStyle.posttypetxt}>急卖</Text>
                            </View> : null} */}
                        <View style={{ flex: 1 }}></View>
                        <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} onPress={() => { this.callUser(Detail.customAttributes.ContactPhone.value) }}>
                            <Image style={commonStyle.postphone} source={require('../../../../images/icon-phone.png')} />
                            <Text style={commonStyle.phonetxt}>马上拨打</Text>
                        </TouchableOpacity>
                    </View>
                    <Text numberOfLines={2} style={commonStyle.postdesc}>
                        {Detail.title}
                    </Text>
                </View>

                <View style={[styles.formRowItem2, styles.margintop]}>
                    <View style={styles.sectiontitle}><Text style={styles.title}>机器信息</Text></View>
                    <View style={styles.item}>
                        <View style={[commonStyle.formRowItem_row_left, { flexWrap: 'wrap' }]}>
                            {/* {this.renderCustomAttributes()} */}
                            <CustomAttribute customAttributes={this.state.Detail.customAttributes} />

                        </View>
                    </View>

                </View>
               {Detail.description!=null&&Detail.description!=''? this.desc():null}
                
                <View style={[styles.formRowItem2, styles.margintop, { paddingTop: scaleSizeW(30) }]}>
                    {Detail.pictures.length > 0 ? <View>
                        <View style={styles.sectiontitle}><Text style={styles.title}>实际竞价</Text></View>
                        <View >
                            {Detail.pictures.map((item, index) => {
                                return <AutoHeightImage key={index} style={styles.descimg} width={descimgwidth} source={{ uri: item.thumbnal }} />
                            })}
                        </View>
                    </View> : null}
                    <TouchableOpacity style={[commonStyle.fullWidthButton, styles.btncontact]} onPress={() => { this.callUser(Detail.customAttributes.ContactPhone.value) }}>
                        <Text style={commonStyle.fullWidthButton_text}>联系卖家</Text>
                    </TouchableOpacity>
                </View>



            </ScrollView>
            <CustomizeHeader Title="详情" theme="blue" goBack={() => this.props.navigation.goBack()} />
        </SafeAreaView>)
    }
}

export default ZhaofahuoDetailPage


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
    item: { borderBottomColor: '#eeeeee', borderBottomWidth: scaleSize(1), marginBottom: scaleSize(20) },
    iconaddress: { width: scaleSize(22), height: scaleSize(26) },
    txtaddress: { marginLeft: scaleSize(10), marginRight: scaleSize(40), fontSize: scaleSize(24), color: '#a2a2a4', width: scaleSize(300) },
    txttime: { fontSize: scaleSize(24), color: '#b7b7b7' },
    item50: { flexDirection: 'row', marginBottom: scaleSize(28), width: '50%' },
    itemtitle: { color: '#777777', fontSize: scaleSize(28), marginRight: scaleSize(28),width:scaleSize(120) },
    itemtext: { color: '#161616', fontSize: scaleSize(28) },
    desctext: { color: '#777777', fontSize: scaleSize(28) },
    descimg: { marginBottom: scaleSize(28) },
    btncontact: { marginBottom: scaleSize(28), backgroundColor: '#4576f7' }
})
