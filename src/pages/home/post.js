import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar,Alert,DeviceEventEmitter } from 'react-native'
import { inject, observer } from 'mobx-react'
import { scaleSize, scaleSizeH, Enums, scaleSizeW } from "../../tools/util";
import * as api from '../../mocks/api'
import CustomizeHeader from "../components/customizeheader";
import commonStyle from '../../tools/commonstyles'
import { TextInput } from 'react-native-gesture-handler';
import PhotoSelector from '../components/photoselector'
import Textarea from 'react-native-textarea';
import { Toast } from '../../tools/tool';
const addIcon = require('../../../images/addphoto.png')
const loadingIcon=require('../../../images/loadingnew.gif')

@inject('store')
@observer
class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            curphoto: '',
            images: [],
            title: '',
            content: ''
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
                borderWidth: 0
            }
        }
    }
    componentDidMount() {
        const { userInfo } = this.props.store.config;
        if (userInfo.nickName === '') {
            this.props.navigation.replace('SignIn')
        }
    }
    onChange = (data) => {
        let state = Object.assign({}, this.state, data);
        this.setState(state);
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
    submit = () => {
        let that = this;
        if (this.state.title === '') {
            Toast.info('请输入帖子名称')
            return false;
        }
        if (this.state.content === '') {
            Toast.info('请输入详细内容')
            return false;
        }
        let pics = [];
        if (this.state.images.length > 0) {
            this.state.images.map(item => {
                pics.push(item.picId);
            })
        }
        var plateId=that.props.navigation.state.params.plateId;
        if(plateId.indexOf('_')!==-1){
            plateId = plateId.replace('name_','');
        }
        api.SaveTopic({
            CategoryId: plateId,
            Title: that.state.title,
            description: that.state.content,
            Pictures: pics
        })
            .then(res => {
                if (res.data.result === 1) {
                    Toast.info(res.data.message, 1, () => {
                        DeviceEventEmitter.emit(`forum_${plateId}`);
                        that.props.navigation.goBack();
                    })
                } else {
                    Toast.info(res.data.message);
                }
            })
    }
    deleteImage=(item)=>{
        let that =this;
        Alert.alert('提示',"你确定要删除此图片吗？",[{
            text:'确定',
            onPress:()=>{
                var images = that.state.images.slice();
                var index = images.findIndex(x=>x.picId===item.picId);
                images.splice(index,1);
                that.setState({
                    images:images
                })
            }
        },{
            text:'取消',
            onPress:()=>{
                
            }
        }])
    }
    renderVideoAndImages = () => {
        const { loading } = this.props.store.config;
        return (<View style={styles.imagelist}>
            {this.state.images.map((item, index) => {
                return (<View key={index} style={styles.imagelist_item}>
                    <TouchableOpacity onLongPress={() => this.deleteImage(item)}>
                        <Image source={{ uri: item.uri }} style={styles.imageinfo} />
                    </TouchableOpacity>
                </View>)
            })}
            {/* <View style={[styles.imagelist_item, styles.imagelist_item_add]}> */}
            {this.state.images.length < 3 ? <View style={styles.imagelist_item}>
                <TouchableOpacity onPress={() => {
                    this.setState({ visible: true })
                }}>
                    {loading.length > 0 ? <View style={commonStyle.imgLoading}><Image source={loadingIcon} resizeMode="cover" style={commonStyle.imgLoading_img} /></View> : <Image source={addIcon} resizeMode="cover" style={styles.imageinfo} />}
                </TouchableOpacity>
            </View> : null}
        </View>)
    }
    render() {


        return (<View style={[commonStyle.safeViewWithCusHead, { backgroundColor: '#fff' }]}>
            <CustomizeHeader showBack={true} Title="发布帖子" goBack={() => {
                this.props.navigation.goBack()
            }}>
            </CustomizeHeader>
            <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps={'always'} contentContainerStyle={commonStyle.scrollViewContainer}>
                <View style={styles.pinggucontainer}>
                    <TextInput style={styles.inputxt} placeholder="请输入您的帖子名称（30-40字）" onChangeText={(e) => this.onChange({ title: e })} value={this.state.title}></TextInput>
                    <Text style={styles.selname}>内容详情</Text>
                    <Textarea
                        containerStyle={styles.addresstxt}
                        style={styles.addtextarea}
                        onChangeText={(e) => this.onChange({ content: e })}
                        defaultValue={this.state.text}
                        maxLength={200}
                        placeholder={'请输入您主要内容，添加图片更加生动'}
                        placeholderTextColor={'#c7c7c7'}
                        value={this.state.content}
                        underlineColorAndroid={'transparent'}
                    />


                    {/* 上传的图片或视频 */}
                    {this.renderVideoAndImages()}
                    <PhotoSelector visible={this.state.visible} onClose={() => {
                        this.setState({ visible: false })
                    }} callBack={this.uploadCompleted} />
                    <View style={styles.dialog_title}>
                        <TouchableOpacity style={styles.dialog_closeBtn} onPress={this.submit}>
                            <Text style={{ color: '#fff', fontSize: scaleSize(30), alignSelf: 'center' }}>发布</Text>
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
    selname: {
        color: '#171717',
        fontSize: scaleSize(30),
        width: scaleSizeW(205),
        marginBottom: scaleSizeW(30),
        marginTop: scaleSizeW(30)
    },
    inputxt: { fontSize: scaleSizeW(30), color: '#171717' },
    selicon: { width: scaleSizeW(14), height: scaleSizeW(24), marginLeft: scaleSizeW(10), marginLeft: scaleSize(40) },
    greybg: {
        backgroundColor: '#f7f6f9'
    },
    comment: {
        paddingTop: scaleSize(30),
        paddingBottom: scaleSize(30),
        paddingLeft: scaleSize(50),
        paddingRight: scaleSize(50),
        backgroundColor: '#fff',
        marginTop: scaleSize(30),
    },
    dialog_title: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: scaleSize(60),
        marginBottom: scaleSizeW(50),

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
        height: scaleSizeW(180),
        padding: 5,
        backgroundColor: '#F5FCFF',
    },
    addresstxt: {
        height: scaleSizeW(180),
        flex: 1
    },
    textarea: {
        textAlignVertical: 'top',  // hack android
        height: scaleSizeW(170),
        fontSize: 14,
        color: '#333',
    },
    addtextarea: {
        textAlignVertical: 'top',  // hack android
        height: scaleSizeW(180),
        fontSize: scaleSizeW(30), color: '#26292a'
    },
    servicefee: {
        marginTop: scaleSizeW(30), fontSize: scaleSizeW(30), fontWeight: 'bold', color: '#26292a'

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
        borderRadius: scaleSize(10)
    }
})

export default Post