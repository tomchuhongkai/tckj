import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, StatusBar, Dimensions, Linking } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { inject, observer } from 'mobx-react'
import commonStyle from '../../tools/commonstyles'
import { scaleSize, scaleSizeW } from '../../tools/util'
import CustomizeHeader from '../components/customizeheader'
import AutoHeightWebView from 'react-native-autoheight-webview-fix'
import * as api from '../../mocks/api'
import Loading from '../components/loading'

const descimgwidth = Dimensions.get('window').width - 40;
var _this;

@inject('store')
@observer
class AdvDetail extends Component {
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
                borderBottomWidth: 0,
                borderBottomColor: 'none'
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
        let i = 0;
        for (var key in this.state.Detail.customAttributes) {
            i++;
            let item = this.state.Detail.customAttributes[key];
            data.push(<View key={i} style={styles.item50}>
                <Text style={styles.itemtitle}>{item.text}</Text>
                <Text style={styles.itemtext}>{item.value}</Text>
            </View>)
        }
        return data;
    }

    render() {
        // const { profile } = this.props.store.comunity_profile;
        const { Detail } = this.state;

        return (<SafeAreaView style={[commonStyle.safeViewWithCusHead, styles.popbg]}>
            <CustomizeHeader Title={Detail.title} goBack={() => {
                this.props.navigation.goBack()
            }} />
            {this.state.loaded ? <ScrollView>
                <View style={[styles.formRowItem2, { marginTop: scaleSizeW(20), paddingVertical: scaleSize(40) }]}>
                    {
                        Detail.strCreatedOn !== undefined && Detail.strCreatedOn !== null ? <View style={{ paddingBottom: scaleSize(16), borderBottomColor: '#eee', borderBottomWidth: scaleSize(1), marginBottom: scaleSize(26) }}><Text style={styles.date}>发布于：{Detail.strCreatedOn}</Text></View> : null
                    }
                    {/* <View style={styles.sectiontitle}><Text style={styles.title}>详细介绍</Text></View> */}
                    <AutoHeightWebView
                        style={{ width: "100%", }}
                        customScript={`document.body.style.background = 'white';`}
                        customStyle={`
                        * {
                            font-family: 'Times New Roman';
                        }
                        p {
                            font-size: 15px;
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
                </View>
            </ScrollView> : null}
            <Loading show={!this.state.loaded} />
        </SafeAreaView>)
    }
}

export default AdvDetail


const styles = StyleSheet.create({
    popbg: { backgroundColor: '#f4f4f4' },
    avatar: { width: scaleSize(134), height: scaleSize(134), marginRight: scaleSizeW(30) },
    phonetxt: { fontSize: scaleSize(30), color: '#333' },
    sectiontitle: { borderLeftWidth: scaleSize(10), borderLeftColor: '#4576f7', paddingLeft: scaleSize(20), marginVertical: scaleSize(20) },
    title: { fontSize: scaleSize(32), color: '#333' },
    date: { fontSize: scaleSize(24), color: '#666', textAlign: "center" },
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
    itemtitle: { color: '#777777', fontSize: scaleSize(28), marginRight: scaleSize(28) },
    itemtext: { color: '#161616', fontSize: scaleSize(28) },
    desctext: { color: '#777777', fontSize: scaleSize(28) },
    descimg: { marginBottom: scaleSize(28) },
    btncontact: { marginBottom: scaleSize(28), backgroundColor: '#4576f7' }
})
