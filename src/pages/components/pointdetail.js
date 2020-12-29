import React from 'react'
import { View, StyleSheet, Image, Text } from 'react-native'
import { scaleSizeW, setSpText } from '../../tools/util'
import NoRecords from '../components/norecords'


class PointDetail extends React.Component {
    getPosition = (score, top) => {
        let _left = null, _right = null, _top = null;
        if (score > 0) {
            _left = '50%';
            _right = (750 / 2 - 30) - (parseFloat(Math.abs(score)) / 10) * (750 / 2 - 30) + 30;
        } else {
            _right = '50%';
            _left = (parseFloat(Math.abs(score)) / 10) * (750 / 2 - 30) + 30;
        }
        _top = top + 45;
        return { top: _top, left: _left, right: _right };
    }
    getFieldName = (key) => {
        switch (key) {
            default:
            case "gender":
                return '年龄';
            case "height":
                return '身高';
            case "education":
                return '教育';
            case "age":
                return '年龄';
            case "cityId":
                return '城市';
            case "occupation":
                return '职业';
            case "maritalStatus":
                return "婚姻状况"
            case "hasKids":
                return "孩子"
            case "figure"://身材
                return "身材"
            case "likePet"://是否喜欢宠物
                return "宠物"
            case "homeTownId"://家乡 省市区最后一位
                return "故乡"
            case "monthSalary"://薪资
                return "月薪"
            case "constellations"://星座
                return "星座"
            case "likeSmoke"://抽烟
                return "抽烟"
            case "drink"://喝酒
                return "喝酒"
            case "blood"://血型
                return "血型"
            case "wenShenState"://纹身
                return "纹身"
            ///
            //SenseWorth
            ///
            case "consumptionView"://消费观
                return "消费观"
            case "canLongDistanceLove"://是否可以异地
                return "异地恋"
            case "activeInFeeling"://感情态度
                return "感情态度"
            case "wantChild"://是否要小孩
                return "小孩"
            case "familyCareerTendency"://家庭事业倾向性
                return "家庭事业"
            case "liveWithParents"://是否跟父母同住
                return "与父母同住"
            case "waysOfTogether"://相处方式
                return "相处方式"
            ///
            //Habit
            ///
            case "diet"://饮食
                return "饮食"
            case "workAndRest"://作息
                return "作息"
            case "lifeStyle"://休闲生活方式
                return "生活方式"
            case "houseWork"://家务习惯
                return "家务习惯"
            case "workStyle"://工作形式
                return "工作形式"
            case "workSystem"://工作制
                return "工作制"
        }
    }
    render() {
        var scoreList = this.props.dataSource;
        if(scoreList.length===0){
            return (<NoRecords renderText={(textStyle, textBigStyle, containerStyle) => {
                return (<View style={containerStyle}>
                    <Text style={textBigStyle}>无缘</Text>
                    <Text style={textStyle}>大概我们是没有缘分了/(ㄒoㄒ)/~~</Text>
                </View>)
            }} />)
        }
        var Bars = [];
        var top = 0;
        let that = this;
        scoreList.forEach((item, index) => {
            var data = that.getPosition(item.score, top);
            var _newData = Object.assign({}, item, {
                left: data.left === '50%' ? data.left : scaleSizeW(data.left),
                right: data.right === '50%' ? data.right : scaleSizeW(data.right),
                top: scaleSizeW(data.top)
            });
            Bars.push(_newData);
            top = data.top;
        })
        var _height = (Bars[Bars.length - 1].top + scaleSizeW(30));
        return (
            <View style={styles.container}>
                <View style={[styles.point_chat_container]}>
                    {['-10', '-8', '-6', '-4', '-2', '0', '+2', '+4', '+6', '+8', '+10'].map((item, index) => {
                        return (<View key={index} style={[styles.point_chat_line, { minHeight: _height }]}>
                            <Text style={styles.line_text}>{item}</Text>
                        </View>)
                    })}
                </View>
                {Bars.map((item, index) => {
                    var name = this.getFieldName(item.name);
                    const _width = scaleSizeW(100)
                    if (item.score > 0) {
                        if (item.score < 2) {
                            return (<View style={[styles.bar_container, { top: item.top }]}>
                                <View key={index} style={[styles.bar_item, { left: item.left, right: item.right, top: 0 }]}>
                                </View>
                                <View key={index} style={[styles.bar_item_right, { right: item.right - _width, top: 0 }]}>
                                    <Text style={[styles.bar_item_text, { color: '#000' }]}>{name}</Text>
                                    <Text style={[styles.bar_item_text, { color: '#000' }]}>+{item.score}</Text>
                                </View>
                            </View>)
                        }
                        return (
                            <View key={index} style={[styles.bar_item, { left: item.left, right: item.right, top: item.top }]}>
                                <Text style={styles.bar_item_text}>{name}</Text>
                                <Text style={styles.bar_item_text}>+{item.score}</Text>
                            </View>
                        )
                    }
                    if(item.score>-2){
                        return (<View style={[styles.bar_container, { top: item.top }]}>
                            <View key={index} style={[styles.bar_item, { left: item.left, right: item.right, top: 0 }]}>
                            </View>
                            <View key={index} style={[styles.bar_item_right, { left: item.left - _width, top: 0 }]}>
                                <Text style={[styles.bar_item_text, { color: '#000' }]}>-{item.score}</Text>
                                <Text style={[styles.bar_item_text, { color: '#000' }]}>{name}}</Text>
                            </View>
                        </View>)
                    }
                    return (
                        <View key={index} style={[styles.bar_item, { left: item.left, right: item.right, top: item.top }]}>
                            <Text style={[styles.bar_item_text]}>{item.score}</Text>
                            <Text style={styles.bar_item_text}>{name}</Text>
                        </View>
                    )
                })}

            </View>
        )
    }
}

export default PointDetail

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        paddingBottom:scaleSizeW(150)
    },
    point_chat_container: {
        paddingTop: scaleSizeW(30),
        paddingLeft: scaleSizeW(30),
        paddingRight: scaleSizeW(30),
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingBottom: scaleSizeW(20),
    },
    point_chat_line: {
        borderLeftColor: '#dedede',
        minHeight: scaleSizeW(300),
        position: 'relative',
        borderLeftWidth: scaleSizeW(1)
    },
    line_text: {
        position: 'absolute',
        bottom: -scaleSizeW(30),
        left: -scaleSizeW(10)
    },
    bar_container: {
        position: 'absolute',
        height: scaleSizeW(30),
        left: 0,
        right: 0,
    },
    bar_item: {
        backgroundColor: '#fc4185',
        height: scaleSizeW(30),
        position: 'absolute',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bar_item_right: {
        height: scaleSizeW(30),
        position: 'absolute',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    bar_item_text: {
        color: '#000',
        paddingRight: scaleSizeW(10),
        paddingLeft: scaleSizeW(10),
        fontSize:scaleSizeW(16)

    },
    outof_container: {
        position: 'absolute',
    }
})