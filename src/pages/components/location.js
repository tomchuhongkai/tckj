import React from 'react'
import { View, TouchableOpacity, Image, StyleSheet, Text, ScrollView, StatusBar } from 'react-native'
import { inject, observer } from 'mobx-react'
import { scaleSize, scaleSizeW } from '../../tools/util';
import commonStyle from '../../tools/commonstyles';
import { SafeAreaView } from 'react-navigation';
import * as api from '../../mocks/api'
import CustomizeHeader from '../components/customizeheader'
import Loading from '../components/loading'
import { TextInput } from 'react-native-gesture-handler';
@inject('store')
@observer
class Location extends React.Component {
    static navigationOptions = () => {
        return {
            headerTitle: null,
            headerLeft: null,
            headerRight: null,
            headerStyle: {
                height: StatusBar.currentHeight,
                elevation: 0,
                shadowOpacity: 0,
                backgroundColor: '#fff',
            }
        }
    }
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            enterText: '',
            List: []
        }
    }
    componentDidMount = () => {
        let that = this;
        const { lat, lng, title } = this.props.navigation.state.params;
        api.GetLocationArounds({ lat: lat, lng: lng })
            .then(res => {
                that.setState({
                    loaded: true,
                    enterText: title,
                    List: res.data.data
                })
            }, err => {

            })
    }
    render() {
        const { callback } = this.props.navigation.state.params;
        let { List } = this.state;
        return (<SafeAreaView style={[commonStyle.safeViewWithCusHead, { backgroundColor: '#fff' }]}>
            <Loading show={!this.state.loaded} />
            {this.state.loaded ? <View style={styles.row_horzantal}>
                <TextInput value={this.state.enterText} style={[commonStyle.normalTextInput, { flex: 1 }]} onChange={(e) => {
                    console.log(e.nativeEvent.text);
                    this.setState({ enterText: e.nativeEvent.text })
                }} />
                <TouchableOpacity onPress={() => {
                    callback(this.state.enterText)
                    this.props.navigation.goBack()
                }} style={{ marginLeft: scaleSizeW(30) }}>
                    <Text style={[styles.small_text, { color: '#eb5946' }]}>确认</Text>
                </TouchableOpacity>
            </View> : null}
            {this.state.loaded ? <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                {List.map((item, index) => {
                    return (<View key={index} style={styles.row}>
                        <TouchableOpacity onPress={() => {
                            callback(`${item.address}${item.name}`)
                            this.props.navigation.goBack()
                        }} style={styles.row_info}>
                            <View style={styles.bigger}>
                                <Text style={styles.bigger_text}>{item.name}</Text>
                            </View>
                            <View style={styles.small}>
                                <Text style={styles.small_text}>{item.address}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>)
                })}
            </ScrollView> : null}
            <CustomizeHeader goBack={() => { this.props.navigation.goBack() }} Title="所在位置" />
        </SafeAreaView>)
    }
}


const styles = StyleSheet.create({
    scrollViewContainer: {
        paddingTop: scaleSize(25)
    },
    row: {
        borderBottomColor: '#dcdcdc',
        borderBottomWidth: scaleSize(1),
    },
    row_info: {
        flexDirection: 'column',
        paddingVertical: scaleSize(20),
        paddingHorizontal: scaleSize(30)
    },
    row_horzantal: {
        paddingHorizontal: scaleSize(30),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingVertical: scaleSizeW(20)
    },
    bigger: {

    },
    small: {

    },
    bigger_text: {
        fontSize: scaleSize(32),
        color: '#000'
    },
    small_text: {
        fontSize: scaleSize(24),
        color: '#999999'
    }
})
export default Location

