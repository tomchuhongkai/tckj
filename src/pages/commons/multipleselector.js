import React from 'react'
import { observer, inject } from 'mobx-react'
import { View, SafeAreaView, TouchableOpacity, Text, Image, StyleSheet, FlatList } from 'react-native'
import commonStyle from '../../tools/commonstyles'
import { scaleSizeW, setSpText, Enums } from '../../tools/util'
import CustomizeHeader from '../components/customizeheader'
import RightButton from '../components/rightButton'

@inject('store')
@observer
class MultipleSelector extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        let _type = props.navigation.getParam('type');
        const { BasicModel, HabitModel, SenseWorthModel } = props.store.herfate;
        const { userInfo } = this.props.store.config;
        let list = [];
        let _selected = [];
        let title = '';

        switch (_type) {
            case 'figure':
                title = "身材"
                if (userInfo.gender.toString() === "1") {
                    //自己是男
                    //对方女
                    list = Enums.figureWomanData;
                } else {
                    //自己是女
                    //对方男
                    list = Enums.figureManData;
                }
                if (typeof (BasicModel[_type].value) !== 'string')
                    _selected = BasicModel[_type].value;
                break;
            case 'occupation':
                title = "职业"
                list = Enums.occupationData;
                if (typeof (BasicModel[_type].value) !== 'string')
                    _selected = BasicModel[_type].value;
                break;
            case 'constellations':
                title = "星座"
                list = Enums.constellationsData;
                if (typeof (BasicModel[_type].value) !== 'string')
                    _selected = BasicModel[_type].value;
                break;
            case 'education':
                title = "学历"
                list = Enums.educationData;
                if (typeof (BasicModel[_type].value) !== 'string')
                    _selected = BasicModel[_type].value;
                break;
            case 'monthSalary':
                title = "收入"
                list = Enums.monthSalaryData;
                if (typeof (BasicModel[_type].value) !== 'string')
                    _selected = BasicModel[_type].value;
                break;
            case 'diet':
                title = "饮食"
                list = Enums.dietData;
                if (typeof (HabitModel[_type].value) !== 'string')
                    _selected = HabitModel[_type].value;
                break;
            case 'workAndRest':
                title = "作息"
                list = Enums.workAndRestData;
                if (typeof (HabitModel[_type].value) !== 'string')
                    _selected = HabitModel[_type].value;
                break;
            case 'lifeStyle':
                title = "放假休闲方式"
                list = Enums.lifeStyleData;
                if (typeof (HabitModel[_type].value) !== 'string')
                    _selected = HabitModel[_type].value;
                break;
            case 'houseWork':
                title = "家务习惯"
                list = Enums.houseWorkData;
                if (typeof (HabitModel[_type].value) !== 'string')
                    _selected = HabitModel[_type].value;
                break;
            case 'workStyle':
                title = "工作形式"
                list = Enums.workStyleData;
                if (typeof (HabitModel[_type].value) !== 'string')
                    _selected = HabitModel[_type].value;
                break;
            case 'workSystem':
                title = "工作制"
                list = Enums.workSystemData;
                if (typeof (HabitModel[_type].value) !== 'string')
                    _selected = HabitModel[_type].value;
                break;
            case 'consumptionView':
                title = "消费观"
                list = Enums.consumptionViewData;
                if (typeof (SenseWorthModel[_type].value) !== 'string')
                    _selected = SenseWorthModel[_type].value;
                break;
            case 'activeInFeeling':
                title = "感情态度"
                list = Enums.activeInFeelingData;
                if (typeof (SenseWorthModel[_type].value) !== 'string')
                    _selected = SenseWorthModel[_type].value;
                break;
            case 'waysOfTogether':
                title = "相处方式"
                list = Enums.waysOfTogetherData;
                if (typeof (SenseWorthModel[_type].value) !== 'string')
                    _selected = SenseWorthModel[_type].value;
                break;
        }
        this.state = {
            name: title,
            type: _type,
            List: list,
            SelectedItems: typeof (_selected) !== 'object' ? [] : _selected
        }
    }
    onSelect = (item) => {
        if (this.state.type === 'education' || this.state.type === 'monthSalary') {
            let mList = [];
            let source = this.state.type === 'education' ? Enums.educationData : Enums.monthSalaryData;
            source.forEach(edu => {
                if (parseInt(edu.key, 10) >= parseInt(item.key, 10)) {
                    mList.push(edu.key.toString());
                }
            })
            this.setState({
                SelectedItems: mList
            })
            return;
        }
        let _list = this.state.SelectedItems.slice();
        let _index = _list.findIndex(x => x === item.key);
        if (_index === -1) {
            _list.push(item.key.toString());
        } else {
            _list.splice(_index, 1);
        }
        this.setState({
            SelectedItems: _list
        })
    }
    save = () => {
        const { changeBasicModel, changeHabitModel, changeSenseWorthModel } = this.props.store.herfate;
        switch (this.state.type) {
            case 'figure':
            case 'occupation':
            case 'constellations':
            case 'education':
            case 'monthSalary':
                changeBasicModel(this.state.type, { value: this.state.SelectedItems.slice() });
                break;
            case 'diet':
            case 'workAndRest':
            case 'lifeStyle':
            case 'houseWork':
            case 'workStyle':
            case 'workSystem':
                changeHabitModel(this.state.type, { value: this.state.SelectedItems.slice() });
                break;
            case 'consumptionView':
            case 'activeInFeeling':
            case 'waysOfTogether':
                changeSenseWorthModel(this.state.type, { value: this.state.SelectedItems.slice() });
                break;
        }
        this.props.navigation.goBack();
    }
    renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => {
                this.onSelect(item)
            }} style={commonStyle.formRowItem_row}>
                <View style={commonStyle.formRowItem_row_left}>
                    <Text style={commonStyle.rowItem_left_text}>{item.value}</Text>
                </View>
                <View style={commonStyle.formRowItem_row_right}>
                    {this.state.SelectedItems.findIndex(x => x === item.key) !== -1 ? <Image source={require('../../../images/icon_correct.png')} resizeMode='contain' style={styles.rightarrow} /> : null}
                </View>
            </TouchableOpacity>)
    }
    _keyExtractor = (item) => {
        return item.key.toString();
    }
    render() {
        const { List } = this.state;
        return (
            <SafeAreaView style={[commonStyle.safeViewWithCusHead, { backgroundColor: '#eef2f5' }]}>
                <View style={styles.scrollViewContainer}>
                    <FlatList
                        data={List.slice()}
                        contentContainerStyle={{ paddingHorizontal: scaleSizeW(40) }}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this.renderItem}
                    />
                </View>
                <CustomizeHeader Title={this.state.name + `（可多选）`} goBack={() => {
                    const { removeLastLocation } = this.props.store.location;
                    removeLastLocation();
                    this.props.navigation.goBack()
                }}>
                    <RightButton>
                        <TouchableOpacity onPress={this.save}>
                            <Text style={commonStyle.rightbutton_text}>确认</Text>
                        </TouchableOpacity>
                    </RightButton>
                </CustomizeHeader>
            </SafeAreaView>
        )
    }
}

export default MultipleSelector

const styles = StyleSheet.create({
    scrollViewContainer: { flex: 1, marginTop: scaleSizeW(30), backgroundColor: '#fff', },
    item: {
        borderBottomColor: '#dedede',
        borderBottomWidth: scaleSizeW(1), paddingVertical: scaleSizeW(14), paddingHorizontal: scaleSizeW(18),
        flexDirection: "row", justifyContent: 'space-between'
    },
    itemtext: { fontSize: setSpText(32) },
    settingedit: { flex: 1 },
    buttons: {},
    rightarrow: {
        width: scaleSizeW(48), height: scaleSizeW(48)
    }

})