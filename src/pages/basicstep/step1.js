import React, { Component } from "react";
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, TextInput, Image } from "react-native";
import { observer, inject } from 'mobx-react'
import commonStyle from '../../tools/commonstyles'
import { scaleSizeW,setSpText, Icons } from "../../tools/util";
import CustomizeHeader from "../components/customizeheader";
import * as tools from '../../tools/tool'
const maxLength = 20;
const minLength = 2;
//性别
@inject('store')
@observer
class step1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Disabled: true
        }
    }
    nextStep = () => {
        const { next, saveState } = this.props;
        // Save state for use in other steps
        saveState({ name: "1" });
        // Go to next step
        const { profile } = this.props.store.userprofile;
        let nickName = tools.Trim(profile.nickName);
        if (nickName.length !== profile.nickName) {
            this.props.store.userprofile.changeProfile({
                nickName: nickName
            })
        }
        next();
    };

    goBack() {
        const { back } = this.props;
        // Go to previous step

        back();
    }

    changeTab = (tabName) => {
        tabName = tools.LeftTrim(tabName);
        if (tabName === undefined) {
            tabName = "";
        }
        let spaceCount = tabName.replace(/\S/g, '').length;
        let msg = ""
        if (spaceCount > 1) {
            msg = "您输入的空格太多了哦";
        }
        let tabNameLength = tools.GetLength(tabName);
        this.setState({
            message: msg,
            Disabled: msg !== "" ? true : tabNameLength >= minLength && tabNameLength <= maxLength ? false : true
        })
        this.props.store.userprofile.changeProfile({
            nickName: tabName
        })
    }
    componentDidMount = () => {
        const { profile } = this.props.store.userprofile;
        let tabNameLength = tools.GetLength(profile.nickName);
        this.setState({
            Disabled: tabNameLength >= minLength && tabNameLength <= maxLength ? false : true,
        })
    }
    render() {
        const { profile } = this.props.store.userprofile;
        return (
            <View style={[commonStyle.safeViewWithCusHead, { backgroundColor: '#fff' }]}>
                <ScrollView style={{ width: '100%', height: '100%' }} keyboardShouldPersistTaps={'always'} contentContainerStyle={commonStyle.scrollViewContainer}>
                    <View style={{ paddingHorizontal: scaleSizeW(40),paddingVertical:scaleSizeW(40) }}>
                        <View><Text style={{ color: "#2e2727", fontSize: setSpText(36) }}>请输入你的昵称</Text></View>
                        <View><Text style={{ color: "#333", fontSize: setSpText(48), marginBottom: scaleSizeW(70), marginTop: scaleSizeW(20) }}>昵称将会显示在你的主页上</Text></View>
                        <View style={commonStyle.fields_line}>
                            <View style={commonStyle.wrapinput}>
                                <TextInput placeholder='昵 称' returnKeyType="next" onChangeText={(v) => { this.changeTab(v) }} value={profile.nickName} style={commonStyle.fields_textroundbox} />
                                <TouchableOpacity onPress={() => this.changeTab('')}>
                                    <Image source={require('../../../images/cha.png')} style={profile.nickName !== '' && profile.nickName.length > 0 ? [styles.chaimg] : [styles.chaimg, styles.hide]} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={commonStyle.fields_line}>
                            <Text style={{ color: '#fc4185', fontSize: setSpText(24) }}>{this.state.message}</Text>
                        </View>
                        <View style={{ marginTop: scaleSizeW(60) }}>
                            <TouchableOpacity onPress={this.nextStep} disabled={this.state.Disabled ? true : false} style={[commonStyle.fullWidthButton, this.state.Disabled ? commonStyle.fullWidthButton_Disabled : null]}>
                                <Text style={commonStyle.fullWidthButton_text}>下一步</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <CustomizeHeader goBack={() => { global.BasicStepNav.goBack() }}></CustomizeHeader>
            </View>

        );
    }
}

const styles = StyleSheet.create({

    chaimg: {
        width: scaleSizeW(20),
        height: scaleSizeW(20),
    },
    hide: {
        display: "none"
    }
})

export default step1;