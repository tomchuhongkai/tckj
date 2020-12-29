import React, { Component } from 'react'
import { StyleSheet, View, PanResponder, Text, Dimensions } from 'react-native'
import { scaleSizeW,setSpText } from '../../tools/util'

let roundSize = 30  // 圆的大小
let width = 0; // 设备宽度
let _prevLeft = 0;
export default class AreaMove extends Component {

    constructor(props) {
        super(props)
        let that = this;
        let data = this.setValue(props);
        this.state = data;
        global.AreaMove = {
            resetProps: (_props) => {
                let _data = that.setValue(_props);
                _data = Object.assign({}, this.state, _data);
                that.setState(_data)
            }
        }
    }
    setValue = (props) => {
        if (props.left !== undefined) {
            _prevLeft = props.left;
        }
        if (props.circleR !== undefined) {
            roundSize = props.circleR;
        }
        let _v = props.value;
        let _start = 0;
        let _end = width;
        let _startName = props.min;
        let _endName = props.max;
        if (width != 0) {
            let _realWidth = width-roundSize;
            if (_v !== undefined && _v !== null && _v !== "") {
                var args = _v.split('_');
                if (args.length === 2) {
                    _startName = parseInt(args[0], 10);
                    _endName = parseInt(args[1], 10);
                    _start = (_startName - props.min) * _realWidth / (props.max - props.min);
                    _start = parseInt(_start, 10);
                    if (_start < 0) {
                        _start = 0;
                    }

                    _end = (_endName - props.min) * _realWidth / (props.max - props.min);
                    _end = parseInt(_end, 10);
                    if (_end > _realWidth) {
                        _end = _realWidth;
                    }
                }
            }
        }
        return {
            start: _start, // 起始坐标
            end: _end, // 结束坐标
            endPrice: _endName,//'220',  // 结束价格
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
                let { end, range } = this.state
                let start = gestureState.moveX - _prevLeft // 当前拖动所在的坐标
                let _realWidth = width - roundSize;
                if (start < 0) {  // 到起始阀值，置为0
                    start = 0
                }
                if (end < start) {  // 保证开始价格不会超过结束价格
                    start = end - (roundSize / 2)
                }
                if (start > width - roundSize) { // 保证开始价格不会超过最大值
                    start = width - roundSize
                }
                let startPrice = parseInt(((this.props.max - this.props.min) / _realWidth) * start + this.props.min, 10)// 计算开始价格显示值
                this.setState({
                    start,
                    startPrice
                })
            },
            onPanResponderRelease: (evt, gestureState) => true,
            onPanResponderTerminate: (evt, gestureState) => true,
        })
        this.panResponderEnd = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {
                this.forceUpdate()
            },
            onPanResponderMove: (evt, gestureState) => { // 结束的拖动事件
                let { start, range } = this.state
                let end = gestureState.moveX - _prevLeft - (roundSize / 2)
                let _realWidth = width - roundSize;
                if (end < start) {
                    end = start + (roundSize / 2)
                }
                if (end > width - roundSize) {
                    end = width - roundSize;
                }
                let endPrice = parseInt(((this.props.max - this.props.min) / _realWidth) * end + this.props.min, 10)
                this.setState({
                    end,
                    endPrice
                })
            },
            onPanResponderRelease: (evt, gestureState) => () => {
                return true;
            },
            onPanResponderTerminate: (evt, gestureState) => () => {
                return true;
            },
        })
    }

    render() {
        let { start, end, range, startPrice, endPrice } = this.state;
        let _left = this.state.LeftLabelWidth === undefined ? 0 : this.state.LeftLabelWidth;
        _left = _left - parseInt(roundSize / 2, 10);
        let _right = this.state.RightLabelWidth === undefined ? 0 : this.state.RightLabelWidth;
        _right = _right - parseInt(roundSize / 2, 10);
        let _leftStyle = { position: 'absolute', top: 0, left: start - _left };
        let _rightStyle = { position: 'absolute', top: 0, left: end - _right };
        if (this.props.LeftLabelStyle !== undefined) {
            _leftStyle = Object.assign({}, _leftStyle, this.props.LeftLabelStyle);
        }
        if (this.props.RightLabelStyle !== undefined) {
            _rightStyle = Object.assign({}, _rightStyle, this.props.RightLabelStyle);
        }
        let circleCommonStyle = {
            width: roundSize,
            height: roundSize,
            borderRadius: roundSize / 2,
            bottom: scaleSizeW(90) - parseInt((roundSize / 4), 10)
        }
        return (
            <View style={styles.container}>
                {/* left label */}
                <View style={[_leftStyle]}>
                    <View style={styles.triangle_container}>
                        <View style={styles.triangle}></View>
                    </View>
                    <View style={styles.label} onLayout={(event) => {
                        this.setState({
                            LeftLabelWidth: parseInt(event.nativeEvent.layout.width / 2, 10)
                        })
                    }}><Text style={styles.label_text}>{startPrice}{this.props.unit}</Text></View>
                </View>
                {/* right label */}
                <View style={[_rightStyle]}>
                    <View style={styles.triangle_container}>
                        <View style={styles.triangle}></View>
                    </View>
                    <View style={styles.label} onLayout={(event) => {
                        this.setState({
                            RightLabelWidth: parseInt(event.nativeEvent.layout.width / 2, 10)
                        })
                    }}><Text style={styles.label_text}>{endPrice}{this.props.unit}</Text></View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    {/* <View style={[styles.progressContainer, { backgroundColor: '#eee' }, { width: start }]}></View> */}
                    <View onLayout={(event) => {
                        width = event.nativeEvent.layout.width;
                        let data = this.setValue(this.props);
                        this.setState(data);
                    }} style={[styles.progressContainer, { backgroundColor: '#eee' }, { flex: 1 }]}></View>
                    <View style={[styles.progressContainer, { position: 'absolute', width: end - start - roundSize, left: start + roundSize }]}></View>
                </View>
                {/* 左边 */}
                {this.props.disabled ? <View style={[styles.circle, circleCommonStyle, {
                    left: start,
                    backgroundColor: '#eee'
                }]}>
                </View> : <View onTouchEnd={() => {
                    this.props.onChange(`${this.state.startPrice}_${this.state.endPrice}`)
                }} style={[styles.circle, circleCommonStyle, {
                    left: start,
                }]} {...this.panResponderStart.panHandlers}>
                    </View>}
                {/* 右边 */}
                {this.props.disabled ? <View style={[styles.circle, circleCommonStyle, { left: end }]}>
                </View> : <View onTouchEnd={() => {
                    this.props.onChange(`${this.state.startPrice}_${this.state.endPrice}`)
                }} style={[styles.circle, circleCommonStyle, { left: end }]} {...this.panResponderEnd.panHandlers}>
                    </View>}

                    <View style={styles.footer}>
                    <View><Text style={styles.footer_text}>{this.props.min}{this.props.unit}</Text></View>
                    <View><Text style={styles.footer_text}>{(this.props.min + this.props.max) / 2}{this.props.unit}</Text></View>
                    <View><Text style={styles.footer_text}>{this.props.max}{this.props.unit}</Text></View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: scaleSizeW(250),
        justifyContent: 'flex-end',
        backgroundColor: '#fff',
        paddingBottom: scaleSizeW(30),
    },
    progressContainer: {
        backgroundColor: '#fc4185',
        height: scaleSizeW(16),
        borderRadius: scaleSizeW(8),
        marginBottom: scaleSizeW(60)
    },
    circle: {
        position: 'absolute',
        borderColor: '#eee',
        shadowColor: 'rgba(0,0,0,0.6)',
        shadowRadius: 5,
        shadowOpacity: 0.9,
        backgroundColor: '#fc4185'
    },
    label: {
        backgroundColor: '#fc4185',
        paddingTop: scaleSizeW(5),
        paddingBottom: scaleSizeW(5),
        paddingLeft: scaleSizeW(30),
        paddingRight: scaleSizeW(30),
        width:scaleSizeW(160),
        borderRadius: scaleSizeW(30),
    },
    label_text: {
        color: '#fff',
        fontSize: setSpText(28),
        alignSelf:'center'
    },
    triangle_container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: scaleSizeW(40),
        zIndex: 0,
        width: '100%'
    },
    triangle: {
        width: scaleSizeW(20),
        height: scaleSizeW(20),
        backgroundColor: '#fc4185',
        transform: [{ rotate: '45deg' }],
    },footer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: scaleSizeW(60),
        width: '100%',
        position: 'absolute',
        bottom: 0
    },
    footer_text: {
        fontSize: setSpText(24),
        color: '#000'
    }
})