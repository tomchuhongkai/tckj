import React, { Component } from 'react'
import { StyleSheet, View, PanResponder, Text, Dimensions } from 'react-native'
import { scaleSizeW, setSpText } from '../../tools/util'

let roundSize = 30  // 圆的大小
let width = 0; // 设备宽度
let _prevLeft = 0;
export default class PointMove extends Component {
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
        if (props.left !== undefined) {
            _prevLeft = props.left;
        }
        if (props.circleR !== undefined) {
            roundSize = props.circleR;
        }
        let _v = props.value;
        let _start = 0;
        let _startName = props.min;
        if (width != 0) {
            let _realWidth = width - roundSize;
            if (_v !== undefined && _v !== null && _v !== "") {
                _startName = parseInt(_v, 10);
                _start = (_startName - props.min) * _realWidth / (props.max - props.min);
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
                let _realWidth = width - roundSize;
                if (!this.props.disabled) {
                    let start = gestureState.moveX - _prevLeft // 当前拖动所在的坐标
                    if (start < 0) {  // 到起始阀值，置为0
                        start = 0
                    }

                    if (start > width - roundSize) { // 保证开始价格不会超过最大值
                        start = width - roundSize
                    }
                    let startPrice = parseInt(((this.props.max - this.props.min) / _realWidth) * start + this.props.min, 10)// 计算开始价格显示值
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
        let _left = this.state.labelWidth === undefined ? 0 : this.state.labelWidth;
        _left = _left - parseInt(roundSize / 2, 10);
        let labelStyle = { position: 'absolute', top: 0, left: start - _left };
        if (this.props.labelStyle !== undefined) {
            labelStyle = Object.assign({}, labelStyle, this.props.labelStyle);
        }
        let circleCommonStyle = {
            width: roundSize,
            height: roundSize,
            borderRadius: roundSize / 2,
            bottom: scaleSizeW(90) - parseInt((roundSize / 4), 10)
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
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    {/* <View style={[styles.progressContainer, { backgroundColor: '#eee' }, { width: start }]}></View> */}
                    <View onLayout={(event) => {
                        width = event.nativeEvent.layout.width;
                        let data = this.setValue(this.props);
                        this.setState(data);
                    }} style={[styles.progressContainer, { backgroundColor: '#eee' }, { flex: 1 }]}></View>
                </View>
                {/* 左边 */}
                {this.props.disabled ? <View style={[styles.circle, circleCommonStyle, {
                    left: start,
                    backgroundColor: '#eee'
                }]}>
                </View> : <View onTouchEnd={() => {
                    this.props.onChange(`${this.state.startPrice}`)
                }} style={[styles.circle, circleCommonStyle, {
                    left: start,
                }]} {...this.panResponderStart.panHandlers}>
                    </View>}

                <View style={styles.footer}>
                    <View style={styles.footer_left}>
                        <View>
                            <Text style={styles.footer_text}>{this.props.min}{this.props.unit}</Text>
                        </View>
                        {this.props.showDesc?<View style={{paddingBottom: scaleSizeW(10)}}>
                            <Text style={[styles.footer_text, { fontSize: setSpText(20) }]}>非常不希望</Text>
                        </View>:null}
                    </View>
                    <View style={styles.footer_center}>
                        <View>
                            <Text style={styles.footer_text}>{(this.props.min + this.props.max) / 2}{this.props.unit}</Text>
                        </View>
                        {this.props.showDesc?<View style={{paddingBottom: scaleSizeW(10)}}>
                            <Text style={[styles.footer_text, { fontSize: setSpText(20)}]}>无所谓</Text>
                        </View>:null}
                    </View>
                    <View style={styles.footer_right}>
                        <Text style={styles.footer_text}>{this.props.max}{this.props.unit}</Text>
                        {this.props.showDesc?<View style={{paddingBottom: scaleSizeW(10)}}>
                            <Text style={[styles.footer_text, { fontSize: setSpText(20) }]}>非常希望</Text>
                        </View>:null}
                    </View>
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
        position: 'relative'
    },
    label: {
        backgroundColor: '#fc4185',
        paddingTop: scaleSizeW(5),
        paddingBottom: scaleSizeW(5),
        paddingLeft: scaleSizeW(30),
        paddingRight: scaleSizeW(30),
        width: scaleSizeW(160),
        borderRadius: scaleSizeW(30),
    },
    label_text: {
        color: '#fff',
        fontSize: setSpText(28),
        alignSelf: 'center'
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
        shadowColor: 'rgba(0,0,0,0.8)',
        shadowRadius: 5,
        shadowOpacity: 0.9,
        backgroundColor: '#fc4185'
    },
    footer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: scaleSizeW(70),
        width: '100%',
        position: 'absolute',
        bottom: 0
    },
    footer_text: {
        fontSize: setSpText(24),
        color: '#000'
    },
    footer_left: {
        flexDirection: 'column',
        alignItems: "flex-start",
    },
    footer_center: {
        flexDirection: 'column',
        alignItems: "center",
    },
    footer_right: {
        flexDirection: 'column',
        alignItems: "flex-end",
    }
})