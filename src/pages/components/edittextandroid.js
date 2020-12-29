import React, { Component } from 'react'
import { requireNativeComponent, DeviceEventEmitter, UIManager, findNodeHandle, PixelRatio } from 'react-native'
import { PropTypes } from 'prop-types';
import { setSpText } from '../../tools/util';
var MyEditText = requireNativeComponent('RCTEditText');
const _defaultSize = setSpText(30);

class EditTextAndroid extends React.Component {
    UNSAFE_componentWillMount = () => {
        let that = this;
        this._myOnChange = DeviceEventEmitter.addListener('onChange', (data) => {
            if (this.props.onChange !== undefined) {
                this.props.onChange(data);
            }
        })
        this._myOnFocus = DeviceEventEmitter.addListener('onFocus', (data) => {
            if (this.props.onFocus !== undefined)
                this.props.onFocus(data);
        })
        this._myOnSubmit = DeviceEventEmitter.addListener('onSubmit', (data) => {
            if (this.props.onSubmit !== undefined)
                this.props.onSubmit(data);
        })
    }
    componentDidMount = () => {
        // global.Emoji = {
        //     Add: this.sendEmoji,
        //     DismissKeyboard: this.dismissKeyboard,
        //     ClearText: this.clearText,
        //     DeleteText: this.deleteText,
        // }
    }
    sendEmoji = (emojiName) => {
        var view = this.myRef
        UIManager.dispatchViewManagerCommand(findNodeHandle(view),
            UIManager.RCTEditText.Commands.addEmoji, [{ 'emoji': emojiName }, { 'imageWidth': 50 }]);
    }
    dismissKeyboard = () => {
        var view = this.myRef
        UIManager.dispatchViewManagerCommand(findNodeHandle(view),
            UIManager.RCTEditText.Commands.dismissKeyboard, []);
    }
    clearText = () => {
        var view = this.myRef
        UIManager.dispatchViewManagerCommand(findNodeHandle(view),
            UIManager.RCTEditText.Commands.clearText, []);
    }
    deleteText = () => {
        var view = this.myRef
        UIManager.dispatchViewManagerCommand(findNodeHandle(view),
            UIManager.RCTEditText.Commands.deleteItem, []);
    }
    render() {
        return <MyEditText ref={(element)=>{this.myRef=element}} {...this.props} />
    }
    componentWillUnmount = () => {
        if (this._myOnChange)
            this._myOnChange.remove();
        if (this._myOnFocus)
            this._myOnFocus.remove();
        if (this._myOnSubmit)
            this._myOnSubmit.remove();

        // if (global.Emoji !== null) {
        //     global.Emoji = null;
        // }
    }
}
EditTextAndroid.propTypes = {
    onSubmit: PropTypes.func,
    onFocus: PropTypes.func,
    width: PropTypes.number,
    style: PropTypes.object
}

export default EditTextAndroid