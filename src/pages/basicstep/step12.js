import React, { Component } from "react";
import { observer, inject } from 'mobx-react'
import { Text, View, TouchableOpacity, Image } from "react-native";
import commonStyle from '../../tools/commonstyles'
import { setSpText,scaleSizeW, Enums } from "../../tools/util";
import CustomizeHeader from '../components/customizeheader'
import CustomPickerShow from '../components/custompickershow'
import Checkbox from '../components/checkbox'


@inject('store')
@observer
class step6 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Disabled: true
        }

    }
    componentDidMount = () => {
        const { profile } = this.props.store.userprofile;
        if (profile.education !== undefined && profile.education !== "" && profile.education !== null && profile.education !== 0) {
            this.setState({
                Disabled: false
            })
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

    setData = (value) => {
        this.props.store.userprofile.changeProfile({
            education: parseInt(value, 10)
        })
        this.setState({
            Disabled: false
        })
    }
    render() {
        const { profile, changeProfile } = this.props.store.userprofile;
        return (
            <View style={[commonStyle.safeViewWithCusHead, { backgroundColor: '#fff' }]}>
                <View style={{ width: '100%', height: '100%' }} contentContainerStyle={commonStyle.scrollViewContainer}>
                    <View style={{ paddingHorizontal: scaleSizeW(40),paddingVertical:scaleSizeW(40)}}>
                        <View><Text style={{ color: "#333", fontSize: setSpText(48), marginBottom: scaleSizeW(30) }}>展现您的才华</Text></View>
                        <View><Text style={{ color: "#9499a9", fontSize: setSpText(28), marginBottom: scaleSizeW(40) }}>让更多人了解你</Text></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                            <CustomPickerShow Items={Enums.educationData}
                                onChange={(v) => {
                                    this.setData(v)
                                }}
                                SelectedValue={profile.education.toString()}
                                keyName={'key'} valueName={'value'}

                            />
                        </View>
                        <Checkbox mode="one" onChange={(v) => {
                            changeProfile({ showEducation: v })
                        }} isChecked={profile.showEducation} label="是否对别人可见" />
                        <View style={{ marginTop: scaleSizeW(60) }}>
                            <TouchableOpacity onPress={this.nextStep} disabled={this.state.Disabled ? true : false} style={[commonStyle.fullWidthButton, this.state.Disabled ? commonStyle.fullWidthButton_Disabled : null]}>
                                <Text style={commonStyle.fullWidthButton_text}>完成</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <CustomizeHeader goBack={() => { this.goBack() }} />
            </View>
        );
    }
}

export default step6;