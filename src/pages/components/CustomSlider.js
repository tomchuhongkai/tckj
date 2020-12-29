import React, { Component } from 'react'
import { StyleSheet, View, Text, Dimensions, Image } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { scaleSizeW,setSpText } from '../../tools/util';

class CustomMarker extends React.Component {
    render() {
        return (
            <Image
                style={{ width: scaleSizeW(40), height: scaleSizeW(40) }}
                source={
                    this.props.pressed ? require('../../../images/circle-active.png') : require('../../../images/circle-inactive.png')
                }
                resizeMode="contain"
            />
        );
    }
}

class Item extends Component {
    render() {
        return (
            <View>
                <Text style={[this.checkActive() ? styles.active : styles.inactive]}>{this.props.value}</Text>
                <Text style={[this.checkActive() ? styles.line : {}]}> {this.checkActive() ? '|' : ''}</Text>
            </View>
        );
    }

    checkActive = () => {
        if (this.props.value >= this.props.first && this.props.value <= this.props.second)
            return true
        else
            return false
    }
}

class CustomSlider extends Component {

    constructor(props) {
        super(props);
        this.state = {
            multiSliderValue: [this.props.min, this.props.max],
            first: this.props.min,
            second: this.props.max,
        }
    }

    render() {
        return (
            <View>
                <View style={[styles.column, { marginLeft: this.props.LRpadding, marginRight: this.props.LRpadding }]}>
                    {this.renderScale()}
                </View>
                <View style={[styles.container, { marginLeft: this.props.LRpadding, marginRight: this.props.LRpadding }]}>
                    <MultiSlider
                        trackStyle={{ backgroundColor: '#bdc3c7' }}
                        selectedStyle={{ backgroundColor: "#5e5e5e" }}
                        values={this.props.single ?
                            [this.state.multiSliderValue[1]] :
                            [this.state.multiSliderValue[0], this.state.multiSliderValue[1]]}
                        sliderLength={Dimensions.get('window').width - this.props.LRpadding * 2}
                        onValuesChange={this.multiSliderValuesChange}
                        min={this.props.min}
                        max={this.props.max}
                        step={10}
                        allowOverlap={false}
                        customMarker={CustomMarker}
                        snapped={true}
                    />
                </View>
            </View>
        );
    }

    multiSliderValuesChange = values => {
        if (this.props.single) {
            this.setState({
                second: values[0],
            })
        } else {
            this.setState({
                multiSliderValue: values,
                first: values[0],
                second: values[1],
            })
        }
        this.props.callback(values)
    }

    renderScale = () => {
        let items = this.props.data.map((item, index) => {
            return <Item
                key={index}
                value={item.key}
                text={item.value}
                first={this.state.first}
                second={this.state.second}
            />
        });
        return items;
    }
}

export default CustomSlider;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    column: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        bottom: -20,
    },
    main_active: {
        textAlign: 'center',
        fontSize: 20,
        color: '#5e5e5e',
    },
    main_inactive: {
        textAlign: 'center',
        fontWeight: 'normal',
        color: '#bdc3c7',
    },
    main_line: {
        textAlign: 'center',
    },
    active: {
        textAlign: 'center',
        fontSize: 20,
        bottom: 10,
        color: '#5e5e5e',
    },
    inactive: {
        flex: 1,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontWeight: 'normal',
        color: '#bdc3c7',
    },
    line: {
        fontSize: 10,
        textAlign: 'center',
    }
});