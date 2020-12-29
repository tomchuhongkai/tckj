import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { View, TouchableOpacity, Image, Text, Dimensions, Platform, StyleSheet } from 'react-native'
import commonStyle from '../../tools/commonstyles'
import { config, scaleSizeW, scaleSize } from "../../tools/util";
import Share from 'react-native-share';
import Modal from 'react-native-modal'
import * as api from '../../mocks/api'
import * as tools from '../../tools/tool' 

const deviceHeight = Platform.OS === "ios"
    ? Dimensions.get("window").height
    : Dimensions.get("screen").height;

@inject('store')
@observer
class BottomItems extends Component {
    constructor(props) {
        super(props);
    }
    share = (id) => {
        const { userInfo } = this.props.store.config;
        const shareOptions = {
            title: '分享',
            url: `${tools.GetRootUrl}/news/share/${id}?uid=${userInfo.userId}`
        };

        Share.open(shareOptions)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                err && console.log(err);
            });
    }

    good = (id) => {
        let data = {
            newsId: id,
            desc: '',
            type: 1
        }
        let that = this;
        if (this.loadinggood === undefined || this.loadinggood === false) {
            this.loadinggood = true;
        } else {
            return;
        }
        const { isZan } = this.props.item;
        if (!isZan) {
            api.RelationPost(data).then((res) => {
                if (res.data.result == 1) {
                    that.loadinggood = false;
                    if (res.data.result == 1) {
                        that.props.changeRow({ isZan: res.data.isZOF, zanCount: res.data.zanCount, id: id });
                    } else {
                        tools.Toast.fail(res.data.message);
                    }
                } else {
                    tools.Toast.fail(res.data.message);
                    return;
                }
            }, err => {
                that.loadinggood = false;
            })
        } else {
            tools.Toast.success('您已经赞过了');
            that.loadinggood = false;
        }

    }
    fav = (id) => {
        let that = this;
        let data = {
            newsId: id,
            desc: '',
            type: 3
        }
        if (this.loading === undefined || this.loading === false) {
            this.loading = true;
        } else {
            return;
        }
        api.RelationPost(data).then((res) => {
            that.loading = false;
            if (res.data.result == 1) {
                that.props.changeRow({ isFavourite: res.data.isZOF, id: id });
            } else {
                tools.Toast.fail(res.data.message);
            }
        }, err => {
            that.loading = false;
        })

    }


    render() {
        const { isZan, zanCount, isFavourite } = this.props.item
        return (
            <View style={[commonStyle.flexrow, { borderTopWidth: scaleSize(1), borderTopColor: '#eee', marginVertical: scaleSize(20), paddingTop: scaleSize(20) }, this.props.styles]}>
                <TouchableOpacity style={commonStyle.flexrow} onPress={() => { this.good(this.props.item.id) }}>
                    <Image source={isZan ? require('../../../images/icon-good-filling.png') : require('../../../images/icon-good.png')} style={styles.icon} />
                    <Text style={styles.txt}>点赞({zanCount})</Text>
                </TouchableOpacity>
                <TouchableOpacity style={commonStyle.flexrow} onPress={() => { this.share(this.props.item.id) }}>
                    <Image source={require('../../../images/icon-share.png')} style={styles.icon} />
                    <Text style={styles.txt}>分享</Text>
                </TouchableOpacity>
                <TouchableOpacity style={commonStyle.flexrow} onPress={() => { this.fav(this.props.item.id) }}>
                    <Image source={isFavourite ? require('../../../images/icon-favorite-filling2.png') : require('../../../images/icon-favorite.png')} style={styles.icon} />
                    <Text style={styles.txt}>收藏</Text>
                </TouchableOpacity>
                <TouchableOpacity style={commonStyle.flexrow} onPress={() => { this.props.navigation.push('Jubao', { id: this.props.item.id }) }}>
                    <Image source={require('../../../images/icon-warning.png')} style={styles.icon} />
                    <Text style={styles.txt}>举报</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default BottomItems;


const styles = StyleSheet.create({
    dialog: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: scaleSizeW(10),
        paddingVertical: scaleSizeW(15),
        paddingHorizontal: scaleSizeW(15),
        paddingTop: scaleSizeW(60),
        position: 'relative',
        paddingBottom: scaleSizeW(40)
    },
    dialog_title: {
        height: scaleSizeW(100),
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dialog_closeBtn: {
        width: '90%',
        backgroundColor: '#ec5947',
        borderWidth: scaleSizeW(1),
        borderColor: '#ec5947',
        borderRadius: scaleSizeW(10),
        height: scaleSizeW(70),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    item_line: {
        height: scaleSizeW(80),
        width: scaleSizeW(600),
        lineHeight: scaleSizeW(80),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#eee',
        borderBottomWidth: scaleSizeW(1)
    },
    item_text: {
        fontSize: scaleSizeW(24),
        color: '#000',
    },
    select_style: {
        alignItems: 'flex-start',
        borderBottomColor: '#ccc', borderBottomWidth: 1,

        height: scaleSizeW(70),
        position: 'relative'
    },
    dropIcon: {
        width: scaleSizeW(30),
        height: scaleSizeW(18),
        position: 'absolute',
        right: scaleSizeW(10),
        bottom: scaleSizeW(40)
    },
    txt: {
        fontSize: scaleSize(21), marginLeft: scaleSize(4)
    },
    icon:{ width: scaleSize(30), height: scaleSize(30) }
})