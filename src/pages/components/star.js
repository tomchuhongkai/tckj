import React, { Component } from 'react'
import { View, Image, TouchableHighlight } from 'react-native'
const starOn = require('../../../images/star-on.png');
const starOff = require('../../../images/star-off.png');

class Star extends Component {
    constructor(props) {
        super(props);
        let Scores = [];
        var zero = [starOff, starOff, starOff, starOff, starOff];
        Scores.push(zero);
        var one = [starOn, starOff, starOff, starOff, starOff];
        Scores.push(one);
        var two = [starOn, starOn, starOff, starOff, starOff];
        Scores.push(two);
        var three = [starOn, starOn, starOn, starOff, starOff];
        Scores.push(three);
        var four = [starOn, starOn, starOn, starOn, starOff];
        Scores.push(four);
        var five = [starOn, starOn, starOn, starOn, starOn];
        Scores.push(five);
        let _score = this.props.Score === undefined ? 0 : this.props.Score;
        this.state = {
            List: Scores,
            Score: _score,
            Static: this.props.Static === undefined ? 0 : this.props.Static,
            Width: this.props.Width === undefined ? 14 : this.props.Width,
            Height: this.props.Height === undefined ? 14 : this.props.Height,
        }
    }
    SetScore = (index) => {
        if (!this.state.Static) {
            var score = index + 1;
            this.setState({
                Score: score
            });
            if (this.props.GetScore !== undefined) {
                this.props.GetScore(score);
            }
        }
    }

    render = () => {
        let _class = {};
        if (this.props.style !== undefined) {
            _class = this.props.style;
        }
        return (<View style={[_class, { flexDirection: 'row', flex: 1 },]}>
            {this.state.List[this.state.Score].map((item, index) => {
                return (<TouchableHighlight style={{ width: this.state.Width, height: this.state.Height,marginRight:2 }} underlayColor='#fff' key={index} onPress={() => { this.SetScore(index) }}><Image style={{ width: this.state.Width, height: this.state.Height }} source={item} /></TouchableHighlight>)
            })}
        </View>)
    }
}

export default Star;