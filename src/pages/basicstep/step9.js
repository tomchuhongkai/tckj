import React, { Component } from "react";
import { observer, inject } from 'mobx-react'
import { Text, View, TouchableOpacity, Image } from "react-native";
import commonStyle from '../../tools/commonstyles'
import { scaleSizeW,setSpText, Enums } from "../../tools/util";
import CustomPicker from '../components/custompicker'
import CustomizeHeader from '../components/customizeheader'
//职业

@inject('store')
@observer
class step9 extends Component {
        constructor(props) {
                super(props);
                this.state = {
                        Disabled: props.store.userprofile.profile.occupation===0?true:false
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
        onChange=(item)=>{
                this.props.store.userprofile.changeProfile({
                        occupation: parseInt(item.value,10),
                        strOccupation: item.label
                })
                this.setState({ Disabled: false });
        }
        render() {
                const { profile } = this.props.store.userprofile;
                return (
                        <View style={[commonStyle.safeViewWithCusHead, { backgroundColor: '#fff' }]}>
                                <View style={{ width: '100%', height: '100%' }} contentContainerStyle={commonStyle.scrollViewContainer}>
                                        <View style={{ paddingHorizontal: scaleSizeW(40),paddingVertical:scaleSizeW(40) }}>
                                                <View><Text style={{ color: "#333", fontSize: setSpText(48), marginBottom: scaleSizeW(30) }}>您需要伴侣从事什么职业</Text></View>
                                                <View><Text style={{ color: "#9499a9", fontSize: setSpText(28), marginBottom: scaleSizeW(70) }}>适合的工作，合适的收入是爱情的物质基础</Text></View>
                                                <View>
                                                        <CustomPicker Items={Enums.occupationData}
                                                                style={{ height: scaleSizeW(100) }}
                                                                textStyle={{ alignSelf: 'flex-start', fontSize: setSpText(28), color: "#333" }}
                                                                onChange={(itemValue, item) => {
                                                                        this.onChange(item)
                                                                }}
                                                                SelectedValue={profile.occupation.toString()}
                                                                keyName={'value'} valueName={'label'}
                                                                renderButton={(func, text, value, containStyle, txtStyle) => {
                                                                        return (<TouchableOpacity
                                                                                onPress={() => {
                                                                                        func();
                                                                                }}>
                                                                                <View style={[{ borderBottomWidth: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                                                                                        <Text style={{ fontSize: setSpText(28), color: '#9b9b9b' }}>{profile.strOccupation}</Text>
                                                                                        <Image source={require('../../../images/down.png')} style={{ width: scaleSizeW(15), height: scaleSizeW(9), marginLeft: scaleSizeW(10) }} />
                                                                                </View>
                                                                        </TouchableOpacity>)
                                                                }} />
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

export default step9;