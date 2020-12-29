import React, { Component } from 'react'
import { View, Button } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'; 
import { Toast } from '../../tools/tool'

import { inject, observer } from 'mobx-react';

@inject("store")
@observer
class ModalScreen extends Component {
    render() {
        const { list, index } = this.props.navigation.state.params;
        const _images = list.map((item) => {
            return { url: item.bigImage }
        })
        return (<View style={{ flex: 1 }}>
            <ImageViewer
                imageUrls={_images} // 照片路径
                enableImageZoom={true} // 是否开启手势缩放
                saveToLocalByLongPress={true} //是否开启长按保存
                index={index} // 初始显示第几张
                failImageSource={(err) => {
                    Toast.info(err.toString())
                }} // 加载失败图片
                loadingRender={this.renderLoad}
                // enableSwipeDown={false}
                menuContext={{ "saveToLocal": "保存图片", "cancel": "取消" }}
                // onChange={(index) => { }} // 图片切换时触发
                onClick={() => { // 图片单击事件
                    this.props.navigation.goBack()
                }}
            />
        </View>)
    }
}

export default ModalScreen