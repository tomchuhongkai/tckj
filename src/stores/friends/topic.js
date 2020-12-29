import { observable, action, computed } from 'mobx'

class FriendTopic {
    @observable topic = {
        content: '',
        type: 'text',
        data: [],
        completedData: [],
        limitToUser: 2,//公开
        location: null
    }
    @observable locationList = []

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
    @action initTopic = (isLeave) => {
        let location = null;
        if (global.Coordinate !== undefined && global.Coordinate !== null) {
            location = {
                latitude: global.Coordinate.Latitude,
                longitude: global.Coordinate.Longitude,
                simple: global.Coordinate.Simple,
                detail: global.Coordinate.Detail,
            }
        }
        this.topic = {
            content: '',
            type: isLeave ? 'text' : this.topic.type,
            data: isLeave ? [] : this.topic.data,
            completedData: [],
            limitToUser: 2,//公开
            location: location,
        }
    }

    @action setLocationList = (data) => {
        this.locationList = data;
    }

    @action initData=()=>{
        this.topic = {
            content: '',
            type: 'text',
            data: [],
            completedData: [],
            limitToUser: 2,//公开
            location: null
        }
        this.locationList = []
    }
}

export default new FriendTopic()