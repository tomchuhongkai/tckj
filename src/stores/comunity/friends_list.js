import { observable, action } from 'mobx'

class ComunityFriendList {
    @observable List = []
    @observable Filter = {
        pageIndex: 1,
        pageSize: 20,
        totalItemCount: 0,
        pageCount: 0,
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

    @action initData = () => {
        this.List = [];
        this.Filter = {
            pageIndex: 1,
            pageSize: 20,
            totalItemCount: 0,
            pageCount: 0,
        }
    }
}

export default new ComunityFriendList()