import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, StatusBar } from 'react-native'
import { scaleSize, scaleSizeH, Enums, scaleSizeW, config } from "../../tools/util";
import RightButton from '../components/rightButton'
import BackButton from '../components/backButton'
import HeaderTitle from '../components/headerTitle'
import Waiting from "../commons/waiting";
import Loading from "../components/loading";
import EntityProperty from '../commons/entityproperty'
import CustomPicker from '../components/custompicker'
import commonStyle from '../../tools/commonstyles'
import * as api from '../../mocks/api'
import * as locals from '../../tools/localdata'
import Textarea from 'react-native-textarea';
import PhotoSelector from '../components/photoselector'
import { inject, observer } from 'mobx-react'; 
import LocationBar from '../components/locationbar';
import * as tools from '../../tools/tool'
const addIcon = require('../../../images/addphoto.png')
const loadingIcon = require('../../../images/loadingnew.gif')

@inject('store')
@observer
class Pinggu extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <HeaderTitle Title="免费评估" />,
            headerLeft: <BackButton goBack={navigation.goBack} color='white' />,
            headerRight: <RightButton />,
            headerStyle: {
                height: config.headerHeight + StatusBar.currentHeight,
                shadowOpacity: 0,
                backgroundColor: '#ec5947',
                borderBottomWidth: 0,
                elevation: 0
            }
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            agree: true,
            data: [],
            visible: false,
            initdata: {},
            curphoto: '',
            title: '',
            address:'',
            images: [],
            show: false
        }
    }
    componentDidMount = () => {
        global.CurrentNavigation = {
            Navigation: this.props.navigation,
            GoBack: 'Pinggu',
            Params: this.props.navigation.state.params
        };
        this.loadInfo();
    }
    componentWillUnmount = () => {
        global.CurrentNavigation = null;
    }

    loadInfo = () => {
        let that = this;
        locals.PrepareFormType("MachineRate")
            .then(data => {

                let _dataList = [];
                for (var key in data) {
                    if (data[key].value !== '') {
                        _dataList.push({ Key: key, Value: data[key].value })
                    }
                }
                that.setState({ initdata: data, data: _dataList, show: true });

            })
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
        let { images } = this.state;
        newdata.push({ "Key": "Id", "Value": 0 });
        newdata.push({ "Key": "ActionType", "Value": "MachineRate" });
        newdata.push({ "Key": "Title", "Value": this.state.title });
        const { userInfo } = this.props.store.config;
        newdata.push({ "Key": "City", "Value": userInfo.location });
        newdata.push({ "Key": "Address", "Value": this.state.address });
        let picIds = [];
        if (images.length > 0) {
            images.forEach(item => {
                picIds.push(item.picId)
            })
        }
        newdata.push({ "Key": "PictureIds", "Value": JSON.stringify(picIds) })
        var postData = {};
        newdata.forEach(item => {
            postData[item.Key] = item.Value;
        })
        api.PostPingGu(postData)
            .then(res => {
                if (res.data.result === 1) {
                    this.setState({ data: [] })
                    tools.Toast.info('提交成功', 0.5, () => {
                        that.props.navigation.goBack();
                    });

                } else {
                    tools.Toast.fail(res.data.message);
                }
            })
    }

    renderInfo = () => {
        var postinfo = Object.assign({}, this.state.initdata)
        var infolist = [];
        for (var key in postinfo) {
            infolist.push({ key: key, value: postinfo[key] });
        }
        return <EntityProperty style={styles.itemContainer} data={infolist} list={this.state.data} onChange={this.onChange} />
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
            {this.state.images.length < 3 ? <View style={styles.imagelist_item}>
                <TouchableOpacity onPress={() => {
                    this.setState({ visible: true })
                }}>
                    {loading.length > 0 ? <View style={commonStyle.imgLoading}><Image source={loadingIcon} resizeMode="cover" style={commonStyle.imgLoading_img} /></View> : <Image source={addIcon} resizeMode="contain" style={styles.imageinfo} />}
                </TouchableOpacity>
            </View> : null}
        </View>)
    }
    render() {
        return (<View style={[commonStyle.safeView, { backgroundColor: '#fff' }]}>
            <StatusBar
                animated={true}
                hidden={false}
                backgroundColor={'transparent'}
                translucent={true}
                barStyle={'light-content'}
            />
            {this.state.show ? <ScrollView style={{ width: '100%', height: '100%', borderTopColor: '#ec5947', borderTopWidth: scaleSizeW(1), marginTop: scaleSizeW(-1) }} keyboardShouldPersistTaps={'always'}>
                <View style={styles.orangebg}></View>
                <View style={styles.pinggucontainer}>
                    <View style={styles.selectline}>
                        <Text style={styles.selname}>标题 <Text style={styles.required}>*</Text></Text>
                        <TextInput style={styles.inputxt} returnKeyType='done' value={this.state.title} onChangeText={(v) => { this.setState({ title: v }) }} placeholderTextColor="#9b9b9b" placeholder="请输入标题"></TextInput>
                    </View>
                </View>
                <View style={styles.greybg}>
                    {this.renderInfo()}
                </View>
                <LocationBar {...this.props} textChange={(v)=>{this.setState({address:v})}}/>
                <View style={styles.pinggucontainer}>
                    <View style={[styles.selectline, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                        <Text style={styles.selname}>照片</Text>
                    </View>
                    <View style={styles.selectline}>
                        {this.renderVideoAndImages()}
                        <PhotoSelector visible={this.state.visible} onClose={() => {
                            this.setState({ visible: false })
                        }} callBack={this.uploadCompleted} />
                    </View>
                </View>
                <View style={styles.greybg}>
                    <View style={styles.dialog_title}>
                        <TouchableOpacity onPress={() => this.Save()} style={styles.dialog_closeBtn} >
                            <Text style={{ color: '#fff', fontSize: scaleSize(30), alignSelf: 'center' }}>立即评估</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.footeragree}>
                        <Image source={require('../../../images/icon-checked.png')} style={styles.checkicon} />
                        <Text style={styles.greytxt}>我已阅读并同意</Text><TouchableOpacity><Text style={styles.linktxt}>《隐私条款》</Text></TouchableOpacity>
                    </View>
                </View>
            </ScrollView>:null}
            <Loading show={!this.state.show}/>
        </View>)
    }
}
const styles = StyleSheet.create({
    itemContainer: {
        paddingLeft: scaleSize(50),
        paddingRight: scaleSize(50),
        marginLeft: 0,
        marginRight: 0
    },
    orangebg: {
        backgroundColor: '#ec5947',
        height: scaleSize(130),
    },
    pinggucontainer: {
        borderRadius: scaleSize(20),
        width: scaleSize(690),
        marginLeft: scaleSize(30),
        padding: scaleSize(20),
        marginTop: scaleSize(-100),
        backgroundColor: '#fff'
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
    required: {
        color: 'red',
        fontSize: scaleSize(24),
    },
    selectline: {
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
    inputval: {
        textAlign: 'right',
        flex: 1,
        height: scaleSizeW(36),
        fontSize: scaleSize(30),
        color: '#9b9b9b',
        paddingVertical: 0,
        paddingRight: scaleSize(50),
        lineHeight: scaleSizeW(30)
    },
    selname: {
        color: '#252121',
        fontSize: scaleSize(30)
    },
    selicon: { width: scaleSizeW(14), height: scaleSizeW(24), marginLeft: scaleSizeW(10), marginLeft: scaleSize(40) },
    greybg: {
        backgroundColor: '#f7f6f9'
    },
    comment: {
        paddingTop: scaleSize(30),
        paddingBottom: scaleSize(30),
        backgroundColor: '#fff',
        marginTop: scaleSize(30)
    },
    dialog_title: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: scaleSize(30)
    },
    dialog_closeBtn: {
        width: '90%',
        backgroundColor: '#ec5947',
        borderWidth: scaleSizeW(1),
        borderColor: '#ec5947',
        borderRadius: scaleSizeW(30),
        height: scaleSizeW(80),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textareaContainer: {
        height: 180,
        padding: 5,
        backgroundColor: '#F5FCFF',
    },
    textarea: {
        textAlignVertical: 'top',
        height: 170,
        fontSize: 14,
        color: '#333',
    },
    footeragree: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: scaleSize(80),
        paddingBottom: scaleSize(40),
        paddingTop: scaleSize(40)
    },
    checkicon: {
        width: scaleSize(28),
        height: scaleSize(28),
        marginRight: scaleSize(10)
    },
    greytxt: {
        color: '#939393',
        fontSize: scaleSize(24)
    },
    linktxt: {
        fontSize: scaleSize(24)
    },
    imagelist: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    imagelist_item: {
        marginRight: scaleSizeW(30),
        marginTop: scaleSizeW(30),
    },
    imageinfo: {
        width: scaleSizeW(233), height: scaleSizeW(235),
    }
})

export default Pinggu