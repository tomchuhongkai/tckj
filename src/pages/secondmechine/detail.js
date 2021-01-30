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
import BottomItems from '../components/bottomitems';
import Loading from '../components/loading'

const descimgwidth = Dimensions.get('window').width - 40;
var _this;

@inject('store')
@observer
class SecondMechinePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            Detail: {
                id: 0,
                categoryId: 0,
                categoryName: "",
                title: "",
                subTitle: null,
                source: null,
                shortDesc: null,
                description: null,
                strCreatedOn: "一周前",
                pictures: [],
                customAttributes: null,
                isFavourite: false,
                isZan: false,
                zanCount: 0
            }
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
                backgroundColor: '#4576f7',
                borderBottomWidth: 0, elevation: 0,
                borderBottomColor: 'none'
            }
        }
    }
    componentDidMount = () => {
        _this = this;
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
    changeRowItem = (item) => {
        const { Detail } = this.state;
        const { callBack } = this.props.navigation.state.params;
        var _obj = Object.assign({}, Detail, item);
        this.setState({
            Detail: _obj
        }, () => {
            if(callBack!==undefined)
            callBack(item);
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
        let i = 0;
        for (var key in this.state.Detail.customAttributes) {
            i++;
            let item = this.state.Detail.customAttributes[key];
            if (item.value !== '' && key !== 'ContactPhone')
                data.push(<View key={i} style={styles.item50}>
                    <Text style={styles.itemtitle}>{item.text}</Text>
                    <Text style={styles.itemtext}>{item.value}</Text>
                </View>)
        }
        return data;
    }
    desc() {
        return (<View style={[styles.formRowItem2, styles.margintop]}>
            <View style={styles.sectiontitle}><Text style={styles.title}>详细介绍</Text></View>
            <View style={{ marginBottom: scaleSize(20) }}>
                <Text style={commonStyle.commonText}>{this.state.Detail.description}</Text>
            </View>
        </View>)
    }
    render() {
        const { Detail } = this.state;
        return (<SafeAreaView style={[commonStyle.safeViewWithCusHead, styles.popbg]}>
            <StatusBar
                animated={true}
                hidden={false}
                backgroundColor={'transparent'}
                translucent={true}
                barStyle={'light-content'}
            />
            {this.state.loaded ? <ScrollView>
                <View style={commonStyle.postshow}>
                    <View style={commonStyle.posttop}>
                        {Detail.customAttributes.PersonCompany !== undefined ? <View style={commonStyle.posttype}>
                            <Text style={commonStyle.posttypetxt}>{Detail.customAttributes.PersonCompany.value}</Text>
                        </View> : null}
                        {
                            Detail.customAttributes.IsJiMai !== undefined && Detail.customAttributes.IsJiMai.value == "是" ?
                                <View style={commonStyle.posttype}>
                                    <Text style={commonStyle.posttypetxt}>急卖</Text>
                                </View> : null
                        }

                        <View style={{ flex: 1 }}></View>
                        <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} onPress={() => { this.callUser(Detail.customAttributes.ContactPhone.value) }}>
                            <Image style={commonStyle.postphone} source={require('../../../images/icon-phone.png')} />
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
                <View style={[commonStyle.postshow]}>
                    <BottomItems {...this.props} changeRow={this.changeRowItem} item={Detail} styles={{ borderTopWidth: 0, marginVertical: 0, paddingTop: 0 }} />
                </View>

                {Detail.description != null && Detail.description != '' ? this.desc() : null}

                <View style={[styles.formRowItem2, styles.margintop]}>
                    <View style={styles.sectiontitle}><Text style={styles.title}>实拍</Text></View>
                    {Detail.pictures == undefined || Detail.pictures.length == 0 ? null : <View>
                        {Detail.pictures.map((pic, subIndex) => {
                            return (<TouchableOpacity onPress={() => { this.props.navigation.navigate("MyModal", { list: Detail.pictures, index: subIndex }) }} key={subIndex}>
                                <AutoHeightImage style={styles.descimg} width={descimgwidth} source={{ uri: pic.thumbnal }} />
                            </TouchableOpacity>)
                        })}
                    </View>
                    }
                </View>
                <View style={{height:scaleSize(50)}}></View>
            </ScrollView> : null}
            <Loading show={!this.state.loaded}/>
            <CustomizeHeader Title="详情" theme="blue" goBack={() => { 
                if(this.props.navigation.state.params!==undefined && this.props.navigation.state.params.callBack!==undefined){
                    this.props.navigation.state.params.callBack({viewCount:Detail.viewCount,id:Detail.id});
                }
                this.props.navigation.goBack() }}>
            </CustomizeHeader>
            <TouchableOpacity style={[commonStyle.fullWidthButton, styles.btncontact]} onPress={() => { this.callUser(Detail.customAttributes.ContactPhone.value) }}>
                        <Text style={commonStyle.fullWidthButton_text}>联系卖家</Text>
           </TouchableOpacity>
        </SafeAreaView>)
    }
}

export default SecondMechinePage


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
    itemtitle: { color: '#777777', fontSize: scaleSize(28), marginRight: scaleSize(28), width: scaleSize(140) },
    itemtext: { color: '#161616', fontSize: scaleSize(28) },
    desctext: { color: '#777777', fontSize: scaleSize(28) },
    descimg: { marginBottom: scaleSize(28) },
    btncontact: { marginBottom: scaleSize(28), backgroundColor: '#4576f7',position:'absolute' ,bottom:scaleSize(10),width:'100%'}
})
