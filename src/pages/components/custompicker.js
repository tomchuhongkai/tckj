import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, Dimensions } from 'react-native'
import { scaleSizeW, setSpText } from '../../tools/util';
import Modal from 'react-native-modal'
const deviceHeight = Platform.OS === "ios"
    ? Dimensions.get("window").height
    : Dimensions.get("screen").height;
class CustomPicker extends Component {
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
                <Modal deviceHeight={deviceHeight} isVisible={this.state.Visible} onBackdropPress={() => { this.setState({ Visible: false }) }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <View style={[styles.dialog, { height: scaleSizeW(_height) }]}>
                        <View style={{position:'absolute',right:10,top:10}}>
                    <TouchableOpacity onPress={() => this.setState({ Visible: false })} >
                        <Image source={require('../../../images/clearbox.png')} style={{width:scaleSizeW(31),height:scaleSizeW(31)}} />
                      </TouchableOpacity>
                      </View>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ flexGrow: 1, alignItems: 'flex-start', alignSelf: 'center' }}
                                data={this.props.Items}
                                extraData={this.props}
                                keyExtractor={this._keyExtractor}
                                renderItem={this._renderItem}>
                            </FlatList>
                            {/* <View style={styles.dialog_title}>
                                <TouchableOpacity style={styles.dialog_closeBtn} onPress={() => this.setState({ Visible: false })} >
                                    <Text style={{ color: '#fff', fontSize: setSpText(30), alignSelf: 'center' }}>关闭</Text>
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
        if (v.toString() === '0')
            return null
        return (
            <TouchableOpacity onPress={() => {
                this.setState({ Visible: false },()=>{
                    setTimeout(()=>{
                        that.props.onChange(v, item)
                    },300)
                });
                    
            }} ><View style={styles.item_line}>
                <Text style={styles.item_text}>{typeof (item) === 'object' ? item[this.state.value] : item}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

export default CustomPicker;

const styles = StyleSheet.create({
    dialog: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: scaleSizeW(10),
        paddingVertical: scaleSizeW(15),
        paddingHorizontal: scaleSizeW(15),
        paddingTop: scaleSizeW(60),
        position: 'relative',
        paddingBottom: scaleSizeW(40)
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
        height: scaleSizeW(80),
        width:scaleSizeW(600),
        lineHeight: scaleSizeW(80),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor:'#eee',
        borderBottomWidth:scaleSizeW(1)
    },
    item_text: {
        fontSize: scaleSizeW(28),
        color: '#000',
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