import React, { Component } from "react";
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, Image } from "react-native";
import { observer, inject } from 'mobx-react'
import commonStyle from '../../tools/commonstyles'
import { scaleSizeW,setSpText, Icons } from "../../tools/util";
import CustomizeHeader from "../components/customizeheader";

//性别
@inject('store')
@observer
class step2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Disabled: true
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

    changeTab = (v) => {
        this.setState({
            Disabled: false
        })
        this.props.store.userprofile.changeProfile({
            gender: v
        })
    }
    componentDidMount = () => {
        const { profile } = this.props.store.userprofile;
        this.setState({
            Disabled: profile.gender === 0 ? true : false,
        })
    }
    render() {
        const { profile } = this.props.store.userprofile;
        return (
            <View style={[commonStyle.safeViewWithCusHead, { backgroundColor: '#fff' }]}>
                <View style={{ width: '100%', height: '100%' }} style={commonStyle.scrollViewContainer}>
                    <View style={{ paddingHorizontal: scaleSizeW(40),paddingVertical:scaleSizeW(40) }}>
                        <View style={[commonStyle.describe]}>
                            <Image source={Icons.Important} style={commonStyle.describe_image} />
                            <Text style={commonStyle.describe_text}>性别一旦确定将不能被修改</Text>
                        </View>
                        <View><Text style={{ color: "#2e2727", fontSize: setSpText(36) }}>为了让我们更好的了解你，请先告诉我们这些。</Text></View>
                        <View><Text style={{ color: "#333", fontSize: setSpText(48), marginBottom: scaleSizeW(70), marginTop: scaleSizeW(20) }}>首先你是...</Text></View>
                        {/* 按钮 */}
                        <View style={styles.checkboxContainer2}>
                            <TouchableOpacity onPress={() => { this.changeTab(1) }}>
                                <View>
                                    {profile.gender === 1 ? <Image style={styles.img} source={require('../../../images/boy-selected.png')} /> :
                                        <Image style={styles.img} source={require('../../../images/boy-unselected.png')} />}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.changeTab(2) }}>
                                <View>
                                    {profile.gender === 2 ? <Image style={styles.img} source={require('../../../images/girl-selected.png')} /> : <Image style={styles.img} source={require('../../../images/girl-unselected.png')} />}
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: scaleSizeW(60) }}>
                            <TouchableOpacity onPress={this.nextStep} disabled={this.state.Disabled ? true : false} style={[commonStyle.fullWidthButton, this.state.Disabled ? commonStyle.fullWidthButton_Disabled : null]}>
                                <Text style={commonStyle.fullWidthButton_text}>下一步</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
                <CustomizeHeader goBack={() => { this.goBack() }}></CustomizeHeader>
            </View >

        );
    }
}

const styles = StyleSheet.create({
    checkboxContainer2: {
        flexDirection: 'row',
        justifyContent: "space-around",
        height: scaleSizeW(170),
        width: '100%'
    },
    img: {
        width: scaleSizeW(106),
        height: scaleSizeW(170),
        marginBottom: scaleSizeW(24)
    },
})

export default step2;