import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Image } from 'react-native'

class ScaleImage extends Component {
    constructor(props) {
        super(props);
        this.state = { source: { uri: this.props.uri } };
    }
    componentWillMount() {
        Image.getSize(this.props.uri, (width, height) => {
            if (this.props.width && !this.props.height) {
                this.setState({
                    width: this.props.width,
                    height: height * (this.props.width / width)
                });
            } else if (!this.props.width && this.props.height) {
                this.setState({
                    width: width * (this.props.height / height),
                    height: this.props.height
                });
            } else {
                this.setState({ width: width, height: height });
            }
        });
    }
    render() {
        const { style } = this.props;
        let _style = [{ height: this.state.height, width: this.state.width }];
        if (style !== undefined) {
            _style.push(style);
        }
        return <Image
            source={this.state.source}
            style={_style} />
    }
}

export default ScaleImage

ScaleImage.propTypes = {
    uri: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number
};