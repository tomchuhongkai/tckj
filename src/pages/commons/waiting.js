import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, StatusBar } from 'react-native'
import { scaleSizeW, setSpText } from '../../tools/util'
import { ProgressBar } from '@react-native-community/progress-bar-android';

class Waiting extends Component {
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            progress: 0.2,
            loading: true,
            progressBar: true
        };
    }
    UNSAFE_componentWillMount() {
        // StatusBar.setNetworkActivityIndicatorVisible(true);
        // StatusBar.setBarStyle('light-content')

    }
    componentDidMount() {
        this.timer = setInterval(() => {
            let random = Math.random() * 0.2;
            let progress = this.state.progress + random;
            if (progress >= 0.9) {
                progress = 0.9;
            }
            this.setState({ progress });
        }, 100);
    }
    componentWillUnmount = () => {
        if (this.timer !== null) {
            clearTimeout(this.timer)
            this.timer = null;
        }
    }
    callBack = () => {
        if (this.props.callBack != undefined) {
            this.props.callBack();
        }
    }
    render() {
        return (<ProgressBar style={{ marginTop: scaleSizeW(-12) }} animating={this.props.show} styleAttr="Horizontal" color={'#eb5946'} progress={this.state.progress} indeterminate={false} />)
    }
}

export default Waiting