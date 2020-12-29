import React, { Component } from 'react'
import { Text } from 'react-native'
import * as utils from '../../tools/util'

class LogoImage extends Component {
    render() {
        return (<Text style={{ fontWeight: 'normal', color: '#1a1a1a', fontSize: utils.setSpText(48), marginLeft: utils.scaleSizeW(40) }}>{this.props.Title}</Text>);
    }
}

export default LogoImage;