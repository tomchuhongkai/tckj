import React, { Component } from 'react'
import { Platform, Dimensions,View } from 'react-native'
import { inject, observer } from 'mobx-react'
import Modal from 'react-native-modal'
import ImageViewer from 'react-native-image-zoom-viewer';
import { Toast } from './tools/tool'
const screenHeight = Platform.OS==='ios' ? Dimensions.get('window').height : Dimensions.get("screen").height;

@inject('store')
@observer
class BigPhoto extends Component {
    render() {
        const { isShow, images, index,closeBigPhoto } = this.props.store.bigphoto;
        const _images=images.map((item)=>{
            return {url:item.url}
        })
        return (<Modal style={{ margin: 0 }} deviceHeight={screenHeight}
            isVisible={isShow} onBackdropPress={() => { closeBigPhoto() }}>
            {isShow ? <ImageViewer
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
                    closeBigPhoto()
                }}
            // onSave={(url) => { this.savePhoto(url) }}

            /> : <View></View>}
        </Modal>)
    }
}

export default BigPhoto