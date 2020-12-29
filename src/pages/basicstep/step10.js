import React, { Component } from "react";
import { observer, inject } from 'mobx-react'
import { Text, View, TouchableOpacity, Image } from "react-native";
import commonStyle from '../../tools/commonstyles'
import { scaleSizeW,setSpText, Enums } from "../../tools/util";
import CustomPickerShow from '../components/custompickershow'
import CustomizeHeader from '../components/customizeheader'
import Checkbox from '../components/checkbox'

@inject('store')
@observer
class step10 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Disabled: true
        }

    }
    componentDidMount = () => {
        const { profile } = this.props.store.userprofile;
        if (profile.monthSalary !== undefined && profile.monthSalary !== "" && profile.monthSalary !== null && profile.monthSalary !== 0) {
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
            monthSalary: parseInt(value, 10)
        })
        this.setState({
            Disabled: false
        })
    }
    render() {
        const { profile,changeProfile } = this.props.store.userprofile;
        return (
            <View style={[commonStyle.safeViewWithCusHead, { backgroundColor: '#fff' }]}>
                <View style={{ width: '100%', height: '100%' }} contentContainerStyle={commonStyle.scrollViewContainer}>
                    <View style={{ paddingHorizontal: scaleSizeW(40) }}>
                        <View><Text style={{ color: "#333", fontSize: setSpText(48), marginBottom: scaleSizeW(20) }}>是时候展现您的经济实力了</Text></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                            <CustomPickerShow Items={Enums.monthSalaryData}
                                onChange={(itemValue, item) => {
                                    this.setData(item.key)
                                }}
                                keyName={'key'} valueName={'value'}
                                SelectedValue={profile.monthSalary.toString()}
                            />
                        </View>
                        <View style={{marginBottom:scaleSizeW(40)}}>
                        <Checkbox mode="one" onChange={(v) => {
                            changeProfile({showMonthSalary:v})
                        }} isChecked={profile.showMonthSalary} label="是否对别人可见" />
                        </View>
                        <View style={{ marginBottom: scaleSizeW(20) }}>
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

export default step10;
