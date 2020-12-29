import React, { Component } from "react"
import { observer, inject } from 'mobx-react'
import { Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import commonStyle from '../../tools/commonstyles'
import { scaleSizeW,setSpText, Enums, Icons } from "../../tools/util"
import CustomPickerShow from '../components/custompickershow'
import CustomizeHeader from "../components/customizeheader"
import Checkbox from '../components/checkbox'

@inject('store')
@observer
class step4 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Disabled: true
        }

    }
    componentDidMount = () => {
        const { profile } = this.props.store.userprofile;
        if (profile.maritalStatus !== undefined && profile.maritalStatus !== "" && profile.maritalStatus !== null && profile.maritalStatus !== 0) {
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
            maritalStatus: parseInt(value, 10)
        })

        this.setState({
            Disabled: false
        })
    }

    render() {
        const { profile, changeProfile } = this.props.store.userprofile;
        let data = parseInt(profile.gender, 10) === 1 ? Enums.manMaritalStatusData : Enums.WomanMaritalStatusData;
        return (
            <View style={[commonStyle.safeViewWithCusHead, { backgroundColor: '#fff' }]}>
                <View style={{ width: '100%', height: '100%' }} contentContainerStyle={commonStyle.scrollViewContainer}>
                    <View style={{ paddingHorizontal: scaleSizeW(40),paddingVertical:scaleSizeW(40) }}>
                        
                        <View><Text style={{ color: "#333", fontSize: setSpText(48), marginBottom: scaleSizeW(30) }}>爱情的长河来来往往</Text></View>
                        <View><Text style={{ color: "#9499a9", fontSize: setSpText(28), marginBottom: scaleSizeW(70) }}>您的婚姻史是</Text></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                            <CustomPickerShow Items={data}
                                onChange={(v) => {
                                    this.setData(v)
                                }}
                                SelectedValue={profile.maritalStatus.toString()}
                                keyName={'key'} valueName={'value'}

                            />
                        </View>
                        <Checkbox mode="one" onChange={(v) => {
                            changeProfile({showMaritalStatus:v})
                        }} isChecked={profile.showMaritalStatus} label="是否对别人可见" />
                        <View style={[commonStyle.describe,commonStyle.describe_center]}>
                            <Image source={Icons.Important} style={commonStyle.describe_image} />
                            <Text style={commonStyle.describe_text}>婚姻史一旦选定将不能被修改</Text>
                        </View>
                        <View style={{ marginTop: scaleSizeW(60) }}>
                            <TouchableOpacity onPress={this.nextStep} disabled={this.state.Disabled ? true : false} style={[commonStyle.fullWidthButton, this.state.Disabled ? commonStyle.fullWidthButton_Disabled : null]}>
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

export default step4;
