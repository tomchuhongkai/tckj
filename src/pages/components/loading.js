import React, { Component } from 'react'
import { View, Text, Image, ProgressBarAndroid, StatusBar } from 'react-native'
import { observer, inject } from 'mobx-react'
import commonStyle from '../../tools/commonstyles';
import { ProgressBar } from '@react-native-community/progress-bar-android';
@inject('store')
@observer
class Loading extends Component {
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            progress: 0,
            progressBar: true
        };
    }
    componentDidMount = () => {
        this.timer = setInterval(() => {
            let random = Math.random() * 0.2;
            let progress = this.state.progress + random;
            if (progress > 0.99) {
                progress = 0.99;
            }
            this.setState({ progress });
        }, 100);
    }
    componentWillUnmount = () => {
        clearInterval(this.timer);
        this.timer = null;
    }
    render() {
        let _style=[];
        if(this.props.style!==undefined){
            _style.push(this.props.style);
        }
        return (<View style={_style}><ProgressBar animating={this.props.show} styleAttr="Horizontal" color={'#4576f7'} progress={this.state.progress} indeterminate={false} /></View>)
    }
}

export default Loading;