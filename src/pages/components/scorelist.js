import React, { Component } from 'react'
import { View, StyleSheet,TouchableOpacity,Text } from 'react-native'
import { scaleSizeW, setSpText } from '../../tools/util'

class ScoreList extends React.Component {
    render() {
        return (<View style={styles.popContainer}>
            <View style={{paddingLeft:scaleSizeW(20),paddingTop:scaleSizeW(10)}}>
                <Text style={{fontSize:setSpText(32),color:'#fc4185'}}>请选择分值</Text>
            </View>
            <View style={styles.popItems}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
                    return (
                        <TouchableOpacity key={index} onPress={() => {
                            this.props.getScore(item)
                        }} style={styles.popItem}>
                            <Text style={styles.popText}>{item}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>)
    }
}
export default ScoreList

const styles = StyleSheet.create({
    popContainer: {
        position: 'absolute',
        bottom: 0,
        height: scaleSizeW(450),
        width:'100%',
        backgroundColor:'#fff'
    },
    popItems: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap:'wrap',
        alignItems: 'center',
        flex:1,
        paddingTop:scaleSizeW(10)
    },
    popItem: {
        width: scaleSizeW(100),
        height: scaleSizeW(100),
        borderRadius: scaleSizeW(50),
        backgroundColor: '#dedede',//fc4185
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginLeft:scaleSizeW(30),
        marginRight:scaleSizeW(30),
        marginBottom:scaleSizeW(30)
    },
    popText: {
        fontSize: setSpText(60),
        color: '#fc4185',
        alignSelf:'center'
    }
})