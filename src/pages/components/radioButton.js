import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { scaleSizeW } from "../../tools/util";

const styles = StyleSheet.create({
    componentContainer: {
        justifyContent: "flex-end",
        width:scaleSizeW(300)
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        width:scaleSizeW(140)
    },
    circle: {
        height: scaleSizeW(40),
        width: scaleSizeW(40),
        borderRadius: scaleSizeW(20),
        borderWidth: scaleSizeW(1),
        borderColor: "#ACACAC",
        alignItems: "center",
        justifyContent: "center",
        marginRight: scaleSizeW(10)
    },
    checkedCircle: {
        width: scaleSizeW(26),
        height: scaleSizeW(26),
        borderRadius: scaleSizeW(13),
        borderColor: "#fc4186",
        backgroundColor: "#4576f7"
    },
    optionColor: {
        color: "#f94586"
    }
});

const RadioButton = props => {
    const {
        value,
        valueName,
        onClick,
        style,
        renderItem,
        source,        
    } = props;
    return (
        <View
            style={[styles.componentContainer, { flexDirection: 'row' }]}
        >
            {source.map((item, index) =>{
                let _v=null;
                if(valueName!==undefined && valueName!==null){
                    _v=item[valueName]
                }else{
                    _v = item;
                }
                return (
                    <TouchableOpacity key={index} style={styles.buttonContainer} onPress={() => {
                        onClick(item);
                    }}>
                        <View style={style===undefined?null:style}>
                            <View style={styles.circle}>
                                {value===_v ? (
                                    <View style={styles.checkedCircle} />
                                ) : null}
                            </View>
                        </View>
                        {renderItem(item)}
                    </TouchableOpacity>
                )
            } )}
        </View>
    );
};

export default RadioButton;