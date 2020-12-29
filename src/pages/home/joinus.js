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
const loadingIcon = require('../../../images/loadingnew.gif')

@inject('store')
@observer
class JoinUs extends Component {
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
        var newdata = this.state.data.slice();
        const { userInfo } = this.props.store.config;
        let { images } = this.state;
        newdata.push({ "Key": "Id", "Value": 0 });
        newdata.push({ "Key": "ActionType", "Value": "JoinUs" });
        newdata.push({ "Key": "Title", "Value": this.state.title });
        newdata.push({ "Key": "Description", "Value": this.state.content });
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
                    this.setState({ data: [], title: '', content: '' })
                    tools.Toast.info('操作成功')
                } else {
                    tools.Toast.fail(res.data.message)
                }
            })
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
    renderInfo = () => {
        var postinfo = Object.assign({}, this.state.initdata)
        var infolist = [];
        var returnview = null;
        for (var key in postinfo) {
            infolist.push({ key: key, value: postinfo[key] });
        }
        returnview = infolist.map((item, index) => {
            var itemkey = item.key;
            if (itemkey === 'City') {
                return null;
            }
            var itemval = "请选择";
            var newdata = this.state.data.slice();
            var items = newdata.filter(x => x.Key === itemkey);
            if (items.length > 0) {
                itemval = items[0].Value;
            }
            if (item.value.propertyType == 25) {
                var itemsdisplay = [];
                item.value.items.map((subitem, subindex) => {
                    itemsdisplay.push({ key: subitem, value: subitem })
                })

                return (
                    <View key={index} style={styles.pinggucontainer}>
                        <View style={styles.selectline}>
                            <Text style={styles.selname}>{item.value.displayName}</Text>
                            <View style={{ flex: 1 }}>
                                <CustomPicker Items={itemsdisplay}
                                    style={{ height: scaleSizeW(100) }}
                                    textStyle={{ alignSelf: 'flex-start', fontSize: scaleSizeW(28), color: "#333" }}
                                    onChange={(itemValue, item) => {
                                        this.onChange(itemkey, itemValue)
                                    }}
                                    SelectedValue={"0"}
                                    value={itemval}
                                    keyName={'value'} valueName={'value'}
                                    renderButton={(func, text, value, containStyle, txtStyle) => {
                                        return (<TouchableOpacity
                                            onPress={() => {
                                                func();
                                            }}>
                                            <View style={[{ borderBottomWidth: 0, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }]}>
                                                <Text style={{ fontSize: scaleSizeW(30), color: '#9b9b9b' }}>{itemval}</Text>
                                                <Image source={require('../../../images/arrow-right.png')} style={styles.selicon} />
                                            </View>
                                        </TouchableOpacity>)
                                    }} />
                            </View>
                        </View>
                    </View>);
            }
            if (item.value.propertyType == 35) {
                var itemsdisplay = [];
                item.value.items.map((subitem, subindex) => {
                    itemsdisplay.push({ key: itemkey, value: subitem })
                })
                return (
                    <View key={index} style={styles.pinggucontainer}>

                        <View style={styles.selectlines}>
                            <Text style={styles.selname}>{item.value.displayName}</Text>
                            <View style={styles.radiocontainer}>
                                <RadioButton
                                    value={itemval}
                                    valueName={'value'}
                                    onClick={this.onChangeVal} source={itemsdisplay}
                                    renderItem={(item) => {
                                        return <View key={item} style={styles.item_row}>
                                            <View style={styles.item_row_right}>
                                                <View><Text style={styles.item_row_right_top_text}>{item.value}</Text></View>
                                            </View>
                                        </View>
                                    }} /></View></View></View>

                );


            }
            if (item.value.propertyType == 30) {

                return (
                    <View key={index} style={styles.pinggucontainer}>

                        <View style={styles.selectline}>
                            <Text style={styles.selname}>{item.value.displayName}</Text>
                            <Checkbox mode="one" onChange={(v) => { this.onChange(itemkey, v) }} isChecked={itemval} label={item.value.displayName} />
                        </View></View>
                );


            }
            if (item.value.propertyType == 10) {
                if (item.value.displayName == "收费标准") {
                    return (<View key={index} style={styles.greybg}>
                        <View style={[styles.pinggucontainer, styles.servicefee]}>

                            <View style={styles.selectline}>
                                <Text style={styles.selname}>收费标准</Text>
                                <TextInput style={styles.inputxt} value={itemval === '请选择' ? '' : itemval} onChangeText={(v) => { this.onChange(itemkey, v) }} placeholderTextColor="#9b9b9b" placeholder={item.value.displayName}></TextInput>

                            </View>
                        </View>
                    </View>)
                }
                else {
                    return (
                        <View key={index} style={styles.pinggucontainer}>

                            <View style={styles.selectline}>
                                <Text style={styles.selname}>{item.value.displayName}</Text>
                                <TextInput style={styles.inputxt} value={itemval === '请选择' ? '' : itemval} onChangeText={(v) => { this.onChange(itemkey, v) }} placeholderTextColor="#9b9b9b" placeholder={item.value.displayName}></TextInput>
                            </View></View>
                    );
                }

            }
            if (item.value.propertyType == 15) {
                return (<View key={index} style={styles.greybg}>
                    <View style={styles.comment}>
                        <View style={commonStyle.commonflexbetween}>
                            <Text style={styles.selname}>{item.value.displayName}</Text>
                        </View>
                        <Textarea
                            containerStyle={styles.textareaContainer}
                            style={styles.textarea}
                            onChangeText={(v) => { this.onChange(itemkey, v) }}
                            defaultValue={this.state.text}
                            maxLength={120}
                            placeholder={'请填写你的服务介绍，以便我们能更好的帮助你找到合适的人员'}
                            placeholderTextColor={'#c7c7c7'}
                            underlineColorAndroid={'transparent'}
                        />
                    </View></View>
                )



            }
            else { return null; }
        });
        return returnview;


    }

    render() {
        if (!this.state.show) {
            return (<Waiting />);
        }
        return (<View style={[commonStyle.safeViewWithCusHead, { backgroundColor: '#fff' }]}>
            <CustomizeHeader showBack={true} Title="申请合作" goBack={() => { this.props.navigation.goBack() }}>
            </CustomizeHeader>
            <ScrollView style={{ width: '100%', height: '100%' }} keyboardShouldPersistTaps={'always'} contentContainerStyle={commonStyle.scrollViewContainer}>
                <View style={styles.pinggucontainer}>

                    <View style={styles.selectline}>
                        <Text style={styles.selname}>申请原因 <Text style={styles.required}>*</Text></Text>
                        <TextInput style={styles.inputxt} value={this.state.title} onChangeText={(v) => { this.setState({ title: v }) }} placeholderTextColor="#9b9b9b" placeholder="请输入申请原因"></TextInput>
                    </View></View>
                {this.renderInfo()}

                <View style={styles.pinggucontainer}>
                    <View style={{ marginTop: scaleSizeW(20) }}>
                        <Text style={styles.selname}>申请明细</Text>
                        <View>
                            <Textarea
                                containerStyle={styles.addresstxt}
                                style={styles.addtextarea}
                                onChangeText={(e) => this.setState({ content: e })}
                                defaultValue={this.state.text}
                                maxLength={200}
                                placeholder={'请输入您申请合作的明细内容'}
                                placeholderTextColor={'#c7c7c7'}
                                value={this.state.content}
                                underlineColorAndroid={'transparent'}
                            />
                        </View>
                    </View>
                </View>
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

export default JoinUs