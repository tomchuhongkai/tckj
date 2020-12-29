import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, SafeAreaView, Text, View, FlatList, Image } from 'react-native'
import { observer, inject } from 'mobx-react'
import commonStyle from '../../tools/commonstyles'
import CustomizeHeader from '../components/customizeheader'
import CountryState from '../commons/countrystatsjson'
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
            type: props.navigation.getParam('type'),
            parentId: parseInt(props.navigation.getParam('parentId'), 10),
            onlyProvince: props.navigation.getParam('onlyProvince') == undefined ? false : props.navigation.getParam('onlyProvince'),
            showReset: props.navigation.getParam('showReset') == undefined ? false : props.navigation.getParam('showReset'),
            List: []
        }
    }
    componentDidMount = () => {
        let that = this;
        switch (that.state.type) {
            case 'country':
                this.props.store.location.initLocation()
                this.setState({ List: CountryState.countries })
                break;
            case 'stats':
                let _data = CountryState.stateProvince.filter(x => x.parentId === that.state.parentId);
                this.setState({ List: _data })
                break;
            default: break;
        }
    }
    onChange = (item) => {
        const { Locations, setToLocation } = this.props.store.location;
        const { type } = this.state;
        if (item.hasChildren) {
            if (this.state.onlyProvince && Locations.length === 1) {
                let popLength = 2;
                //知道省一级别
                this.setCallBackInfo(Locations, item, type);
                this.props.navigation.pop(popLength);
            } else {
                if (Locations.length === 2) {
                    //到市级别
                    this.setCallBackInfo(Locations, item, type);
                    this.props.navigation.pop(popLength);
                } else {
                    setToLocation({ Id: item.id, Name: item.name, Type: type })
                    this.props.navigation.push('CitySelector', {
                        type: 'stats',
                        parentId: item.id,
                        onlyProvince: this.state.onlyProvince,
                        callBack: this.props.navigation.state.params.callBack
                    })
                }
            }
        } else {
            this.setCallBackInfo(Locations, item, type);
            this.props.navigation.pop(Locations.length + 1);
        }
    }
    setCallBackInfo = (Locations, item, type) => {
        let _data = Locations.slice();
        _data.push({ Id: item.id, Name: item.name, Type: type });
        let names = [];
        _data.forEach(item => {
            names.push(item.Name);
        })
        let _name = names.join(' ');
        this.props.navigation.state.params.callBack({
            id: _data.length === 0 ? 0 : _data[_data.length - 1].Id,
            name: _name
        })
    }
    renderItem = ({ item }) => {
        return (<TouchableOpacity onPress={() => {
            this.onChange(item)
        }}>
            <View style={styles.item}>
                <Text style={styles.itemtext}>{item.name}
                </Text>
                {item.hasChildren ? <Image source={require('../../../images/arrow-right.png')} resizeMode='contain' style={styles.rightarrow} /> : null}
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
                <FlatList
                    data={List}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this.renderItem}
                    ListFooterComponent={type === "country" && showReset ? <TouchableOpacity onPress={() => {
                        if (this.props.navigation.state.params.reset) {
                            this.props.navigation.state.params.reset()
                        }
                    }}>
                        <View style={styles.item, styles.btn}>
                            <Text style={styles.itemtext, { color: '#fff' }}>
                                重置
                            </Text>
                        </View>
                    </TouchableOpacity> : null}
                />
                <CustomizeHeader Title="" goBack={() => {
                    const { removeLastLocation } = this.props.store.location;
                    removeLastLocation();
                    this.props.navigation.goBack()
                }} />
            </SafeAreaView>
        )
    }
}

export default CitySelector

const styles = StyleSheet.create({
    item: {
        borderBottomColor: '#dedede',
        borderBottomWidth: scaleSizeW(1), paddingVertical: 14, paddingHorizontal: 18,
        flexDirection: "row", justifyContent: 'space-between',

    },
    itemtext: { fontSize: setSpText(32) },
    settingedit: { flex: 1 },
    buttons: {},
    rightarrow: {
        width: scaleSizeW(19), height: scaleSizeW(33)
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

    }


})