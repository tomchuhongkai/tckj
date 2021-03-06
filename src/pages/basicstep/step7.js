import React, { Component } from "react";
import { observer, inject } from 'mobx-react'
import { Text, View, TouchableOpacity, Image } from "react-native";
import commonStyle from '../../tools/commonstyles'
import { scaleSizeW,setSpText } from "../../tools/util";
import CustomizeHeader from '../components/customizeheader'

@inject('store')
@observer
class step7 extends Component {
        constructor(props) {
                super(props);
                this.state = {
                        Disabled: props.store.userprofile.profile.cityId === 0 ? true : false,
                };
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
        setData = (item) => {
                this.setState({
                        Disabled: false
                })
                this.props.store.userprofile.changeProfile({
                        cityId: item.id,
                        strCityId:item.name
                })

        }
        render() {
                const { profile } = this.props.store.userprofile;
                return (
                        <View style={[commonStyle.safeViewWithCusHead, { backgroundColor: '#fff' }]}>
                                <View style={{ width: '100%', height: '100%' }} contentContainerStyle={commonStyle.scrollViewContainer}>
                                        <View style={{ paddingHorizontal: scaleSizeW(40),paddingVertical:scaleSizeW(40) }}>
                                                <View><Text style={{ color: "#333", fontSize: setSpText(48), marginBottom: scaleSizeW(30) }}>您的现居地</Text></View>
                                                <View><Text style={{ color: "#9499a9", fontSize: setSpText(28), marginBottom: scaleSizeW(70) }}>寻找同城有缘人</Text></View>
                                                <View style={{ borderBottomColor: "#eee", borderBottomWidth: scaleSizeW(1),paddingBottom:scaleSizeW(20) }}>
                                                        <TouchableOpacity onPress={
                                                                () => {
                                                                        if (global.BasicStepNav !== undefined)
                                                                                global.BasicStepNav.push('CitySelector', {
                                                                                        type: 'country',
                                                                                        countryId: 0,
                                                                                        parentId: 0,
                                                                                        callBack: (item) => {
                                                                                                this.setData(item);
                                                                                        }
                                                                                })
                                                                }
                                                        }>
                                                                <View style={[{ borderBottomWidth: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                                                                        <Text style={{ fontSize: setSpText(28), color: '#9b9b9b' }}>{profile.strCityId}</Text>
                                                                        <Image source={require('../../../images/down.png')} style={{ width: scaleSizeW(15), height: scaleSizeW(9), marginLeft: scaleSizeW(10) }} />
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
                                <CustomizeHeader goBack={() => { this.goBack() }} />
                        </View>
                );
        }
}

export default step7;