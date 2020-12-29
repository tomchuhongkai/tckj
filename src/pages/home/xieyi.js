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
import AutoHeightWebView from 'react-native-autoheight-webview-fix'
import * as api from '../../mocks/api'
import Waiting from '../commons/waiting'
import * as tools from '../../tools/tool'

const descimgwidth = Dimensions.get('window').width - 40;
var _this;

@inject('store')
@observer
class XieYi extends Component {
    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            loaded: false,
          
        }
    }
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <HeaderTitle Title="竞价服务协议" />,
            headerLeft: <BackButton color={"white"} goBack={() => { _this.props.navigation.goBack() }} />,
            headerRight: <RightButton />,
            headerStyle: {
                height: config.headerHeight+StatusBar.currentHeight,
                shadowOpacity: 0,
                backgroundColor: '#4576f7',
                paddingTop:StatusBar.currentHeight

            }
        }
    }
    componentDidMount = () => {
        // this.loadData();
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



    render() {
        // const { profile } = this.props.store.comunity_profile;
       
        // if (!this.state.loaded) {
        //     return (<Waiting />);
        // }

        return (<SafeAreaView style={[commonStyle.safeView]}>
            <StatusBar
                animated={true}
                hidden={false}
                backgroundColor={'transparent'}
                translucent={true}
                barStyle={'light-content'}
            />
            <ScrollView>

                <View style={[styles.formRowItem2, styles.margintop]}>
                    {/* <View style={styles.sectiontitle}><Text style={styles.title}>详细介绍</Text></View> */}
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
                        source={{ uri:`${tools.GetRootUrl()}`+'Home/TopicDetail?systemName=xieyi' }}
                        scalesPageToFit={true}
                        viewportContent={'width=device-width, user-scalable=no'}
                    />
                 
                </View>
           

            </ScrollView>
            {/* <CustomizeHeader Title="设置" goBack={() => this.props.navigation.goBack()} /> */}
        </SafeAreaView>)
    }
}

export default XieYi


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
    itemtitle: { color: '#777777', fontSize: scaleSize(28), marginRight: scaleSize(28) },
    itemtext: { color: '#161616', fontSize: scaleSize(28) },
    desctext: { color: '#777777', fontSize: scaleSize(28) },
    descimg: { marginBottom: scaleSize(28) },
    btncontact: { marginBottom: scaleSize(28), backgroundColor: '#4576f7' }
})
