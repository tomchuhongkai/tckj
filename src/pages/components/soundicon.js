import React, { PureComponent } from 'react'
import { Animated, View, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import Sound from 'react-native-sound';
import { Toast } from './tools/tool'
import { scaleSizeW,setSpText } from '../../tools/util'

class SoundIcon extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            opacityOne: new Animated.Value(0),
            opacityTwo: new Animated.Value(0),
            opacityThree: new Animated.Value(1),
            isStarted: false
        }
    }
    componentDidMount = () => {
        this.onAnimation = Animated.sequence([
            Animated.timing(this.state.opacityThree, {
                toValue: 0,
                duration: 0,
            }),
            Animated.timing(this.state.opacityTwo, {
                toValue: 0,
                duration: 0,
            }),
            Animated.timing(this.state.opacityOne, {
                toValue: 1,
                duration: 100,
            }),
            Animated.delay(200),
            Animated.timing(this.state.opacityTwo, {
                toValue: 1,
                duration: 100,
            }),
            Animated.timing(this.state.opacityOne, {
                toValue: 0,
                duration: 0,
            }),
            Animated.delay(200),
            Animated.timing(this.state.opacityThree, {
                toValue: 1,
                duration: 100,
            }),
            Animated.timing(this.state.opacityTwo, {
                toValue: 0,
                duration: 0,
            }),
            Animated.delay(200)
        ]);
    }
    onStart = () => {
        if (!this.state.isStarted) {
            Animated.loop(this.onAnimation).start();
            this.setState({
                isStarted: true
            })
        }
    }
    onEnd = () => {
        if (this.state.isStarted) {
            Animated.loop(this.onAnimation).stop();
            Animated.timing(this.state.opacityThree, {
                toValue: 1,
                duration: 100,
            }).start();
            this.setState({
                isStarted: false
            })
        }
    }
    _play = (audio) => {
        let that = this;
        if (this.Sound !== undefined && this.Sound !== null) {
            this.Sound.stop();
            this.Sound.release();
            this.Sound = null;
            that.onEnd();
        }
        // These timeouts are a hacky workaround for some issues with react-native-sound.
        // See https://github.com/zmxv/react-native-sound/issues/89.
        var sound = new Sound(audio, '', (error) => {
            if (error) {
                let _error = error.message;
                if (_error === "resource not found") {
                    _error = "内容丢失"
                }
                Toast.info(`${_error}`);
                this.onEnd();
            } else {
                sound.play((success) => {
                    if (success) {
                        //结束
                    } else {

                    }
                    //无论失败成功  都结束timer
                    sound.release();
                    this.onEnd();
                });
            }
        });
        this.Sound = sound;
        that.onStart()
    }
    render() {
        return (
            <Animated.View>
                <TouchableOpacity onPress={() => {
                    if (this.props.audio === undefined) {
                        Alert.alert('Audio is not existed')
                        return;
                    }
                    this._play(this.props.audio)
                }} style={styles.container}>
                    {this.props.images.map((image, index) => {
                        let opacity = new Animated.Value(0);
                        switch (index) {
                            case 0:
                                opacity = this.state.opacityOne;
                                break;
                            case 1:
                                opacity = this.state.opacityTwo;
                                break;
                            case 2:
                                opacity = this.state.opacityThree;
                                break;
                        }
                        return (<Animated.Image key={index}
                            source={image}
                            style={
                                [
                                    styles.image,
                                    {
                                        opacity: opacity
                                    }
                                ]
                            }>
                        </Animated.Image>)
                    })}
                </TouchableOpacity>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: scaleSizeW(32),
        height: scaleSizeW(32),
        position: 'relative'
    },
    image: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1,
        width: scaleSizeW(32),
        height: scaleSizeW(32),
    }
})

export default SoundIcon