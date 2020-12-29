import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar, TextInput, Alert } from 'react-native'
import { scaleSize, scaleSizeW } from "../../../tools/util";
import { inject, observer } from 'mobx-react'
import Textarea from 'react-native-textarea'
import CustomizeHeader from "../../components/customizeheader";
import PhotoSelector from '../../components/photoselector'
import EntityProperty from '../../commons/entityproperty'
import commonStyle from '../../../tools/commonstyles'
import * as api from '../../../mocks/api'
import * as tools from '../../../tools/tool'
import * as locals from '../../../tools/localdata'
import Waiting from '../../commons/waiting' 
import LocationBar from '../../components/locationbar';
const addIcon = require('../../../../images/addphoto.png')
const loadingIcon = require('../../../../images/loadingnew.gif')
@inject('store')
@observer
class ZhaofahuoFormPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.navigation.getParam("type"),
            show: false,
            visible: false,
            initdata: {},
            data: [],
            curphoto: '',
            title: '',
            address: '',
            description: '',
            images: []
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
            }
        }
    }
    componentDidMount = () => {
        global.CurrentNavigation = {
            Navigation: this.props.navigation,
            GoBack: 'ZhaofahuoForm',
            Params: this.props.navigation.state.params
        };
        this.loadInfo();
    }
    componentWillUnmount = () => {
        global.CurrentNavigation = null;
    }
    loadInfo = () => {
        var that = this;
        locals.PrepareFormType(this.state.type)
            .then(data => {
                let _dataList = [];
                for (var key in data) {
                    if (data[key].value !== '') {
                        _dataList.push({ Key: key, Value: data[key].value })
                    }
                }
                that.setState({ initdata: data, data: _dataList, show: true });
            }, tools.RejectHandler)
    }
    onChange = (key, value) => {
        var newdata = this.state.data.slice();
        var items = newdata.filter(x => x.Key === key);
        var _itemInfo = this.state.initdata[key];
        if (_itemInfo !== undefined) {
            if (items.length > 0) {
                if (_itemInfo.propertyType !== 40) {
                    // 非多选
                    items[0].Value = value;
                } else {
                    //多选（40）
                    let _list = items[0].Value.split(",");
                    let _index = _list.findIndex(x => x === value);
                    if (_index === -1) {
                        _list.push(value);
                    } else {
                        _list.splice(_index, 1);
                    }
                    items[0].Value = _list.join(',');
                }
            } else {
                newdata.push({ Key: key, Value: value });
            }
            this.setState({ data: newdata })
        }
    }
    Save = () => {
        let that = this;
        var newdata = this.state.data.slice();
        let _type = this.props.navigation.getParam("type")
        let { images } = this.state;
        newdata.push({ "Key": "Id", "Value": 0 });
        newdata.push({ "Key": "ActionType", "Value": _type });
        newdata.push({ "Key": "Title", "Value": this.state.title });
        newdata.push({ "Key": "Description", "Value": this.state.description });
        newdata.push({ "Key": "Address", "Value": this.state.address });

        let picIds = [];
        if (images.length > 0) {
            images.forEach(item => {
                picIds.push(item.picId)
            })
        }
        newdata.push({ "Key": "PictureIds", "Value": JSON.stringify(picIds) })
        const { userInfo } = this.props.store.config;
        newdata.push({ "Key": "City", "Value": userInfo.location })
        var postData = {};
        newdata.forEach(item => {
            postData[item.Key] = item.Value;
        })
        api.PostPingGu(postData)
            .then(res => {
                if (res.data.result === 1) {
                    this.setState({ data: [] })
                    tools.Toast.info('提交成功', 0.5, () => {
                        if (that.props.navigation.state.params.callBack !== undefined) {
                            that.props.navigation.state.params.callBack();
                            that.props.navigation.goBack();
                        }
                    });
                } else {
                    tools.Toast.fail(res.data.message);
                }
            })
    }
    deleteImage = (item) => {
        let that = this;
        Alert.alert('提示', "你确定要删除此图片吗？", [{
            text: '确定',
            onPress: () => {
                var images = that.state.images.slice();
                var index = images.findIndex(x => x.picId === item.picId);
                images.splice(index, 1);
                that.setState({
                    images: images
                })
            }
        }, {
            text: '取消',
            onPress: () => {

            }
        }])
    }
    renderVideoAndImages = () => {
        const { loading } = this.props.store.config;
        return (<View style={styles.imagelist}>
            {this.state.images.map((item, index) => {
                return (<View key={index} style={styles.imagelist_item}>
                    <TouchableOpacity onLongPress={() => this.deleteImage(item)}>
                        <Image source={{ uri: item.uri }} style={[styles.imageinfo, { borderRadius: scaleSize(10) }]} />
                    </TouchableOpacity>
                </View>)
            })}
            {/* <View style={[styles.imagelist_item, styles.imagelist_item_add]}> */}
            {this.state.images.length < 9 ? <View style={styles.imagelist_item}>
                <TouchableOpacity onPress={() => {
                    this.setState({ visible: true })
                }}>
                    {loading.length > 0 ? <View style={commonStyle.imgLoading}><Image source={loadingIcon} resizeMode="cover" style={commonStyle.imgLoading_img} /></View> : <Image source={addIcon} resizeMode="contain" style={styles.imageinfo} />}
                </TouchableOpacity>
            </View> : null}
        </View>)
    }


    uploadCompleted = (data) => {
        let images = this.state.images.slice();
        if (data.length === undefined) {
            images.push({ uri: data.pictureUrl, picId: data.pictureId });
        } else {
            data.map(item => {
                images.push({ uri: item.pictureUrl, picId: item.pictureId });
            })
        }
        this.setState({
            images: images
        })
    }
    renderInfo = () => {
        var postinfo = Object.assign({}, this.state.initdata)
        var infolist = [];
        for (var key in postinfo) {
            infolist.push({ key: key, value: postinfo[key] });
        }
        return <EntityProperty data={infolist} list={this.state.data} onChange={this.onChange} />
    }
    render() {
        if (!this.state.show) {
            return (<Waiting />);
        }
        return (<View style={[commonStyle.safeViewWithCusHead, { backgroundColor: '#fff' }]}>
            <CustomizeHeader showBack={true} Title={this.state.type === 'FindProducts' ? '找货' : '发货'} goBack={() => {
                this.props.navigation.goBack()
            }}>
            </CustomizeHeader>
            <ScrollView style={{ width: '100%', height: '100%' }} keyboardShouldPersistTaps={'always'} contentContainerStyle={commonStyle.scrollViewContainer}>
                <View style={styles.pinggucontainer}>

                    <View style={styles.selectline}>
                        <Text style={styles.selname}>标题 <Text style={styles.required}>*</Text></Text>
                        <TextInput style={styles.inputxt} value={this.state.title} onChangeText={(v) => { this.setState({ title: v }) }} placeholderTextColor="#9b9b9b" placeholder="请输入标题"></TextInput>
                    </View></View>
                {this.renderInfo()}
                <View>
                    <View style={styles.pinggucontainer}>
                        <View style={[styles.selectline, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                            <Text style={styles.selname}>详细描述</Text>
                        </View>
                        <Textarea
                            containerStyle={styles.textareaContainer}
                            style={styles.textarea}
                            onChangeText={(v) => { this.setState({ description: v }) }}
                            defaultValue={''}
                            maxLength={120}
                            placeholder={'请填写你的服务介绍，以便我们能更好的帮助你找到合适的人员'}
                            placeholderTextColor={'#c7c7c7'}
                            underlineColorAndroid={'transparent'}
                        />
                    </View>
                </View>
                <View style={styles.pinggucontainer}>
                    <View style={[styles.selectline, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                        <Text style={styles.selname}>照片</Text>
                    </View>
                    <View style={{ marginTop: scaleSize(16) }}><Text style={styles.infotxt}>*可通过长按上传图片进行删除</Text></View>
                    <View style={styles.selectline}>
                        {this.renderVideoAndImages()}
                        <PhotoSelector visible={this.state.visible} onClose={() => {
                            this.setState({ visible: false })
                        }} callBack={this.uploadCompleted} />
                    </View>
                </View>
                <LocationBar {...this.props} textChange={(v) => { this.setState({ address: v }) }} />
                <View style={styles.greybg}>
                    <View style={styles.dialog_title}>
                        <TouchableOpacity onPress={() => this.Save()} style={styles.dialog_closeBtn} >
                            <Text style={{ color: '#fff', fontSize: scaleSize(30), alignSelf: 'center' }}>提交信息</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </ScrollView>
        </View>)
    }
}
const styles = StyleSheet.create({
    orangebg: {
        backgroundColor: '#ec5947',
        height: scaleSize(130)
    },
    pinggucontainer: {
        borderRadius: scaleSize(20),
        marginLeft: scaleSize(30),
        marginRight: scaleSize(30),
        backgroundColor: '#fff'
    },
    selectline: {
        borderBottomWidth: scaleSize(1),
        borderBottomColor: '#eeeeee',
        justifyContent: "flex-start",
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingBottom: scaleSize(30),
        paddingTop: scaleSize(30)
    },
    selectlines: {
        borderBottomWidth: scaleSize(1),
        borderBottomColor: '#eeeeee',
        justifyContent: "space-between",
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingBottom: scaleSize(30),
        paddingTop: scaleSize(30)
    },
    selname: {
        color: '#252121',
        fontSize: scaleSize(30),
        width: scaleSizeW(205)
    },
    inputxt: {
        textAlign: 'right',
        flex: 1,
        height: scaleSizeW(36),
        fontSize: scaleSize(30),
        color: '#9b9b9b',
        paddingVertical: 0,
        paddingRight: scaleSize(50),
        lineHeight: scaleSizeW(30)
    },
    selicon: { width: scaleSizeW(14), height: scaleSizeW(24), marginLeft: scaleSizeW(10), marginLeft: scaleSize(40) },
    greybg: {
        backgroundColor: '#f7f6f9'
    },
    comment: {
        paddingTop: scaleSize(30),
        paddingBottom: scaleSize(30),
        paddingLeft: scaleSize(30),
        paddingRight: scaleSize(30),
        backgroundColor: '#fff',
        marginTop: scaleSize(30),
    },
    dialog_title: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: scaleSize(30),
        marginBottom: scaleSizeW(50)
    },
    dialog_closeBtn: {
        width: '90%',
        backgroundColor: '#4576f7',
        borderWidth: scaleSizeW(1),
        borderColor: '#4576f7',
        borderRadius: scaleSizeW(30),
        height: scaleSizeW(80),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textareaContainer: {
        height: scaleSizeW(240),
        padding: 5,
        marginTop: scaleSize(20),
        backgroundColor: '#F5FCFF',
    },
    addresstxt: {
        height: scaleSizeW(120),
        width: scaleSizeW(480)
    },
    textarea: {
        textAlignVertical: 'top',  // hack android
        height: scaleSizeW(170),
        fontSize: 14,
        color: '#333',
    },
    addtextarea: {
        textAlignVertical: 'top',  // hack android
        height: scaleSizeW(110),
        fontSize: scaleSizeW(30), fontWeight: 'bold', color: '#26292a'
    },
    servicefee: {
        marginTop: scaleSizeW(30), fontSize: scaleSizeW(30), fontWeight: 'bold', color: '#26292a'

    },
    imageinfo: {
        width: scaleSize(210),
        height: scaleSize(210),
    },
    radiocontainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    imagelist: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    imagelist_item: {
        marginRight: scaleSizeW(10),
        marginTop: scaleSizeW(30),
    },
    required: {
        color: 'red',
    },
    imageinfo: {
        width: scaleSizeW(210), height: scaleSizeW(210),
    },
    infotxt: {
        color: '#ea5946',
        fontSize: scaleSize(24)
    }
})

export default ZhaofahuoFormPage