import React from 'react'
import { Image, Text, View, TouchableWithoutFeedback, ImageBackground, TouchableOpacity, Dimensions } from 'react-native'
import { scaleSizeW } from '../../tools/util';

var { width, height } = Dimensions.get('window');
const MyTabBar = (props) => {
    const {
        navigation: { state: { index, routes } },
        style,
        activeTintColor,
        inactiveTintColor,
        renderIcon,
        jumpTo
    } = props;
    return (
        <View style={{ width: '100%' }}>
            <View style={{
                height: scaleSizeW(117),
                flexDirection: 'row',
                width: '100%',
                ...style,
            }}>
                {
                    routes.map((route, idx) => {

                        return (<View
                            key={route.key}
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    jumpTo(route.key);
                                }}>
                                {renderIcon({
                                    route,
                                    focused: index === idx,
                                    tintColor: index === idx ? activeTintColor : inactiveTintColor
                                })}
                            </TouchableWithoutFeedback>
                        </View>)
                    })
                }
            </View>
            {/* <ImageBackground style={[{
                position: 'absolute',
                bottom: scaleSizeW(117),
                left: 0,
                right: 0,
                height: scaleSizeW(42),
                backgroundColor: 'transparent'
            }]}
                source={require('../../../images/tab-bg.png')}>

            </ImageBackground> */}
            {/* <View style={[{
                position: 'absolute',
                bottom: scaleSizeW(20),
                left: parseInt(width / 2, 10) - scaleSizeW(50),
                height: scaleSizeW(117),
                width: scaleSizeW(100),
                backgroundColor: 'transparent'
            }]}>
                <TouchableWithoutFeedback
                    onPress={() => { jumpTo(routes[2].key) }}>
                    {renderIcon({
                        route: routes[2],
                        focused: index === 2,
                        tintColor: index === 2 ? activeTintColor : inactiveTintColor
                    })}
                </TouchableWithoutFeedback>
            </View> */}
        </View >
    );
};

export default MyTabBar