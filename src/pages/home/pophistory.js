import React, { Component } from 'react'
import { SafeAreaView, StyleSheet, View, TextInput, TouchableOpacity, Text, Image, Alert, StatusBar } from 'react-native'
import CustomizeHeader from '../components/customizeheader'
import { scaleSizeW } from '../../tools/util'

class PopHistory extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: null,
            headerLeft: null,
            headerRight: null,
            headerStyle: {
                height: StatusBar.currentHeight,
                shadowOpacity: 0,
                backgroundColor: '#4576f7'
            }
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            type: props.navigation.state.params.type===''?'MachineParts':props.navigation.state.params.type,
            value: ''
        }
    }
    changeType = (type) => {
        this.setState({
            type: type,
            value: ''
        })
    }
    changeValue(value) {
        this.setState({
            value: value
        }, () => {
            global.SearchInfo={ name: this.state.value, type: this.state.type };
        })
    }
    search = () => {

        if (this.props.navigation.state.params !== undefined && this.state.type === this.props.navigation.state.params.type) {
            if (this.props.navigation.state.params.callback !== undefined) {
                this.props.navigation.state.params.callback(this.state.value);
                this.props.navigation.goBack();
            }
        } else {
            switch (this.state.type) {
                case 'MachineParts':
                    this.props.navigation.goBack();
                    this.props.navigation.navigate('MechineParts');
                    break;
                case 'NewMachine':
                    this.props.navigation.goBack();
                    this.props.navigation.navigate('NewMechine');
                    break;
                case 'OldMachine':
                    this.props.navigation.goBack();
                    this.props.navigation.navigate('SecondMechine');
                    break;
                case 'BuyProduct':
                    break;
                case 'Forum':
                    break;
                case 'SendProduct':
                    break;
                default:
                    Alert.alert('请选择搜索类型');
                    break;
            }
        }
    }
    render() {
        const { type, value } = this.state;
        return (<SafeAreaView>
            <CustomizeHeader showBack={false} style={{ paddingLeft: scaleSizeW(30) }}>
                <View style={styles.headerRow}>
                    <Image style={styles.searchimg} source={require('../../../images/icon-search.png')} />
                    {type === 'MachineParts' ? <TextInput returnKeyType='done' onChange={(e) => {
                        this.changeValue(e.nativeEvent.text)
                    }} style={styles.input} autoFocus={true} placeholder="机器配件" value={value} onSubmitEditing={this.search} /> :
                        type === 'NewMachine' ? <TextInput returnKeyType='done' onChange={(e) => {
                            this.changeValue(e.nativeEvent.text)
                        }} style={styles.input} style={styles.input} autoFocus={true} placeholder="新机器" onSubmitEditing={this.search} value={value} /> :
                            type === 'OldMachine' ? <TextInput returnKeyType='done' onChange={(e) => {
                                this.changeValue(e.nativeEvent.text)
                            }} style={styles.input} style={styles.input} autoFocus={true} placeholder="二手机" onSubmitEditing={this.search} value={value} /> :
                                type === 'BuyProduct' ? <TextInput returnKeyType='done' onChange={(e) => {
                                    this.changeValue(e.nativeEvent.text)
                                }} style={styles.input} style={styles.input} autoFocus={true} placeholder="找货" onSubmitEditing={this.search} value={value} /> :
                                    type === 'Forum' ? <TextInput returnKeyType='done' style={styles.input} autoFocus={true} placeholder="论坛" onSubmitEditing={this.search} value={value} /> :
                                        type === 'SendProduct' ? <TextInput onChange={(e) => {
                                            this.changeValue(e.nativeEvent.text)
                                        }} style={styles.input} style={styles.input} autoFocus={true} placeholder="发货" onSubmitEditing={this.search} value={value} /> :
                                            <TextInput returnKeyType='done' style={styles.input} onChange={(e) => {
                                                this.changeValue(e.nativeEvent.text)
                                            }} style={styles.input} autoFocus={true} placeholder="搜索" value={value} onSubmitEditing={this.search} />}
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.goBack()
                    }} style={styles.button}><Text style={styles.buttonText}>取消</Text></TouchableOpacity>
                </View>
            </CustomizeHeader>
            <View style={{ marginTop: scaleSizeW(120) }}>
                <View style={{ alignItems: 'center' }}><Text style={styles.titleFont}>搜索指定内容</Text></View>
            </View>
            <View style={styles.commonRow}>
                <TouchableOpacity onPress={() => this.changeType('NewMachine')} style={styles.commonItem}><Text style={styles.itemFont}>新机器</Text></TouchableOpacity>
                <View style={styles.commonItem}><Text style={styles.itemFontLine}>|</Text></View>
                <TouchableOpacity onPress={() => this.changeType('OldMachine')} style={styles.commonItem}><Text style={styles.itemFont}>二手机</Text></TouchableOpacity>
                <View style={styles.commonItem}><Text style={styles.itemFontLine}>|</Text></View>
                <TouchableOpacity onPress={() => this.changeType('MachineParts')} style={styles.commonItem}><Text style={styles.itemFont}>买配件</Text></TouchableOpacity>
            </View>
            {/* <View style={styles.commonRow}>
                <TouchableOpacity onPress={() => this.changeType('BuyProduct')} style={styles.commonItem}><Text style={styles.itemFont}>找货</Text></TouchableOpacity>
                <View style={styles.commonItem}><Text style={styles.itemFontLine}>|</Text></View>
                <TouchableOpacity onPress={() => this.changeType('Forum')} style={styles.commonItem}><Text style={styles.itemFont}>论坛</Text></TouchableOpacity>
                <View style={styles.commonItem}><Text style={styles.itemFontLine}>|</Text></View>
                <TouchableOpacity onPress={() => this.changeType('SendProduct')} style={styles.commonItem}><Text style={styles.itemFont}>发货</Text></TouchableOpacity>
            </View> */}
        </SafeAreaView>)
    }
}
const styles = StyleSheet.create({
    headerRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        position: 'relative'
    },
    input: {
        width: scaleSizeW(600),
        borderWidth: scaleSizeW(1),
        borderColor: '#dedede',
        borderRadius: scaleSizeW(10),
        height: scaleSizeW(60),
        paddingLeft: scaleSizeW(55),
        paddingRight: scaleSizeW(30),
        fontSize: scaleSizeW(28),
        paddingVertical: 0
    }, button: {
        flex: 1,
        paddingLeft: scaleSizeW(15)
    },
    buttonText: {
        fontSize: scaleSizeW(28),
        color: '#ec5947',
    },
    searchimg: {
        width: scaleSizeW(27),
        height: scaleSizeW(29),
        position: 'absolute',
        left: scaleSizeW(15)
    },
    titleFont: {
        color: '#dedede',
        fontSize: scaleSizeW(22)
    },
    commonRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: scaleSizeW(90),
        width: scaleSizeW(580),
        marginLeft: scaleSizeW(85)
    },
    commonItem: {
        flex: 1,
        alignItems: 'center'
    },
    itemFont: {
        fontSize: scaleSizeW(26),
        color: '#000'
    },
    itemFontLine: {
        fontSize: scaleSizeW(26),
        color: '#dedede'
    }
})

export default PopHistory