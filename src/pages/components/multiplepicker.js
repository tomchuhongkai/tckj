import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, Dimensions } from 'react-native'
import { scaleSizeW, setSpText } from '../../tools/util';
import Modal from 'react-native-modal'
const deviceHeight = Platform.OS === "ios"
    ? Dimensions.get("window").height
    : Dimensions.get("screen").height;
const deviceWidth = Platform.OS === "ios"
    ? Dimensions.get("window").width
    : Dimensions.get("screen").width;
class MultiplePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Visible: false,
            key: props.keyName === undefined ? 'Value' : props.keyName,
            value: props.valueName === undefined ? 'Text' : props.valueName,
            SelectedValue: this.props.SelectedValue
        }
    }
    showPop = () => {
        this.setState({ Visible: true })

    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.SelectedValue !== this.props.SelectedValue) {
            this.setState({
                SelectedValue: nextProps.SelectedValue
            })
        }

    }
    render() {
        let firstItem = null;
        if (this.props.Items.length > 0) {
            let selectedItems = typeof (firstItem) === 'object' ? this.props.Items.filter(i => i[this.state.key] === this.state.SelectedValue)
                : this.props.Items.filter(i => i === this.state.SelectedValue);
            if (selectedItems.length > 0) {
                firstItem = selectedItems[0];
            }
        }
        let length = this.props.Items.length;
        let _height = 80 * length + 100;
        if (_height > 600) {
            _height = 600
        }
        let text = firstItem === null ? "" : typeof (firstItem) === 'object' ? firstItem[this.state.value] : firstItem;
        let v = firstItem === null ? "" : typeof (firstItem) === 'object' ? firstItem[this.state.key] : firstItem;
        let containStyle = [styles.item_line, styles.select_style, this.props.style === undefined ? null : this.props.style];
        let textStyle = [styles.item_text, { alignSelf: 'flex-start', color: '#9b9b9b' }, this.props.textStyle === undefined ? null : this.props.textStyle];
        return (
            <View>
                {this.props.renderButton === undefined ? <TouchableOpacity onPress={this.showPop}>
                    <View style={containStyle}>
                        <Text style={textStyle}>{text}</Text>
                        <Image source={require('../../../images/down.png')} style={[styles.dropIcon, this.props.iconStyle === undefined ? null : this.props.iconStyle]} />
                    </View>
                </TouchableOpacity> : this.props.renderButton(this.showPop, text, v, containStyle, textStyle)}
                <Modal deviceHeight={deviceHeight} deviceWidth={deviceWidth} style={{ bottom: scaleSizeW(-40), position: 'absolute', left: scaleSizeW(-40), width: '100%' }} isVisible={this.state.Visible} onBackdropPress={() => { this.setState({ Visible: false }) }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <View style={[styles.dialog, { height: scaleSizeW(_height) }]}>
                            <View style={styles.box_title}>
                                <View>
                                    <Text style={styles.box_title_text}>{this.props.title}</Text>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={() => this.setState({ Visible: false })} >
                                        <Image source={require('../../../images/close.png')} style={{ width: scaleSizeW(31), height: scaleSizeW(31) }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <FlatList
                                contentContainerStyle={{ alignItems: 'flex-start', alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap' }}
                                data={this.props.Items}
                                extraData={this.props}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={this._keyExtractor}
                                renderItem={this._renderItem}>
                            </FlatList>
                            {/* <View style={styles.dialog_title}>
                                <TouchableOpacity style={styles.dialog_closeBtn} onPress={() => this.setState({ Visible: false })} >
                                    <Text style={{ color: '#fff', fontSize: setSpText(30), alignSelf: 'center' }}>确认</Text>
                                </TouchableOpacity>
                            </View> */}
                        </View>
                    </View>
                </Modal>
            </View>)
    }
    _keyExtractor = (item, index) => {
        return index.toString();
    }
    _renderItem = ({ item }) => {
        let that = this;
        let v = typeof (item) === 'object' ? item[this.state.key] : item;
        let _list = this.props.value.split(",");
        let _index = _list.findIndex(x => x === item[this.state.value]);
        if (v.toString() === '0')
            return null
        return (
            <TouchableOpacity onPress={() => {
                console.log('item', v);
                that.props.onMultipleChange(v, item)
            }
            } >
                <View style={_index === -1 ? styles.item_line : styles.item_linesel}>
                    <Text style={_index === -1 ? styles.item_text : styles.item_textsel}>{typeof (item) === 'object' ? item[this.state.value] : item}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

export default MultiplePicker;

const styles = StyleSheet.create({
    box_title:{
        display:'flex',
        justifyContent:'space-between',
        flexDirection:'row',
        alignItems:'center',
        paddingBottom:scaleSizeW(30),
        borderBottomWidth:scaleSizeW(1),
        borderColor:'#dedede',
        marginBottom:scaleSizeW(30)
    },
    box_title_text:{
        fontSize:scaleSizeW(30)
    },
    dialog: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: scaleSizeW(10),
        paddingVertical: scaleSizeW(30),
        paddingHorizontal: scaleSizeW(30),
        position: 'relative',
    },
    dialog_title: {
        height: scaleSizeW(100),
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dialog_closeBtn: {
        width: '90%',
        backgroundColor: '#ec5947',
        borderWidth: scaleSizeW(1),
        borderColor: '#ec5947',
        borderRadius: scaleSizeW(10),
        height: scaleSizeW(70),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    item_line: {
        height: scaleSizeW(60),
        lineHeight: scaleSizeW(80),
        borderRadius: scaleSizeW(10),
        backgroundColor: '#eee',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scaleSizeW(20),
        marginBottom: scaleSizeW(20),
        paddingHorizontal: scaleSizeW(40),
        borderBottomColor: '#eee',
        borderBottomWidth: scaleSizeW(1)
    },
    item_linesel: {
        height: scaleSizeW(60),
        lineHeight: scaleSizeW(80),
        borderRadius: scaleSizeW(10),
        flexDirection: 'column',
        alignItems: 'center',
        marginRight: scaleSizeW(20),
        marginBottom: scaleSizeW(20),
        paddingHorizontal: scaleSizeW(40),
        justifyContent: 'center',
        borderBottomColor: '#eee',
        backgroundColor: '#4576f7',
        borderBottomWidth: scaleSizeW(1)
    },
    item_text: {
        fontSize: scaleSizeW(28),
        color: '#000',
    },
    item_textsel: {
        fontSize: scaleSizeW(28),
        color: '#fff',
    },
    select_style: {
        alignItems: 'flex-start',
        borderBottomColor: '#ccc', borderBottomWidth: 1,

        height: scaleSizeW(70),
        position: 'relative'
    },
    dropIcon: {
        width: scaleSizeW(30),
        height: scaleSizeW(18),
        position: 'absolute',
        right: scaleSizeW(10),
        bottom: scaleSizeW(40)
    }
})