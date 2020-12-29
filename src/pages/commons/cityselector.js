import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, SafeAreaView, Text, View, FlatList, Image } from 'react-native'
import { observer, inject } from 'mobx-react'
import commonStyle from '../../tools/commonstyles'
import CustomizeHeader from '../components/customizeheader'
import CountryState from '../commons/countrystatsjson'
import RightButton from '../components/rightButton'
import { scaleSizeW, setSpText } from '../../tools/util'

@inject('store')
@observer
class CitySelector extends Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = {
            onlyProvince: props.navigation.getParam('onlyProvince') == undefined ? false : props.navigation.getParam('onlyProvince'),
            List: [],
            Level: 0,
            CurrentParentId: 0,
            CurrentParentName: '',
            SelectedItems: []
        }
    }
    componentDidMount = () => {
        this.setState({ List: CountryState.countries })
    }
    showSub = (parent, level) => {
        let _data = CountryState.stateProvince.filter(x => x.parentId === parent.id);
        this.setState({ List: _data, Level: level, CurrentParentId: parent.id, CurrentParentName: parent.name })
    }
    onChange = (item) => {
        if (this.state.onlyProvince) {
            //就到省一级别
            if (this.state.Level == 0) {
                if (item.hasChildren) {
                    this.showSub(item, this.state.Level + 1);
                } else {
                    this.doSelect(item);
                }
            } else {
                this.doSelect(item);
            }
        }else{
            if (item.hasChildren) {
                this.showSub(item, this.state.Level + 1);
            } else {
                this.doSelect(item);
            }
        }
    }
    doSelect = (item) => {
        var _index = this.state.SelectedItems.findIndex(x => x.id === item.id);
        if (_index !== -1) {
            //已存在
            var selectedItems = this.state.SelectedItems.slice();
            selectedItems.splice(_index, 1);
            this.setState({
                SelectedItems: selectedItems
            })
        } else {
            if (this.state.onlyProvince) {
                var selectedItems = this.state.SelectedItems.slice();
                selectedItems.push({ id: item.id, name: item.name });
                this.setState({
                    SelectedItems: selectedItems
                })
            } else {
                //单选
                this.setCallBackInfo(item)
            }
        }
    }
    setCallBackInfo = (item) => {
        if (!this.state.onlyProvince) {
            let _name = "";
            if (item.parentId ===undefined ||item.parentId === 0) {
                _name = item.name;
            } else {
                var parent = CountryState.stateProvince.filter(x => x.id === item.parentId)[0];
                if (parent == null) {
                    parent = CountryState.countries.filter(x => x.id === item.parentId)[0];
                }
                if (parent.parentId === undefined || parent.parentId === 0) {
                    _name = parent.name + " " + item.name;
                } else {
                    var country = CountryState.countries.filter(x => x.id === parent.parentId)[0];
                    _name = country.name + " " + parent.name + " " + item.name;
                }
            }
            //单选 item不为null
            this.props.navigation.state.params.callBack({
                id: item.id,
                name: _name
            })
        } else {
            //多选 item为null 结果在SelectedItems中
            this.props.navigation.state.params.callBack(this.state.SelectedItems.slice());
        }
        this.props.navigation.goBack();
    }
    renderItem = ({ item }) => {
        var arrowHtml = (<Image source={require('../../../images/arrow-right.png')} resizeMode='contain' style={styles.rightarrow} />);
        if (this.state.onlyProvince) {
            if (this.state.Level != 0 || !item.hasChildren) {
                if(this.state.SelectedItems.findIndex(x=>x.id===item.id)!==-1){
                    arrowHtml = (<Image source={require('../../../images/icon_correct.png')} resizeMode='contain' style={styles.correctIcon} />)
                }else{
                    arrowHtml = null;
                }
            }
        } else {
            if (!item.hasChildren) {
                arrowHtml = null;
            }
        }
        return (<TouchableOpacity onPress={() => {
            this.onChange(item)
        }}>
            <View style={styles.item}>
                <Text style={styles.itemtext}>{item.name}
                </Text>
                {arrowHtml}
            </View>
        </TouchableOpacity>)
    }
    _keyExtractor = (item) => {
        return item.id.toString();
    }
    render() {
        const { List, type, showReset } = this.state;
        return (
            <SafeAreaView style={commonStyle.safeViewWithCusHead}>
                {this.state.Level != 0 ? <TouchableOpacity onPress={() => {
                    if (this.state.Level === 1) {
                        this.setState({ List: CountryState.countries, Level: 0 })
                    } else if (this.state.Level === 2) {
                        var stateProvince = CountryState.stateProvince.filter(x => x.id === this.state.CurrentParentId)[0];
                        var country = CountryState.countries.filter(x => x.id === stateProvince.parentId)[0];
                        this.showSub(country, 1);
                    }
                }} style={styles.headerBack}><Text style={styles.headerBack_text}>返回上一级</Text></TouchableOpacity> : null}
                <FlatList
                    data={List}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this.renderItem}
                />
                <CustomizeHeader Title="" goBack={() => {
                    const { removeLastLocation } = this.props.store.location;
                    removeLastLocation();
                    this.props.navigation.goBack()
                }} >{this.state.onlyProvince?<RightButton>
                    <TouchableOpacity onPress={this.setCallBackInfo} style={styles.saveBtn}>
                        <Text style={styles.saveBtn_text}>完成</Text>
                    </TouchableOpacity>
                </RightButton>:null}</CustomizeHeader>
            </SafeAreaView>
        )
    }
}

export default CitySelector

const styles = StyleSheet.create({
    item: {
        borderBottomColor: '#dedede',
        borderBottomWidth: scaleSizeW(1), paddingVertical: scaleSizeW(30), paddingHorizontal: scaleSizeW(30),
        flexDirection: "row", justifyContent: 'space-between',

    },
    itemtext: { fontSize: setSpText(32) },
    settingedit: { flex: 1 },
    buttons: {},
    rightarrow: {
        width: scaleSizeW(19), height: scaleSizeW(33)
    },
    correctIcon:{
        width: scaleSizeW(48), height: scaleSizeW(48)
    },
    btn: {
        backgroundColor: '#fc4186',
        justifyContent: "center",
        width: '80%',
        alignItems: 'center',
        marginLeft: '10%',
        borderRadius: scaleSizeW(30),
        marginTop: scaleSizeW(30),
        height: scaleSizeW(60),

    },
    headerBack: {
        height: scaleSizeW(60),
        lineHeight: scaleSizeW(60),
        paddingLeft: scaleSizeW(30),
        borderBottomColor: '#dedede',
        borderBottomWidth: scaleSizeW(1)
    },
    headerBack_text: {
        fontSize: setSpText(28),
        color: '#fc4186',
    },
    saveBtn:{
        paddingVertical:scaleSizeW(10),
        paddingHorizontal:scaleSizeW(30),
        backgroundColor:'#fc4186',
        borderRadius:scaleSizeW(20),
        alignSelf:'flex-end'
    },
    saveBtn_text:{
        color:'#fff',
        fontSize:setSpText(24),
    }

})