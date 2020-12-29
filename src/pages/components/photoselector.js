import React from 'react'
import { inject, observer } from 'mobx-react'
import { View, Text, TouchableOpacity } from 'react-native'
import commonStyle from '../../tools/commonstyles'
import ImagePicker from 'react-native-image-crop-picker';
import VideoPicker from 'react-native-image-picker';
import FilterBar from '../components/filterbar'
import * as api from '../../mocks/api'
import * as tools from '../../tools/tool' 
const picOptions = {
    mediaType: 'photo',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

@inject('store')
@observer
class PhotoSelector extends React.Component {
    constructor(props) {
        super(props);
    }
    cameraPickerup = () => {
        let that = this;
        this.props.onClose();
        setTimeout(() => {
            ImagePicker.openCamera({
            }).then(image => {
                that.setReponseToTopic('camera', [image]);
            });
        }, 500);
    }
    imagePickerup = () => {
        let that = this;
        this.props.onClose();
        setTimeout(() => {
            ImagePicker.openPicker({
                multiple: true,
                waitAnimationEnd: false,
                includeExif: true,
                forceJpg: true
            }).then(images => {
                that.setReponseToTopic('image', images);
            });
        }, 500);
    }
    videoPickerup = () => {
        let that = this;
        this.props.onClose();
        const options = {
            title: '选择视频',
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '录制视频',
            chooseFromLibraryButtonTitle: '选择视频',
            durationLimit: 10,
            mediaType: 'video',
            videoQuality: 'medium'
        };
        setTimeout(() => {
            VideoPicker.showImagePicker(options, (response) => {
                that.setReponseToTopic('video', response);
            });
        }, 500);
    }
    setReponseToTopic = (type, response) => {
        let that = this;
        if (response.didCancel) {
            console.log('User cancelled video picker');
        }
        else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        }
        else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        }
        else {
            let _picids = [];
            let num = 0;
            response.map((subItem, index) => {
                var imgdata = new FormData();
                let file = {
                    uri: subItem.path,
                    type: subItem.mime,
                    name: tools.CreateUUID()+'.jpeg',
                    size: subItem.size,
                }
                imgdata.append("file", file);
                that.props.store.config.changeLoading(true);
                console.log(file)
                api.UploadImage(imgdata)
                    .then(res => {
                        if (res.data.result === 1) {
                            console.log(res.data)
                            num++;
                            _picids.push(res.data);
                            if (num == response.length) {
                                if (that.props.callBack !== undefined) {
                                    that.props.callBack(_picids);
                                    that.props.store.config.changeLoading(false);
                                }
                            }

                        }
                    }, (err) => {
                        console.log(err)
                        num++;
                        if (num == response.length) {
                            if (that.props.callBack !== undefined) {
                                that.props.callBack(_picids);
                                that.props.store.config.changeLoading(false);
                            }
                        }
                    })
            })
        }
    }

    render() {
        return (<FilterBar visible={this.props.visible} onClose={this.props.onClose}>
            <View style={commonStyle.dialog_container}>
                <TouchableOpacity style={[commonStyle.dialog_item]} onPress={() => {
                    this.cameraPickerup()
                }}>
                    <Text style={commonStyle.dialog_title_text}>拍摄照片</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[commonStyle.dialog_item, commonStyle.dialog_item_last]} onPress={() => {
                    this.imagePickerup()
                }}>
                    <Text style={commonStyle.dialog_title_text}>从相册选取</Text>
                </TouchableOpacity>
            </View>
        </FilterBar>)
    }
}
export default PhotoSelector