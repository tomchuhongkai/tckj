import { observable, action, computed } from 'mobx'
import { GetFormatDateFormTimstamp, SetToLocal } from '../../tools/tool'

class PostPhotos {
    @observable topic = {
        data: [],
        pictureids:[],
        completedData: [],
    }

    @action setTopic = (data) => {
        
        let model = Object.assign({}, this.topic, data);
        this.topic = model;
    }
    @action removeImg=(imgUri)=>{
        let model = Object.assign({}, this.topic);
        let imgindex=model.data.findIndex(x=>x.uri==imgUri)
        let newdata=model.data.slice()
        newdata.splice(imgindex,1)
        model.data=newdata
        this.topic=model;
        
    }
   
    @action initData=()=>{
        this.topic = {
            data: [],
            completedData: [],
        }
    }
}

export default new PostPhotos()