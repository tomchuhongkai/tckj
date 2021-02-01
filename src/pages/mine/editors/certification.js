import React from 'react'
import { SafeAreaView, ScrollView, View, StatusBar, TextInput, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'
import { inject, observer } from 'mobx-react'
import { config, scaleSize, setSpText } from '../../../tools/util'
import * as api from '../../../mocks/api'
import commonStyle from '../../../tools/commonstyles'
import CustomizeHeader from '../../components/customizeheader'
import RightButton from '../../components/rightButton'
import { Toast } from '../../../tools/tool'
import PhotoSelector from '../../components/photoselector'
const addIcon = require('../../../../images/addphoto.png')
const loadingIcon = require('../../../../images/loadingnew.gif')

let _this = null;

@inject('store')
@observer
export default class CertificationEdit extends React.Component {
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
    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            images: [],
            visible: false,
            Name: '',
            Ids: '',
            Address: '',
        }
    }
    changeInfo = (obj) => {
        var _data = Object.assign({}, this.state, obj);
        this.setState(_data)
    }
    saveInfo = () => {
        let data = {};
        if (this.props.navigation.getParam("type") === 'person') {
            if (this.state.Name === '') {
                Toast.info('请输入您的姓名')
                return;
            }
            if (this.state.Ids === '') {
                Toast.info('请输入您的身份证号')
                return;
            }
            data = { IsCompany: false, RealOrCompanyName: this.state.Name, CardID: this.state.Ids };
        } else {
            if (this.state.Name === '') {
                Toast.info('请输入公司名称')
                return;
            }
            if (this.state.Address === '') {
                Toast.info('请输入公司所在地址')
                return;
            }
            if (this.state.images.length === 0) {
                Toast.info('请上传营业执照')
                return;
            }
            data = { IsCompany: true, RealOrCompanyName: this.state.Name, LicenseId: this.state.images[0].picId, Address: this.state.Address };
        }
        let that = this;
        api.ShiMingRenZheng(data)
            .then(res => {
                if (res.data.result === 1) {
                    Toast.info('认证成功');
                    setTimeout(() => {
                        that.props.navigation.goBack();
                        if(that.props.navigation.state.params.callback!==undefined){
                            that.props.navigation.state.params.callback();
                        }
                    }, 1000);
                } else {
                    Toast.fail(res.data.message);
                }
            })
    }
    uploadCompleted = (data) => {
        let images = this.state.images.slice();
        if (data.length === undefined) {
            images = [{ uri: data.pictureUrl, picId: data.pictureId }];
        } else {
            images = [{ uri: data[0].pictureUrl, picId: data[0].pictureId }]
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
        return (
            <SafeAreaView style={commonStyle.safeViewWithCustomHead}>
                <ScrollView style={{ width: '100%', height: '100%' }} keyboardShouldPersistTaps={'always'} contentContainerStyle={commonStyle.scrollViewContainerLogin}>
                    {this.props.navigation.getParam("type") === 'person' ?
                        <View>
                            <View style={commonStyle.fields_line}>
                                <View style={commonStyle.wrapinput}>
                                    <TextInput
                                        onChangeText={(v) => { this.changeInfo({ Name: v }) }}
                                        value={this.state.Name}
                                        placeholder={'请输入您的姓名'} returnKeyType='done'
                                        style={commonStyle.fields_textroundbox} />
                                </View>
                            </View>
                            <View style={commonStyle.fields_line}>
                                <View style={commonStyle.wrapinput}>
                                    <TextInput
                                        onChangeText={(v) => { this.changeInfo({ Ids: v }) }}
                                        value={this.state.Ids}
                                        placeholder={'请输入您的身份证号'} returnKeyType='done'
                                        style={commonStyle.fields_textroundbox} />
                                </View>
                            </View>
                        </View>
                        :
                        <View>
                            <View style={commonStyle.fields_line}>
                                <View style={commonStyle.wrapinput}>
                                    <TextInput
                                        onChangeText={(v) => { this.changeInfo({ Name: v }) }}
                                        value={this.state.Name}
                                        placeholder={'请输入您的公司名称'} returnKeyType='done'
                                        style={commonStyle.fields_textroundbox} />
                                </View>
                            </View>
                            <View style={commonStyle.fields_line}>
                                <View style={commonStyle.wrapinput}>
                                    <TextInput
                                        onChangeText={(v) => { this.setState({ Address: v }) }}
                                        value={this.state.Address}
                                        placeholder={'请输入您的公司地址'} returnKeyType='done'
                                        style={commonStyle.fields_textroundbox} />
                                </View>
                            </View>
                            <View style={styles.pinggucontainer}>
                                <View style={[styles.selectline, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                                    <Text style={styles.selname}>请上传营业执照</Text>
                                </View>
                                <View style={styles.selectline}>
                                    {this.renderVideoAndImages()}
                                    <PhotoSelector visible={this.state.visible} onClose={() => {
                                        this.setState({ visible: false })
                                    }} callBack={this.uploadCompleted} />
                                </View>
                            </View>
                        </View>
                    }
                </ScrollView>
                <CustomizeHeader Title="认证资料提交"  theme="blue" goBack={() => { this.props.navigation.goBack() }}>
                    <RightButton>
                        <TouchableOpacity onPress={() => { this.saveInfo() }}>
                            <Text style={styles.saveBtnText}>完成</Text>
                        </TouchableOpacity>
                    </RightButton>
                </CustomizeHeader>
            </SafeAreaView>
        )
    }



}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        width: '100%'
    },
    main_note: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: scaleSize(30)
    },
    main_note_text: {
        fontSize: scaleSize(28),
        color: '#dedede'
    },
    signatureBox: {
        width: '100%',
        fontSize: scaleSize(28),
        borderBottomWidth: scaleSize(1),
        borderBottomColor: '#dedede',
        lineHeight: scaleSize(40),
        minHeight: scaleSize(100),
        paddingBottom: scaleSize(5),
        textAlignVertical: 'top'
    },
    sendBtn: {
        backgroundColor: '#1c1e1e',
        paddingTop: scaleSize(10),
        paddingBottom: scaleSize(10),
        paddingLeft: scaleSize(30),
        paddingRight: scaleSize(30),
        borderRadius: scaleSize(10)
    },
    sendBtn_text: {
        color: '#fff',
        fontSize: scaleSize(28)
    },
    sendBtn_inactive: {
        paddingRight: scaleSize(30),
        fontSize: scaleSize(28),
        color: '#333'
    },
    pinggucontainer: {
        borderRadius: scaleSize(20),

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
    imagelist_item: {
        marginRight: scaleSize(30),
        marginTop: scaleSize(30),
    },
    selname: {
        color: '#252121',
        fontSize: scaleSize(28),
    },
    imagelist: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    imageinfo: {
        width: scaleSize(233), height: scaleSize(235),
    },
    saveBtnText:{
        color:'#fff',
        fontSize:setSpText(28)
    }

})
