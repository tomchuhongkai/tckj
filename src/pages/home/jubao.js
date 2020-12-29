import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,StatusBar } from 'react-native'
import { scaleSize, scaleSizeH, Enums, scaleSizeW } from "../../tools/util";
import { inject, observer } from 'mobx-react'
import CustomizeHeader from "../components/customizeheader";
import CustomPicker from '../components/custompicker'
import PhotoSelector from '../components/photoselector'
import Waiting from '../commons/waiting'
import commonStyle from '../../tools/commonstyles'
import { TextInput } from 'react-native-gesture-handler';
import Checkbox from '../components/checkbox'
import RadioButton from '../components/radioButton'
const addIcon = require('../../../images/addphoto.png')
import Textarea from 'react-native-textarea';
import * as api from '../../mocks/api'
import * as locals from '../../tools/localdata'
import * as tools from '../../tools/tool'

@inject('store')
@observer
class Jubao extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            initdata: {},
            data: [],
            curphoto: '',
            title: '',
            content: '',
            images: [],
            show: false,
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
                borderBottomWidth: 0,elevation: 0,
                borderBottomColor: 'none'
            }
        }
    }
    componentDidMount = () => {
        global.CurrentNavigation = {
            Navigation: this.props.navigation,
            GoBack: 'JoinUs'
        };
        this.loadInfo();
    }
    componentWillUnmount = () => {
        global.CurrentNavigation = null;
    }
    loadInfo = () => {
        var that = this;
        locals.PrepareFormType("JoinUs")
            .then(data => {
                let _dataList=[];
                for(var key in data){
                    if(data[key].value!==''){
                        _dataList.push({Key:key,Value:data[key].value})
                    }
                }
                that.setState({ initdata: data,data:_dataList, show: true });
            }, tools.RejectHandler)
    }
    onChange = (key, value) => {
        var newdata = this.state.data.slice();
        var items = newdata.filter(x => x.Key === key);
        if (items.length > 0) {
            items[0].Value = value;
        } else {
            newdata.push({ Key: key, Value: value });
        }

        this.setState({ data: newdata })
    }

    Save = () => {
        // var newdata = this.state.data.slice();
        // const { userInfo } = this.props.store.config;
        // newdata.push({ "Key": "Id", "Value": 0 });
        // newdata.push({ "Key": "ActionType", "Value": "JoinUs" });
        // newdata.push({ "Key": "Title", "Value": this.state.title });
        // newdata.push({ "Key": "Description", "Value": this.state.content });
         var postData = {
            newsId: this.props.navigation.getParam("id"),
            desc: this.state.content,
            type: 2
         };
        // newdata.forEach(item => {
        //     postData[item.Key] = item.Value;
        // })
 
        api.RelationPost(postData)
            .then(res => {
                if (res.data.result === 1) {
                    this.setState({ data: [], title: '', content: '' })
                    tools.Toast.info('举报成功')
                } else {
                    tools.Toast.fail(res.data.message)
                }
            })
    }
    renderVideoAndImages = () => {
        let { topic } = this.props.store.postphotos;
        return (<View style={styles.imagelist}>
            {topic.data.map((item, index) => {
                return (<View key={index} style={styles.imagelist_item}>

                    <Image source={{ uri: item.uri }} style={styles.imageinfo} />
                    {item.status == "processing" ? <View style={commonStyle.loading}><Image style={{ width: scaleSize(80), height: scaleSize(80) }} source={require('../../../images/loading.gif')} /></View> : null}
                    {item.status == "completed" ? <View style={styles.uploaded}><Image style={{ width: scaleSize(33), height: scaleSize(32) }} source={require('../../../images/uploaded.png')} /></View> : null}
                </View>)
            })}
            {this.state.images.length < 3 ? <View style={[styles.imagelist_item, styles.imagelist_item_add]}>
                <TouchableOpacity onPress={() => {
                    this.setState({ visible: true })
                }}>
                    <Image source={addIcon} style={{ width: scaleSize(232), height: scaleSize(236) }} />
                </TouchableOpacity>
            </View> : null}
        </View>)
    }
    onChangeVal = (item) => {
        var newdata = this.state.data.slice();
        var items = newdata.filter(x => x.Key === item.key);
        if (items.length > 0) {
            items[0].Value = item.value;
        } else {
            newdata.push({ Key: item.key, Value: item.value });
        }

        this.setState({ data: newdata })


    }

    render() {
        if (!this.state.show) {
            return (<Waiting />);
        }
        return (<View style={[commonStyle.safeViewWithCusHead, { backgroundColor: '#fff' }]}>
            <CustomizeHeader showBack={true} Title="举报" goBack={() => { this.props.navigation.goBack() }}>
            </CustomizeHeader>
            <ScrollView style={{ width: '100%', height: '100%' }} keyboardShouldPersistTaps={'always'} contentContainerStyle={commonStyle.scrollViewContainer}>
                <View style={styles.pinggucontainer}>
                    <View style={{ marginTop: scaleSizeW(20) }}>
                        <Text style={styles.selname}>举报内容</Text>
                        <View>
                            <Textarea
                                containerStyle={styles.addresstxt}
                                style={styles.addtextarea}
                                onChangeText={(e) => this.setState({ content: e })}
                                defaultValue={this.state.text}
                                maxLength={200}
                                placeholder={'请输入您举报的明细内容'}
                                placeholderTextColor={'#c7c7c7'}
                                value={this.state.content}
                                underlineColorAndroid={'transparent'}
                            />
                        </View>
                    </View>
                </View>
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
    required: {
        color: 'red',
        fontSize: scaleSize(24),
    },
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
        height: scaleSizeW(180),
        backgroundColor: '#f7f6f9',
        marginTop: scaleSize(10)
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
        backgroundColor: '#f7f6f9',
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
        width: scaleSize(200),
        height: scaleSize(200),
    },
    imagelist: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: scaleSize(10),
        flexWrap: 'wrap',
        flex: 1
    },
    radiocontainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    imagelist_item: {
        marginBottom: scaleSize(20)
    },
    addresstxt: {
        height: scaleSizeW(180),
        flex: 1
    },
    addtextarea: {
        textAlignVertical: 'top',  // hack android
        height: scaleSizeW(180),
        fontSize: scaleSizeW(30), color: '#26292a'
    },
})

export default Jubao