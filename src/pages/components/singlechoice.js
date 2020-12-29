import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

const styles = StyleSheet.create({
        componentContainer: {
                justifyContent: "space-around",
                marginTop: 30
        },
        buttonContainer: {
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 30
        },
        circle: {
                height: 20,
                width: 20,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#ACACAC",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10
        },
        checkedCircle: {
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: "#000"
        },
        optionColor: {
                color: "#f94586"
        }
});

const SingleChoice = props => {
        const {
                options,
                defaultValue,
                keyName,
                selectDirection,
                setValueFunc,
                lableName,
                valueName
        } = props;
        if (lableName === undefined) {
                lableName = "text";
        }
        if (valueName === undefined) {
                valueName = "key";
        }
        return (
                <View
                        style={[styles.componentContainer, { flexDirection: selectDirection }]}
                >
                        {options.map(item => (
                                <View key={item[valueName]} style={styles.buttonContainer}>
                                        <TouchableOpacity
                                                style={styles.circle}
                                                onPress={() => {
                                                        setValueFunc({
                                                                [keyName]: item[valueName]
                                                        }, item);
                                                }}
                                                disabled={!!item.disabled}>
                                                {defaultValue[keyName] === item[valueName] && (
                                                        <View style={styles.checkedCircle} />
                                                )}
                                        </TouchableOpacity>
                                        <Text style={styles.optionColor}>{item[lableName]}</Text>
                                </View>
                        ))}
                </View>
        );
};

export default SingleChoice;