import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar} from 'react-native'
import { scaleSizeW, setSpText } from '../../tools/util'
import CustomizeHeader from '../components/customizeheader'
import { inject, observer } from 'mobx-react'
import * as api from '../../mocks/api'
import * as tools from '../../tools/tool'
import * as utils from '../../tools/util'

@inject("store")
@observer
class LocationSelector extends Component {
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
        this.state={
            data:[]
        };
    }
    componentDidMount = () => {
        let that = this;
        tools.GetFromLocal('Static_Cities')
            .then(res => {
                if (res === undefined || res === null || res === '') {
                    that.loadCities();
                }
                else {
                    let currentData = [];
                    if (typeof (res) === 'string') {
                        currentData = JSON.parse(res);
                    } else {
                        currentData = res;
                    }
                    that.setState({
                        data: currentData
                    })
                }
            },()=>{
            })
    }
    loadCities = () => {
        let that = this;
        api.GetCities()
            .then(res => {
                if (res.data.result === 1) {
                    that.setState({
                        data: res.data.data
                    })
                    tools.SetToLocal('Static_Cities', res.data.data);
                }
            })
    }
    setLocation=(title)=>{
        const { userInfo,setLoginInfo } = this.props.store.config;
        var info=Object.assign({},userInfo);
        info.location = title;
        setLoginInfo(info);
        if(this.props.navigation.state.params.callBack!==undefined){
            this.props.navigation.state.params.callBack(title);
        }
        this.props.navigation.goBack();
    }
    render() {
        const { userInfo } = this.props.store.config;
        var dataInfo=this.state.data.length===0?null:this.state.data.map((item, index) => {
            return (<TouchableOpacity key={index} style={[styles.smallLine, styles.middleLine,styles.borderBottom]} onPress={()=>{this.setLocation(item.title)}}>
                <Text style={styles.middleLine_text}>{item.title}</Text>
                {userInfo.location===item.title?<Image source={utils.Icons.LocationIcon} style={styles.selected}/>:null}
            </TouchableOpacity>)
        });
        return (
            <View style={[styles.container]}>
                <View style={styles.smallLine}><Text style={styles.smallLine_text}>当前城市</Text></View>
                <View style={[styles.smallLine, styles.middleLine]}><Text style={styles.middleLine_text}>{userInfo.location}</Text></View>
                <View style={styles.smallLine}><Text style={styles.smallLine_text}>其他城市</Text></View>
                <View>
                    {dataInfo}
                </View>
                <CustomizeHeader Title="选择城市" goBack={() => { this.props.navigation.goBack() }}></CustomizeHeader>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        width: scaleSizeW(750),
        backgroundColor: '#fff',
        paddingTop: scaleSizeW(90),
    },
    smallLine: {
        height: scaleSizeW(60),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        paddingLeft: scaleSizeW(40),
        paddingRight: scaleSizeW(40)
    },
    middleLine: {
        height: scaleSizeW(135),
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    middleLine_text: {
        fontSize: scaleSizeW(32),
        color: '#474747'
    },
    smallLine_text: {
        fontSize: setSpText(20),
        color: '#949494'
    },
    borderBottom:{
        borderBottomWidth:scaleSizeW(1),
        borderBottomColor:'#dedede',
    },
    selected:{
        width:scaleSizeW(32),
        height:scaleSizeW(32)
    }
})
export default LocationSelector;