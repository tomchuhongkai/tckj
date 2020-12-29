import React from 'react'
import { View, Text } from 'react-native'
import commonStyle from '../../tools/commonstyles'

class Empty extends React.Component {
    render() {
        let { Message,Loaded } = this.props;
        return (<View style={commonStyle.loding}><View style={commonStyle.loading_info}><Text style={commonStyle.loading_text}>
            {Loaded!==undefined && Loaded ? Message === undefined ? "还未有朋友消息哦~" : Message : "加载中，请稍后..."}</Text></View></View>)
    }
}

export default Empty