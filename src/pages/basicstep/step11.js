import React, { Component } from "react";
import { observer, inject } from 'mobx-react'
import { Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import commonStyle from '../../tools/commonstyles'
import { scaleSizeW,setSpText, Enums } from "../../tools/util";
import CustomizeHeader from '../components/customizeheader'
import SlideBar from '../components/slidebar'

@inject('store')
@observer
class step11 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Disabled: props.store.userprofile.profile.likeSmoke === 0 ? true : false
        }

    }
    nextStep = () => {
        const { next, saveState } = this.props;
        // Save state for use in other steps
        saveState({ name: "samad" });
        // Go to next step


        next();
    };

    goBack() {
        const { back } = this.props;
        // Go to previous step
        back();
    }
    render() {
        let _disabled = this.state.Disabled;
        let { profile,changeProfile } = this.props.store.userprofile;
        return (
            <View style={[commonStyle.safeViewWithCusHead, { backgroundColor: '#fff' }]}>
                <View style={{ width: '100%', height: '100%' }} contentContainerStyle={commonStyle.scrollViewContainer}>
                    <View style={{ paddingHorizontal: scaleSizeW(40),paddingVertical:scaleSizeW(40) }}>
                        <View><Text style={{ color: "#333", fontSize: setSpText(48), marginBottom: scaleSizeW(30) }}>您的生活习惯是？</Text></View>
                        <View><Text style={{ color: "#9499a9", fontSize: setSpText(28), marginBottom: scaleSizeW(70) }}>细节决定相处</Text></View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: scaleSizeW(40) }}>
                            <Text style={{ fontSize: setSpText(30) }}>是否抽烟</Text>
                            <SlideBar YesText="是" NoText="否" defaultValue={profile.likeSmoke}
                                onChange={(v) => {
                                    this.props.store.userprofile.changeProfile({
                                        likeSmoke: v,
                                        strLikeSmoke: v ? "是" : "否"
                                    })
                                    this.setState({ Disabled: false });
                                }} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: scaleSizeW(40) }}>
                            <Text style={{ fontSize: setSpText(30) }}>是否对别人可见</Text>
                            <SlideBar YesText="是" NoText="否" defaultValue={profile.showLikeSmoke}
                                onChange={(v) => {
                                    changeProfile({
                                        showLikeSmoke: v
                                    })
                                }} />
                        </View>
                        <View style={{ marginTop: scaleSizeW(60) }}>
                            <TouchableOpacity onPress={this.nextStep} disabled={_disabled ? true : false} style={[commonStyle.fullWidthButton, _disabled ? commonStyle.fullWidthButton_Disabled : null]}>
                                <Text style={commonStyle.fullWidthButton_text}>下一步</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <CustomizeHeader goBack={() => { this.goBack() }} />
            </View>
        );
    }
}

export default step11;


const styles = StyleSheet.create({

    borderBottomLine: {
        borderBottomColor: '#e5e5e5',
        borderBottomWidth: scaleSizeW(1),
        marginLeft: scaleSizeW(50),
        marginRight: scaleSizeW(50),
        paddingLeft: 0,
        paddingRight: 0,
        marginTop: 0,
        height: scaleSizeW(85),
    },
    left_text: {
        color: '#000',
        fontSize: setSpText(26),
    },
    right_text: {
        color: '#000',
        fontSize: setSpText(26),
        width: scaleSizeW(280),
        justifyContent: 'flex-end',
        textAlign: 'right'
    }
});