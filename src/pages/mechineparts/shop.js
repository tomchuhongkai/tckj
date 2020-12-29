import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, FlatList, Dimensions, RefreshControl, ScrollView, StatusBar } from 'react-native'
import FilterBar from '../components/filterbar'
import Waiting from '../commons/waiting'
import RightButton from '../components/rightButton'
import { scaleSize, config, scaleSizeW, setSpText } from "../../tools/util";
import commonStyle from '../../tools/commonstyles'
import * as api from '../../mocks/api'
import * as tools from '../../tools/tool'
const arrowSelectedIcon = require('../../../images/icon-arrowdown-selected.png')
const arrowIcon = require('../../../images/icon-arrowdown.png')
const removeIcon = require('../../../images/cha.png')
const screenW = Dimensions.get('window').width;
// 一些常量设置
const cols = 2; // 列数
const left = 10; // 左右边距
const top = 10; // 上下边距
const ImageWH = (screenW - (cols + 1) * left) / cols; // 图片大小
const screenH = Dimensions.get('screen').height;
class Shop extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: null,
            headerLeft: null,
            headerRight: null,
            headerStyle: {
                height: StatusBar.currentHeight,
                shadowOpacity: 0,
                backgroundColor: '#4576f7',
                borderWidth: 0
            }
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            isFirstTime: true,
            saleVisible: false,
            refreshing: false,
            priceVisible: false,
            brandVisible: false,
            popBrandHeight: 0,
            Brands: [],
            Data: [],
            ShopData:[],
            Filter: {
                containBrands: true,
                sort: 'viewcount',
                isASC: true,
                page: 1,
                pageSize: 20,
                name: '',
                brandIds: [],
                storeId:0,
                type: 'MachineParts'
            },
            ShopFilter:{
                page:1,
                pageSize:4
            }
        }
    }
    componentDidMount = () => {
        let that = this;
        let id = this.props.navigation.getParam('id');
        var filter = Object.assign({}, this.state.Filter);
        filter.storeId=id;
        that.setState({
            Filter: filter,
        })
        this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                if (this.state.isFirstTime == false) {
                    tools.SetSearchFilter(that.state.Filter, (_filter) => {
                        this.loadData(_filter, true);
                    }, true)
                }
            }
        )
        tools.SetSearchFilter(this.state.Filter, (_filter) => {
            this.loadData(_filter, true);
        }, false)
    }
    loadData = (filter, reload) => {
        let that = this;
        let id = this.props.navigation.getParam('id');
        if (filter === undefined) {
            filter = {};
        }
        filter = Object.assign({}, this.state.Filter, filter);
        filter.storeId=id;
        api.GetMachineParts(filter)
            .then(res => {
                var data = [];
                if (reload) {
                    data = res.data.data;
                } else {
                    data = this.state.Data.slice();
                    data = data.concat(res.data.data);
                }
                filter.containBrands = false;
                that.setState({
                    Data: data,
                    Filter: filter,
                    Brands: that.state.Brands.length > 0 ? that.state.Brands.slice() : res.data.brands,
                    isFirstTime: false
                })
            })
            api.GetShops(this.state.ShopFilter)
            .then(res => {
                var data = [];
                data = res.data.data;
                that.setState({
                    ShopData: data
                })
            })
    }
    refresh = () => {
        this.loadData({
            page: 1
        }, true);
    }
    reachEnd = () => {
        const { pageCount, page } = this.state.Filter;
        if (page < pageCount) {
            this.loadData({ page: page + 1 }, false);
        }
    }
    renderProduct = (row) => {
        const { item, index } = row;
        let _item_Row = [styles.cols2pro];
        if (index % 2 != 0) {
            _item_Row.push(styles.column2);
        }
        return (
            <TouchableOpacity onPress={() => { this.props.navigation.push('MachinePartDetail', { id: item.id }) }}>
                <View style={_item_Row}>
                    <View style={commonStyle.proimgcontainer}>
                        {item.photos.length === 0 ? <Image style={commonStyle.proimg} source={require('../../../images/test-product.jpg')} /> :
                            <Image style={commonStyle.proimg} source={{ uri: item.photos[0].thumbnal }} />}
                    </View>
                    <Text style={commonStyle.protitle1} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.price} numberOfLines={1}>{item.price}</Text>
                    <Text style={styles.totalsale}>总销量 {item.soldOut}+</Text>
                </View>
            </TouchableOpacity>
        );
    }
  
    setName = (name) => {
        var filter = Object.assign({}, this.state.Filter);
        filter.name = name;
        this.setState({
            Filter: filter
        })
    }
    _keyExtractor = (item) => { return item.id.toString(); }
    render() {
        let that = this;
        const parents = this.state.Brands.filter(x => x.parentId === 0);
        return (<SafeAreaView style={{ backgroundColor: '#f2f2f2', paddingBottom: scaleSizeW(20), flex: 1 }}>
            <View style={{ width: '100%', backgroundColor: '#fff', borderBottomColor: '#dedede', borderBottomWidth: scaleSizeW(1) }}>
                <View style={{ height: scaleSizeW(90), display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: scaleSizeW(30), paddingRight: scaleSizeW(30) }}>
                    <TouchableOpacity onPress={()=>{this.props.navigation.goBack()}}>
                        <Image source={require('../../../images/back_icon.png')} style={{width:scaleSizeW(18),height:scaleSizeW(30)}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.push('PopHistory', { type: 'MachineParts', callback: this.setName })
                    }} style={styles.searchinput}>
                        <Image style={styles.searchimg} source={require('../../../images/icon-search.png')} />
                        {this.state.Filter.name === '' ? <Text style={styles.searchkey}>请输入关键词</Text> :
                            <View style={styles.searchNameBox}>
                                <Text style={styles.searchkey} numberOfLines={1}>{this.state.Filter.name}</Text>
                                <TouchableOpacity onPress={() => {
                                    global.SearchInfo=null;
                                    this.loadData({ name: '' }, true)
                                }}>
                                    <Image source={removeIcon} style={styles.deleteImage} />
                                </TouchableOpacity>
                            </View>}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.loadData({ page: 1 }, true) }} style={styles.searchBtn}><Text style={styles.searchBtnText}>搜索</Text></TouchableOpacity>
                </View>
                <View style={{ height: scaleSizeW(65), paddingLeft: scaleSizeW(30), paddingRight: scaleSizeW(30), display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => {
                        this.loadData({ sort: 'viewcount' }, true)
                    }} style={styles.searchBtn}>
                        <View style={styles.filter_item}>
                            <Text style={[styles.filter_item_text, this.state.Filter.sort === 'viewcount' ? styles.filter_text_select : null]}>综合</Text>
                            <Image style={styles.filterimg} source={this.state.Filter.sort === 'viewcount' ? arrowSelectedIcon : arrowIcon} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.setState({
                            saleVisible: true,
                            brandVisible: false
                        })
                    }} style={styles.searchBtn}>
                        <View style={styles.filter_item}>
                            <Text style={[styles.filter_item_text, this.state.Filter.sort === 'soldout' ? styles.filter_text_select : null]}>销量</Text>
                            <Image style={styles.filterimg} source={this.state.Filter.sort === 'soldout' ? arrowSelectedIcon : arrowIcon} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.setState({
                            priceVisible: true,
                            brandVisible: false
                        })
                    }} style={styles.searchBtn}>
                        <View style={styles.filter_item}>
                            <Text style={[styles.filter_item_text, this.state.Filter.sort === 'price' ? styles.filter_text_select : null]}>价格</Text>
                            <Image style={styles.filterimg} source={this.state.Filter.sort === 'price' ? arrowSelectedIcon : arrowIcon} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.setState({
                            brandVisible: true
                        })
                    }} style={styles.searchBtn}>
                        <View style={styles.filter_item}>
                            <Text style={[styles.filter_item_text, this.state.Filter.brandIds.length > 0 ? styles.filter_text_select : null]}>品牌</Text>
                            <Image style={styles.filterimg} source={this.state.Filter.brandIds.length > 0 ? arrowSelectedIcon : arrowIcon} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <FilterBar visible={this.state.saleVisible || this.state.priceVisible} onClose={() => { this.setState({ saleVisible: false, priceVisible: false, brandVisible: false }) }}>
                <View style={commonStyle.dialog_container}>
                    <View style={commonStyle.dialog_item}>
                        <Text style={commonStyle.dialog_title_firstText}>排序</Text>
                    </View>
                    {this.state.saleVisible ? <TouchableOpacity style={[commonStyle.dialog_item]} onPress={() => {
                        this.setState({
                            saleVisible: false
                        }, () => {
                            that.loadData({ sort: 'soldout', isASC: false, page: 1 }, true);
                        })
                    }}>
                        <Text style={commonStyle.dialog_title_text}>按销量从高到低</Text>
                    </TouchableOpacity> : null}
                    {this.state.saleVisible ? <TouchableOpacity style={[commonStyle.dialog_item, commonStyle.dialog_item_last]} onPress={() => {
                        this.setState({
                            saleVisible: false
                        }, () => {
                            that.loadData({ sort: 'soldout', isASC: true, page: 1 }, true);
                        })
                    }}>
                        <Text style={commonStyle.dialog_title_text}>按销量从低到高</Text>
                    </TouchableOpacity> : null}
                    {this.state.priceVisible ? <TouchableOpacity style={[commonStyle.dialog_item]} onPress={() => {
                        this.setState({
                            priceVisible: false
                        }, () => {
                            that.loadData({ sort: 'price', isASC: false, page: 1 }, true);
                        })
                    }}>
                        <Text style={commonStyle.dialog_title_text}>按价格从高到底</Text>
                    </TouchableOpacity> : null}
                    {this.state.priceVisible ? <TouchableOpacity style={[commonStyle.dialog_item, commonStyle.dialog_item_last]} onPress={() => {
                        this.setState({
                            priceVisible: false
                        }, () => {
                            that.loadData({ sort: 'price', isASC: true, page: 1 }, true);
                        })
                    }}>
                        <Text style={commonStyle.dialog_title_text}>按价格从底到高</Text>
                    </TouchableOpacity> : null}
                </View>
            </FilterBar>
            {/* 遮罩层 */}
            {parents.length > 0 && this.state.brandVisible ? <TouchableOpacity onPress={() => {
                this.setState({
                    brandVisible: false
                })
            }} style={styles.popMask}></TouchableOpacity> : null}
            {/* 品牌层 */}
            {parents.length > 0 && this.state.brandVisible ? <ScrollView style={[styles.scrollViewContainer, { height: this.popBrandHeight === 0 ? 'auto' : this.popBrandHeight }]}>
                <View style={styles.popBrands} onLayout={({ nativeEvent }) => {
                    if (screenW / 2 < nativeEvent.layout.height) {
                        this.setState({
                            popBrandHeight: screenW / 2
                        })
                    }
                }}>
                    {parents.map((item, index) => {
                        var subs = that.state.Brands.filter(b => b.parentId === item.id);
                        return (<View key={index} style={styles.brandItem}>
                            <View style={styles.brandItemTitle}>
                                <Text style={styles.brandItemTitleText}>{item.name}</Text>
                            </View>
                            {subs.length > 0 ? <View style={styles.subBrands}>
                                {subs.map((sub, subIndex) => {
                                    let _style = [styles.subBrandItem];
                                    let _styleText = [styles.subBrandItemText];
                                    if (that.state.Filter.brandIds.filter(x => x === sub.id).length > 0) {
                                        _style.push(styles.subBrandItemSelect)
                                        _styleText.push(styles.subBrandItemSelectText)
                                    }
                                    return (<TouchableOpacity onPress={() => {
                                        this.setState({
                                            brandVisible: false
                                        }, () => {
                                            that.loadData({ brandIds: [sub.id], page: 1 }, true);
                                        })
                                    }} key={subIndex} style={_style}><Text style={_styleText}>{sub.name}</Text></TouchableOpacity>)
                                })}
                                <View style={{ flex: 1 }}></View>
                            </View> : null}
                        </View>)
                    })}
                </View>
                <View style={styles.buttons}>
                    <TouchableOpacity style={styles.buttons_c} onPress={() => {
                        this.setState({
                            brandVisible: false
                        }, () => {
                            that.loadData({ brandIds: [], page: 1 }, true);
                        })
                    }}>
                        <Text style={[styles.brandItemTitleText, styles.subBrandItemSelectText]}>重置</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView> : null}
            {/* 数据层 */}
           
            <FlatList
                style={{ paddingTop: scaleSizeW(0) }}
                renderItem={this.renderProduct}
                data={this.state.Data}
                keyExtractor={this._keyExtractor}
                onEndReached={this.reachEnd}
                numColumns={cols}
                horizontal={false}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.refresh}
                    />
                }
                ListEmptyComponent={
                    <Waiting Content="当前无数据" style={{ marginTop: scaleSizeW(200) }} />
                }
            />
        </SafeAreaView>);
    }
}
const styles = StyleSheet.create({
    scrollViewContainer: {
        position: 'absolute',
        top: scaleSizeW(156),
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        zIndex: 2,
        height: '50%'
    },
    popBrands: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingTop: scaleSizeW(30)
    },
    popMask: {
        position: 'absolute',
        top: scaleSizeW(156),
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,.5)',
        zIndex: 1,
    },
    brandItem: {
        paddingLeft: scaleSizeW(30),
        paddingRight: scaleSizeW(30)
    },
    brandItemTitle: {
        borderLeftColor: '#ec5947',
        borderLeftWidth: scaleSizeW(5),
        paddingLeft: scaleSizeW(30)
    },
    brandItemTitleText: {
        fontSize: setSpText(28)
    },
    subBrands: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        paddingTop: scaleSizeW(20),
        paddingBottom: scaleSizeW(20),
    },
    subBrandItem: {
        paddingLeft: scaleSizeW(20),
        paddingRight: scaleSizeW(20),
        paddingTop: scaleSizeW(5),
        paddingBottom: scaleSizeW(5),
        marginRight: scaleSizeW(20),
        backgroundColor: '#fff',
        borderColor: '#dedede',
        borderWidth: scaleSizeW(1),
        borderRadius: scaleSizeW(20),
        marginBottom: scaleSizeW(20),
    },
    subBrandItemSelect: {
        backgroundColor: '#ec5947'
    },
    subBrandItemSelectText: {
        color: '#fff'
    },
    subBrandItemText: {
        fontSize: setSpText(24)
    },
    filter_item: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: scaleSizeW(65)
    },
    filter_item_text: {
        fontSize: scaleSizeW(28),
        color: '#1b1b1b'
    },
    filter_text_select: {
        color: '#ec5947',
    },
    searchinput: {
        height: scaleSize(68),
        marginLeft:scaleSizeW(30),
        borderRadius: scaleSize(10),
        paddingLeft: scaleSize(15),
        backgroundColor: '#f2f2f2',
        justifyContent: 'flex-start',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        flex: 1
    },
    searchimg: {
        width: scaleSize(27),
        height: scaleSize(29),
        marginRight: scaleSize(15)
    },
    searchkey: {
        color: '#bfbfbf',
        fontSize: scaleSize(30)
    },
    filterimg: {
        width: scaleSize(12),
        height: scaleSize(8),
        marginLeft: scaleSize(25)
    },
    magt10: {
        marginTop: scaleSize(20),
        marginLeft: scaleSizeW(30),
        marginRight: scaleSizeW(30),
        height: scaleSizeW(90)
    },
    peijians: {
        backgroundColor: '#f2f2f2',
        paddingTop: scaleSize(20)
    },
    cols2pros: {
        justifyContent: "space-between",
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    }, cols2pro: {
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: 'center',
        width: scaleSizeW(365),
        height: scaleSizeW(465),
        display: 'flex',
        marginTop: scaleSizeW(10),
        marginBottom: scaleSizeW(10),
        backgroundColor: '#fff',
        borderRadius: scaleSizeW(10),
        marginRight: scaleSizeW(20)
    },
    column2: {
        marginRight: 0
    },
    protitle: {
        fontSize: scaleSize(28),
        color: '#201e1e'
    }, price: {
        fontSize: scaleSize(30),
        color: '#e65e46',
        fontWeight: 'bold',
        marginLeft: scaleSize(30),
        alignSelf: 'flex-start',
        marginBottom: scaleSize(15),
        marginTop: scaleSize(15)
    },
    totalsale: {
        fontSize: scaleSize(24),
        color: '#c9c9c9',
        alignSelf: 'flex-start',
        marginLeft: scaleSize(30)
    },
    searchBtn: {
        paddingLeft: scaleSizeW(15),
        width: scaleSizeW(80),
        height: scaleSizeW(90),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchBtnText: {
        fontSize: scaleSizeW(22),
        color: '#000',
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: scaleSizeW(30)
    },
    buttons_c: {
        paddingTop: scaleSizeW(10),
        paddingBottom: scaleSizeW(10),
        fontSize: scaleSizeW(28),
        backgroundColor: '#ec5947',
        paddingLeft: scaleSizeW(50),
        paddingRight: scaleSizeW(50),
        borderRadius: scaleSizeW(45)
    },
    deleteImage: {
        width: scaleSizeW(20),
        height: scaleSizeW(20),
        marginRight: scaleSizeW(30)
    },
    searchNameBox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        flex: 1
    }
})
export default Shop