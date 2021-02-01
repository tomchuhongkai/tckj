import React from 'react'
import { SafeAreaView, ScrollView, View, StatusBar, TextInput, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'
import { inject, observer } from 'mobx-react'
import { config, scaleSize } from '../../../tools/util'
import * as api from '../../../mocks/api'
import commonStyle from '../../../tools/commonstyles'
import CustomizeHeader from '../../components/customizeheader'
import RightButton from '../../components/rightButton'
import { Toast } from '../../../tools/tool'

let _this = null;

@inject('store')
@observer
class NicknameEdit extends React.Component {
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
    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            Nickname: ''
        }
    }
    changeInfo = (v) => {
        this.setState({
            Nickname: v
        })
    }
    saveInfo = () => {
        if (this.state.Nickname === '')
            Toast.info('请输入您的昵称')
        let that = this;
        const { setLoginInfo } = this.props.store.config;
        var data = { nickName: this.state.Nickname };
        api.ChangeNickName(data)
            .then(res => {
                if (res.data.result === 1) {
                    setLoginInfo({ nickName: this.state.Nickname });
                    that.props.navigation.goBack();
                } else {
                    Toast.fail(res.data.message);
                }
            })
    }
    render() {
        return (
            <SafeAreaView style={commonStyle.safeViewWithCustomHead}>
                <ScrollView style={{ width: '100%', height: '100%' }} keyboardShouldPersistTaps={'always'} contentContainerStyle={commonStyle.scrollViewContainerLogin}>
                    <View style={commonStyle.fields_line}>
                        <View style={commonStyle.wrapinput}>
                            {/* <TextInput multiline={true} value={this.state.Nickname} placeholder={this.props.store.config.userInfo.nickName} onChangeText={(v) => {
                            this.changeSign(v)
                        }} style={styles.signatureBox} /> */}
                            <TextInput onChangeText={(v) => { this.changeSign(v) }}
                                onChangeText={(v) => { this.setState({ Nickname: v }) }}
                                value={this.state.Nickname} returnKeyType='done'
                                placeholder={this.props.store.config.userInfo.nickName}
                                style={commonStyle.fields_textroundbox} />
                        </View>
                    </View>
                </ScrollView>
                <CustomizeHeader Title="昵称修改" goBack={() => { this.props.navigation.goBack() }}>
                    <RightButton>
                        <TouchableOpacity onPress={() => { this.saveInfo() }}>
                            <Text>完成</Text>
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
    }
})

export default NicknameEdit