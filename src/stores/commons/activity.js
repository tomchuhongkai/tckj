import { observable, action, computed } from 'mobx'

class Activity {
    @observable List = []
    @observable Filter = {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
        totalItemCount: 0
    }

    @observable CircleFriendItem = {
        id: 0,
        userId: 0,
        nickName: '',
        avatar: '',
        content: '',
        totalZans: 0,
        totalComments: 0,
        images: [],
        isZan: false,
        zanFriends: [],
        data: [],
        page: 1
    }

    @action setList = (reload, data, filter) => {
        if (data !== undefined) {
            if (reload) {
                this.List = data;
            } else {
                this.List.concat(data);
            }
        }

        if (filter !== undefined) {
            this.Filter = filter;
        }
    }

    @action changeRow = (rowId, rowModel) => {
        var data = this.List.slice();
        let _index = data.findIndex(x => x.id === rowId);
        if (_index !== -1) {
            let _model = Object.assign({}, data[_index], rowModel);
            data[_index] = _model;
            this.List = data;
        }
    }

    @action setCircleFriendItem = (item) => {
        let data = Object.assign({}, this.CircleFriendItem, item);
        this.CircleFriendItem = data;
    }
    @action deleteFromCirclFriendItem=(id,totalComments)=>{
        let circleFriendItem = Object.assign({}, this.CircleFriendItem);
        let _index=-1;
        let _subIndex=-1;
        circleFriendItem.data.forEach((item,index)=>{
            if(item.id===id){
                _index=index;
            }
            if(item.subComments!==undefined && item.subComments.length>0){
                item.subComments.forEach((subItem,subIndex)=>{
                    if(subItem.id===id){
                        _index = index;
                        _subIndex = subIndex;
                    }
                })
            }
        })
        if(_index!==-1 &&_subIndex!==-1){
            circleFriendItem.data[_index].subComments.splice(_subIndex,1);
        }
        if(_index!==-1 && _subIndex===-1){
            circleFriendItem.data.splice(_index,1);
        }
        circleFriendItem.totalComments = totalComments;
        this.CircleFriendItem = circleFriendItem;
    }
    @action initCircleFriendItem = () => {
        this.CircleFriendItem = {
            id: 0,
            userId: 0,
            nickName: '',
            avatar: '',
            content: '',
            totalZans: 0,
            totalComments: 0,
            images: [],
            isZan: false,
            zanFriends: [],
            data: [],
            page: 1
        }
    }

    @action initData = () => {
        this.List = [];
        this.CircleFriendItem = {
            id: 0,
            userId: 0,
            nickName: '',
            avatar: '',
            content: '',
            totalZans: 0,
            totalComments: 0,
            images: [],
            isZan: false,
            zanFriends: [],
            data: [],
            page: 1
        }
        this.Filter = {
            pageIndex: 1,
            pageSize: 20,
            pageCount: 0,
            totalItemCount: 0
        }
    }

    @action removeItem=(id)=>{
        var _index = this.List.findIndex(x=>x.id===id);
        if(_index!==-1){
            this.List.splice(_index,1);
        }
    }
}

export default new Activity()