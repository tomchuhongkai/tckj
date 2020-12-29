import React, { Component } from 'react'
import { StyleSheet, View, Image, PanResponder, Text, Dimensions } from 'react-native'
import {  scaleSizeW, setSpText } from '../../tools/util'
const ruleImage = require('../../../images/rule.png')

let roundSize = 30  // 圆的大小
let height = scaleSizeW(640); // 设备高度
let width = scaleSizeW(380);
let _prevTop = 0;
export default class VerticalPointMove extends Component {
    constructor(props) {
        super(props)
        let that = this;
        let data = this.setValue(props);
        this.state = data;
        global.PointMove = {
            resetProps: (_props) => {
                let _data = that.setValue(_props);
                _data = Object.assign({}, this.state, _data);
                that.setState(_data)
            }
        }
    }
    setValue = (props) => {
        if (props.top !== undefined) {
            _prevTop = props.top;
        }
        if (props.circleR !== undefined) {
            roundSize = props.circleR;
        }
        let _v = props.value;
        let _start = 0;
        let _startName = props.min;
        if (height != 0) {
            let _realHeight = height;
            if (_v !== undefined && _v !== null && _v !== "") {
                _startName = parseInt(_v, 10);
                _start = (props.max - _startName) * _realHeight / (props.max - props.min)
                _start = parseInt(_start, 10);
                if (_start < 0) {
                    _start = 0;
                }
            }
        }
        return {
            start: _start, // 起始坐标
            startPrice: _startName,//'150' // 起始价格
        }
    }

    UNSAFE_componentWillMount() {
        this.panResponderStart = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {
                this.forceUpdate()
            },
            onPanResponderMove: (evt, gestureState) => { // 开始的拖动事件
                let { end, range } = this.state;
                let _realHeight = height;
                if (!this.props.disabled) {
                    let start = gestureState.moveY - _prevTop // 当前拖动所在的坐标
                    if (start < 0) {  // 到起始阀值，置为0
                        start = 0
                    }

                    if (start > _realHeight) { // 保证开始价格不会超过最大值
                        start = _realHeight
                    }
                    let startPrice = this.props.max - parseInt(((this.props.max - this.props.min) / _realHeight) * start, 10)
                    //let startPrice = parseInt(((this.props.max - this.props.min) / _realHeight) * start + this.props.min, 10)// 计算开始价格显示值
                    this.setState({
                        start,
                        startPrice
                    })
                }
            },
            onPanResponderRelease: (evt, gestureState) => true,
            onPanResponderTerminate: (evt, gestureState) => true,
        })
    }

    render() {
        let { start, startPrice } = this.state;
        let halfRound = parseInt(roundSize / 2, 10);
        let _left = this.state.labelWidth === undefined ? 0 : this.state.labelWidth;
        _left = _left - parseInt(roundSize / 2, 10);
        let labelStyle = { position: 'absolute', top: start - scaleSizeW(10) - halfRound, left: 0 };
        if (this.props.labelStyle !== undefined) {
            labelStyle = Object.assign({}, labelStyle, this.props.labelStyle);
        }
        let circleCommonStyle = {
            width: roundSize,
            height: roundSize,
            borderRadius: roundSize / 2
        }
        return (
            <View style={[styles.container, this.props.style === undefined ? null : this.props.style]}>

                <View style={[labelStyle]}>
                    <View style={styles.triangle_container}>
                        <View style={styles.triangle}></View>
                    </View>
                    <View style={styles.label} onLayout={(event) => {
                        this.setState({
                            labelWidth: parseInt(event.nativeEvent.layout.width / 2, 10)
                        })
                    }}><Text style={styles.label_text}>{startPrice}{this.props.unit}</Text></View>
                </View>
                <View style={[styles.progressContainer]}></View>

                <View style={styles.footer}>
                    <Image source={ruleImage} style={{ width: scaleSizeW(177), height: scaleSizeW(645) }} />
                    {/* <View><Text style={styles.footer_text}>{this.props.min}{this.props.unit}</Text></View>
                    <View><Text style={styles.footer_text}>{(this.props.min + this.props.max) / 2}{this.props.unit}</Text></View>
                    <View><Text style={styles.footer_text}>{this.props.max}{this.props.unit}</Text></View> */}
                </View>
                {/* 圆圈 */}
                {this.props.disabled ? <View style={[styles.circle, circleCommonStyle, {
                    top: start - halfRound,
                    right: scaleSizeW(130),
                    backgroundColor: '#eee'
                }]}>
                </View> : <View onTouchEnd={() => {
                    this.props.onChange(`${this.state.startPrice}`)
                }} style={[styles.circle, circleCommonStyle, {
                    top: start - halfRound,
                    right: scaleSizeW(127) - (scaleSizeW(40) / 4),
                }]} {...this.panResponderStart.panHandlers}>
                        <View style={styles.circlePoint}></View>
                    </View>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: height,
        width: width,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor: '#fff',
        position: 'relative',
        paddingRight: scaleSizeW(130)
        // backgroundColor:'#dcdcdc'
    },
    label: {
        backgroundColor: '#fc4185',
        paddingTop: scaleSizeW(5),
        paddingBottom: scaleSizeW(5),
        paddingLeft: scaleSizeW(40),
        paddingRight: scaleSizeW(40),
        borderRadius: scaleSizeW(30),
    },
    label_text: {
        color: '#fff',
        fontSize: setSpText(28)
    },
    triangle_container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: scaleSizeW(14),
        right: -scaleSizeW(80),
        zIndex: 0,
        width: '100%'
    },
    triangle: {
        width: scaleSizeW(20),
        height: scaleSizeW(20),
        backgroundColor: '#fc4185',
        transform: [{ rotate: '45deg' }],
    },
    progressContainer: {
        backgroundColor: '#fff',
        width: scaleSizeW(16),
        borderRadius: scaleSizeW(8),
        height: height
    },
    circlePoint: {
        width: scaleSizeW(10),
        height: scaleSizeW(10),
        borderRadius: scaleSizeW(5),
        backgroundColor: '#fff'
    },
    circle: {
        position: 'absolute',
        borderColor: '#eee',
        shadowColor: 'rgba(0,0,0,0.8)',
        shadowRadius: 5,
        shadowOpacity: 0.9,
        backgroundColor: '#fc4185',
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex'
    },
    footer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: height,
        width: scaleSizeW(100),
        position: 'absolute',
        right: 0,
        top: 0
    },
    footer_text: {
        fontSize: setSpText(24),
        color: '#000'
    }
})