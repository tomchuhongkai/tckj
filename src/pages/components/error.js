import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { observer, inject } from 'mobx-react'
import commonStyle from '../../tools/commonstyles'

@inject('store')
@observer
class ErrorInfo extends Component {
    constructor(props) {
        super(props)
    }
    // componentWillReact() {
    //     if (this.props.store.config.message !== '' && this.props.store.config.messageInterval === null) {
    //         let interval = setTimeout(() => {
    //             this.props.store.config.setMessage('');
    //         }, 2000);
    //         this.props.store.config.setMessageInterval(interval);
    //     }
    // }

    render() {
        if (this.props.store.config.message === '')
            return null;
        let _message = [commonStyle.message_common];
        let _message_text = [];
        switch (this.props.store.config.messageType) {
            case 'warning':
                _message.push(commonStyle.message_warning);
                _message_text.push(commonStyle.message_warning_text);
                break;
            case 'error':
                _message.push(commonStyle.message_error);
                _message_text.push(commonStyle.message_error_text);
                break;
            case 'success':
                _message.push(commonStyle.message_success);
                _message_text.push(commonStyle.message_success_text);
                break;
        }
        return <View style={commonStyle.errorContainer}>
            <View style={_message}>
            <Text style={_message_text}>{this.props.store.config.message}</Text>
        </View>
        </View>
    }
}

export default ErrorInfo;