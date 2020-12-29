import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, StatusBar } from 'react-native'
import { SafeAreaView, NavigationActions, StackActions } from 'react-navigation'
import { inject, observer } from 'mobx-react'
import commonStyle from '../../tools/commonstyles'
import { config, scaleSize, setSpText, scaleSizeW, clearBoxPng, defaultAvatar } from '../../tools/util'
import CustomizeHeader from '../components/customizeheader'
import * as api from '../../mocks/api'
import Loading from '../components/loading'
import NoRecords from '../components/norecords'

const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'AuthLogin' }),  //Login 要跳转的路由
    ]
})

@inject('store')
@observer
class PublishPage extends Component {
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
    constructor(props) {
        super(props);
        let that = this;
        this.state = {
            Categories: [],
            Data: [],
            show: false
        }

    }
    componentDidMount = () => {
        this.loadData();
    }
    loadData = () => {
        let that = this;
        api.GetTopNPost()
            .then(res => {
                that.setState({
                    Categories: res.data.categories,
                    Data: res.data.data,
                    show: true
                })
            }, (res) => {
                console.log(res)
                that.setState({
                    show: true
                })
            })
    }
    renderCategories = () => {
        return this.state.Categories.map((item, index) => {
            let list = this.state.Data.filter(c => c.categoryId === item.id);
            if (list.length === 0) {
                return null;
            }
            return (<View key={index} style={[styles.formRowItem2, styles.margintop]}>
                <View style={styles.sectiontitle}>
                    <Text style={styles.title}>{item.name}</Text>
                </View>
                {this.renderPost(list, item)}
            </View>)
        });
    }
    renderPost = (list, category) => {
        return list.map((item, index) => {
            let attributes = item.customAttributes;
            let info = null;
            switch (category.systemName) {
                case 'FindProducts'://找货
                    info = (
                        <TouchableOpacity key={index} onPress={() => { this.props.navigation.push('PublishDetail', { id: item.id, callBack: this.loadData }) }} key={index} style={styles.item}>
                            <View style={commonStyle.formRowItem_row_left}>
                                {item.pictures != null && item.pictures.length > 0 ? <Image style={styles.leftimg} source={{ uri: item.pictures[0].thumbnal }} /> : <Image style={styles.leftimg} source={require('../../../images/no-image.png')} />}
                                {/* <Image style={styles.leftimg} source={require('../../../images/sample-fabu.png')} /> */}
                                <View style={styles.righttext}>
                                    <View style={commonStyle.tag_wrap_list}>
                                        {/* <View style={commonStyle.tag_wrap_red}><Text style={commonStyle.tag_red_txt}>{attributes.ContactPerson.value}</Text></View> */}
                                        <View style={commonStyle.tag_wrap_red}><Text style={commonStyle.tag_red_txt}>{attributes.City.value}</Text></View>
                                    </View>
                                    <Text numberOfLines={2} style={{ fontSize: scaleSize(30), color: '#333' }}>{item.title}</Text>
                                    <View style={commonStyle.formRowItem_row_left}>
                                        <Image style={styles.iconaddress} source={require('../../../images/icon-address.png')} />
                                        <Text numberOfLines={1} style={styles.txtaddress}>{attributes.CompanyName.value}</Text>
                                        <Text style={styles.txttime}>{item.strCreatedOn}</Text>
                                    </View>
                                </View>
                            </View>
                            {/* <View style={[commonStyle.formRowItem_row_right, { marginVertical: scaleSize(30) }]}>
                            <View style={[commonStyle.tag_wrap_red, commonStyle.tag_wrap]}><Text style={commonStyle.tag_red_txt}>待审核</Text></View>
                            <View style={[commonStyle.tag_failed, commonStyle.tag_wrap]}><Text style={commonStyle.tag_white_txt}>未完成</Text></View>
                        </View> */}
                        </TouchableOpacity>
                    )
                    break;
                case 'SendProducts'://发货
                    info = (
                        <TouchableOpacity key={index} onPress={() => { this.props.navigation.push('PublishDetail', { id: item.id }) }} key={index} style={styles.item}>
                            <View style={commonStyle.formRowItem_row_left}>
                                {item.pictures != null && item.pictures.length > 0 ? <Image style={styles.leftimg} source={{ uri: item.pictures[0].thumbnal }} /> : <Image style={styles.leftimg} source={require('../../../images/no-image.png')} />}
                                {/* <Image style={styles.leftimg} source={require('../../../images/sample-fabu.png')} /> */}
                                <View style={styles.righttext}>
                                    <View style={commonStyle.tag_wrap_list}>
                                        {/* <View style={commonStyle.tag_wrap_red}><Text style={commonStyle.tag_red_txt}>{attributes.ContactPerson.value}</Text></View> */}
                                        <View style={commonStyle.tag_wrap_red}><Text style={commonStyle.tag_red_txt}>{attributes.City.value}</Text></View>
                                    </View>
                                    <Text numberOfLines={2} style={{ fontSize: scaleSize(30), color: '#333' }}>{item.title}</Text>
                                    <View style={commonStyle.formRowItem_row_left}>
                                        <Image style={styles.iconaddress} source={require('../../../images/icon-address.png')} />
                                        <Text numberOfLines={1} style={styles.txtaddress}>{attributes.Company.value}</Text>
                                        <Text style={styles.txttime}>{item.strCreatedOn}</Text>
                                    </View>
                                </View>
                            </View>
                            {/* <View style={[commonStyle.formRowItem_row_right, { marginVertical: scaleSize(30) }]}>
                            <View style={[commonStyle.tag_wrap_red, commonStyle.tag_wrap]}><Text style={commonStyle.tag_red_txt}>待审核</Text></View>
                            <View style={[commonStyle.tag_failed, commonStyle.tag_wrap]}><Text style={commonStyle.tag_white_txt}>未完成</Text></View>
                        </View> */}
                        </TouchableOpacity>
                    )
                    break;
                case 'NewMachine'://新机器
                    info = (
                        <TouchableOpacity key={index} onPress={() => { this.props.navigation.push('PublishDetail', { id: item.id }) }} key={index} style={styles.item}>
                            <View style={commonStyle.formRowItem_row_left}>
                                {item.pictures != null && item.pictures.length > 0 ? <Image style={styles.leftimg} source={{ uri: item.pictures[0].thumbnal }} /> : <Image style={styles.leftimg} source={require('../../../images/no-image.png')} />}
                                <View style={styles.righttext}>

                                    <Text numberOfLines={2} style={{ fontSize: scaleSize(30), color: '#333' }}>{item.title}</Text>
                                    <View style={commonStyle.formRowItem_row_left}>
                                        <Image style={styles.iconaddress} source={require('../../../images/icon-address.png')} />
                                        <Text numberOfLines={1} style={styles.txtaddress}>{attributes.ContactPerson.value}</Text>
                                        <Text style={styles.txttime}>{item.strCreatedOn}</Text>
                                    </View>
                                </View>
                            </View>
                            {/* <View style={[commonStyle.formRowItem_row_right, { marginVertical: scaleSize(30) }]}>
                        <View style={[commonStyle.tag_wrap_red, commonStyle.tag_wrap]}><Text style={commonStyle.tag_red_txt}>待审核</Text></View>
                        <View style={[commonStyle.tag_failed, commonStyle.tag_wrap]}><Text style={commonStyle.tag_white_txt}>未完成</Text></View>
                    </View> */}
                        </TouchableOpacity>
                    )
                    break;
                case 'OldMachine'://二手机
                    info = (
                        <TouchableOpacity key={index} onPress={() => { this.props.navigation.push('PublishDetail', { id: item.id }) }} key={index} style={styles.item}>
                            <View style={commonStyle.formRowItem_row_left}>
                                {item.pictures != null && item.pictures.length > 0 ? <Image style={styles.leftimg} source={{ uri: item.pictures[0].thumbnal }} /> : <Image style={styles.leftimg} source={require('../../../images/no-image.png')} />}
                                <View style={styles.righttext}>
                                    <View style={commonStyle.tag_wrap_list}>
                                        <View style={commonStyle.tag_wrap_red}><Text style={commonStyle.tag_red_txt}>{attributes.PersonCompany === undefined ? '' : attributes.PersonCompany.value}</Text></View>
                                        {attributes.IsJiMai === undefined ? null : attributes.IsJiMai.value === '是' ? <View style={commonStyle.tag_wrap_red}><Text style={commonStyle.tag_red_txt}>急卖</Text></View> : null}
                                    </View>
                                    <Text numberOfLines={2} style={{ fontSize: scaleSize(30), color: '#333' }}>{item.title}</Text>
                                    <View style={commonStyle.formRowItem_row_left}>
                                        <Image style={styles.iconaddress} source={require('../../../images/icon-address.png')} />
                                        <Text numberOfLines={1} style={styles.txtaddress}>{attributes.ContactPerson.value}</Text>
                                        <Text style={styles.txttime}>{item.strCreatedOn}</Text>
                                    </View>
                                </View>
                            </View>
                            {/* <View style={[commonStyle.formRowItem_row_right, { marginVertical: scaleSize(30) }]}>
                            <View style={[commonStyle.tag_wrap_red, commonStyle.tag_wrap]}><Text style={commonStyle.tag_red_txt}>待审核</Text></View>
                            <View style={[commonStyle.tag_failed, commonStyle.tag_wrap]}><Text style={commonStyle.tag_white_txt}>未完成</Text></View>
                        </View> */}
                        </TouchableOpacity>
                    )
                    break;
                case 'MachineRate'://机器评估
                    info = (
                        <TouchableOpacity key={index} onPress={() => { this.props.navigation.push('PublishDetail', { id: item.id }) }} key={index} style={styles.item}>
                            <View style={commonStyle.formRowItem_row_left}>
                                {item.pictures != null && item.pictures.length > 0 ? <Image style={styles.leftimg} source={{ uri: item.pictures[0].thumbnal }} /> : <Image style={styles.leftimg} source={require('../../../images/no-image.png')} />}
                                <View style={styles.righttext}>
                                    <View style={commonStyle.tag_wrap_list}>
                                        <View style={commonStyle.tag_wrap_red}><Text style={commonStyle.tag_red_txt}>{attributes.City.value}</Text></View>
                                    </View>
                                    <Text numberOfLines={2} style={{ fontSize: scaleSize(30), color: '#333' }}>{item.title}</Text>
                                    <View style={commonStyle.formRowItem_row_left}>
                                        <Image style={styles.iconaddress} source={require('../../../images/icon-address.png')} />
                                        <Text numberOfLines={1} style={styles.txtaddress}>{attributes.ContactPerson.value}</Text>
                                        <Text style={styles.txttime}>{item.strCreatedOn}</Text>
                                    </View>
                                </View>
                            </View>
                            {/* <View style={[commonStyle.formRowItem_row_right, { marginVertical: scaleSize(30) }]}>
                            <View style={[commonStyle.tag_wrap_red, commonStyle.tag_wrap]}><Text style={commonStyle.tag_red_txt}>待审核</Text></View>
                            <View style={[commonStyle.tag_failed, commonStyle.tag_wrap]}><Text style={commonStyle.tag_white_txt}>未完成</Text></View>
                        </View> */}
                        </TouchableOpacity>
                    )
                    break;
                default:
                    break;
            }
            return info;
        });
    }
    render() {
        return (<SafeAreaView style={[commonStyle.safeViewWithCusHead, styles.popbg]}>
            {this.state.show ? <ScrollView
                style={{ height: '100%' }}
                contentContainerStyle={{ minHeight: '100%' }}
            >
                {this.state.Categories.length === 0 && this.state.Data.length === 0 ? <NoRecords /> : null}
                {this.renderCategories()}
            </ScrollView> : null}
            <Loading show={!this.state.show} />
            <CustomizeHeader goBack={() => this.props.navigation.goBack()} Title="我的发布" theme='blue' />
        </SafeAreaView>)
    }
}

export default PublishPage


const styles = StyleSheet.create({
    popbg: { backgroundColor: '#f4f4f4' },
    avatar: { width: scaleSize(134), height: scaleSize(134), marginRight: scaleSizeW(30) },
    phonetxt: { fontSize: scaleSize(30), color: '#333' },
    sectiontitle: { borderLeftWidth: scaleSize(10), borderLeftColor: '#ec5947', paddingLeft: scaleSize(20), marginVertical: scaleSize(20) },
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
    item: { borderBottomColor: '#eeeeee', borderBottomWidth: scaleSize(1), marginBottom: scaleSize(20), paddingBottom: scaleSize(20) },
    iconaddress: { width: scaleSize(22), height: scaleSize(26) },
    txtaddress: { marginLeft: scaleSize(10), marginRight: scaleSize(40), fontSize: scaleSize(24), color: '#a2a2a4', width: scaleSize(300) },
    txttime: { fontSize: scaleSize(24), color: '#b7b7b7' }
})
