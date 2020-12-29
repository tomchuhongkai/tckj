import React, { Component } from "react";
import { observer, inject } from 'mobx-react'
import { Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import commonStyle from '../../tools/commonstyles'
import { scaleSizeW,setSpText } from "../../tools/util";
import CustomizeHeader from "../components/customizeheader";
import VerticalPointMove from '../components/verticalpointmove'
//身高
@inject('store')
@observer
class step3 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Disabled: props.store.userprofile.profile.height === null || props.store.userprofile.profile.height === 0 ? true : false,
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
    setHeight = (value) => {
        this.props.store.userprofile.changeProfile({
            height: value
        })
    }
    render() {
        const { profile } = this.props.store.userprofile;
        return (
            <View style={[commonStyle.safeViewWithCusHead, { backgroundColor: '#fff' }]}>
                <View style={{ width: '100%', height: '100%' }}>
                    <View style={{ paddingHorizontal: scaleSizeW(40), width: '100%' }}>
                        {/* <View><Text style={{ color: "#333", fontSize: scaleSize(48), marginBottom: scaleSize(30) }}>请选择你身高</Text></View> */}
                        <View style={{ flexDirection: 'column', width: '100%', alignItems: 'flex-start', justifyContent: 'flex-start', height: scaleSizeW(820) }}>
                            <View>
                                <View><Text style={{ fontSize: setSpText(28), color: "#9499a0" }}>您选择的身高是</Text></View>
                            </View>
                        </View>
                        <View style={{ marginTop: scaleSizeW(60) }}>
                            <TouchableOpacity onPress={this.nextStep} disabled={this.state.Disabled ? true : false} style={[commonStyle.fullWidthButton, this.state.Disabled ? commonStyle.fullWidthButton_Disabled : null]}>
                                <Text style={commonStyle.fullWidthButton_text}>下一步</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{ position: 'absolute', top: scaleSizeW(200), left: scaleSizeW(40), height: scaleSizeW(640), width: scaleSizeW(380) }}>
                    <VerticalPointMove value={profile.height} circleR={scaleSizeW(40)} top={scaleSizeW(200)} max={225} min={140} unit='cm' onChange={(v) => {
                        this.setHeight(v)
                    }} />
                </View>
                <CustomizeHeader goBack={() => { this.goBack() }} />
            </View>
        );
    }
}

export default step3;