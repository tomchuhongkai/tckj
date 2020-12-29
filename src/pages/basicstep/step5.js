import React, { Component } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { observer, inject } from 'mobx-react'
import commonStyle from '../../tools/commonstyles'
import { scaleSizeW,setSpText, Enums } from "../../tools/util";
import CustomizeHeader from "../components/customizeheader";
import CustomPickerShow from '../components/custompickershow'

//宠物

@inject('store')
@observer
class step5 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Disabled: true
        }

    }
    componentDidMount = () => {
        const { profile } = this.props.store.userprofile;
        if (profile.likePet !== undefined && profile.likePet !== "" && profile.likePet !== null && profile.likePet !== 0) {
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
            likePet: parseInt(value, 10)
        })
        this.setState({
            Disabled: false
        })
    }
    render() {
        const { profile } = this.props.store.userprofile;
        return (
            <View style={[commonStyle.safeViewWithCusHead, { backgroundColor: '#fff' }]}>
                <View style={{ width: '100%', height: '100%' }} contentContainerStyle={commonStyle.scrollViewContainer}>
                    <View style={{ paddingHorizontal: scaleSizeW(40),paddingVertical:scaleSizeW(40) }}>
                        <View><Text style={{ color: "#333", fontSize: setSpText(40), marginBottom: scaleSizeW(30) }}>小小的宠物体现你们的共同点</Text></View>
                        <View><Text style={{ color: "#9499a9", fontSize: setSpText(28), marginBottom: scaleSizeW(70) }}>爱宠一族在一起，可以增加生活情趣</Text></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                            <CustomPickerShow Items={Enums.likePetData}
                                onChange={(v) => {
                                    this.setData(v)
                                }}
                                SelectedValue={profile.likePet.toString()}
                                keyName={'key'} valueName={'value'}
                            />
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

export default step5;