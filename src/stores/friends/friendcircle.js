import { observable, action, computed } from 'mobx'
import { FriendsCirclePages } from '../../tools/util'

class FriendCircle {
    @observable pageTitle = "";
    @observable FocusedList = []
    @observable FocusedFilter = {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
        totalItemCount: 0
    }

    @observable RecommendList = []
    @observable RecommendFilter = {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
        totalItemCount: 0
    }

    @observable FunnyList = []
    @observable FunnyFilter = {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
        totalItemCount: 0
    }

    @observable VideoList = []
    @observable VideoFilter = {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
        totalItemCount: 0
    }

    @observable CityList = []
    @observable CityFilter = {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
        totalItemCount: 0
    }

    @observable ParentNavigation = null;

    @action initAll = () => {
        this.pageTitle = "";
        this.FocusedList = [];
        this.FocusedFilter = {
            pageIndex: 1,
            pageSize: 20,
            pageCount: 0,
            totalItemCount: 0
        }
        this.RecommendList = [];
        this.RecommendFilter = {
            pageIndex: 1,
            pageSize: 20,
            pageCount: 0,
            totalItemCount: 0
        };
        this.FunnyList = []
        this.FunnyFilter = {
            pageIndex: 1,
            pageSize: 20,
            pageCount: 0,
            totalItemCount: 0
        }
        this.VideoList = []
        this.VideoFilter = {
            pageIndex: 1,
            pageSize: 20,
            pageCount: 0,
            totalItemCount: 0
        }
        this.CityList = []
        this.CityFilter = {
            pageIndex: 1,
            pageSize: 20,
            pageCount: 0,
            totalItemCount: 0
        }
    }

    @action setPageTitle = (title) => {
        this.pageTitle = title;
    }
    @action setNavigation = (nav) => {
        this.ParentNavigation = nav;
    }

    @action setList = (reload, data, filter, type) => {
        if (data !== undefined) {
            switch (type) {
                case FriendsCirclePages.Focused:
                    if (reload) {
                        this.FocusedList = data;
                    } else {

                        this.FocusedList.concat(data);
                    }
                    if (filter !== undefined) {
                        this.FocusedFilter = filter;
                    }
                    break;
                case FriendsCirclePages.Recommend:
                    if (reload) {
                        this.RecommendList = data;
                    } else {

                        this.RecommendList.concat(data);
                    }
                    if (filter !== undefined) {
                        this.RecommendFilter = filter;
                    }
                    break;
                case FriendsCirclePages.Funny:
                    if (reload) {
                        this.FunnyList = data;
                    } else {
                        let _data = this.FunnyList.slice();
                        _data = _data.concat(data);
                        this.FunnyList = _data;
                    }
                    if (filter !== undefined) {
                        this.FunnyFilter = filter;
                    }
                    break;
                case FriendsCirclePages.Video:
                    if (reload) {
                        this.VideoList = data;
                    } else {
                        this.VideoList.concat(data);
                    }


                    if (filter !== undefined) {
                        this.VideoFilter = filter;
                    }
                    break;
                case FriendsCirclePages.City:
                    if (reload) {
                        this.CityList = data;
                    } else {

                        this.CityList.concat(data);
                    }

                    //判断是否能reachend
                    if (data.length != 0 && data.length === this.CityFilter.pageSize) {
                        let dupCount = 0;
                        data.forEach(item => {
                            let _index = this.CityList.findIndex(x => x.id === item.id);
                            if (_index !== -1) {
                                dupCount++;
                            }
                        })
                        if (dupCount <= this.pageSize - 1) {
                            this.CityFilter = {
                                pageIndex: 0,
                                pageCount: 1
                            }
                        } else {
                            this.CityFilter = {
                                pageIndex: 0,
                                pageCount: 0
                            }
                        }
                    } else {
                        this.CityFilter = {
                            pageIndex: 0,
                            pageCount: 0
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    }

    @action changeRow = (rowId, rowModel, type) => {
        switch (type) {
            case FriendsCirclePages.Focused:
                var data = this.FocusedList.slice();
                this.setZan(rowId, rowModel, data);
                this.FocusedList = data;
                break;
            case FriendsCirclePages.Recommend:
                var data = this.RecommendList.slice();
                this.setZan(rowId, rowModel, data);
                this.RecommendList = data;
                break;
            case FriendsCirclePages.Funny:
                var data = this.FunnyList.slice();
                this.setZan(rowId, rowModel, data);
                this.FunnyList = data;
                break;
            case FriendsCirclePages.Video:
                var data = this.VideoList.slice();
                this.setZan(rowId, rowModel, data);
                this.VideoList = data;
                break;
            case FriendsCirclePages.City:
                var data = this.CityList.slice();
                this.setZan(rowId, rowModel, data);
                this.CityList = data;
                break;
            default:
                break;
        }

    }
    setZan = (rowId, rowModel, data) => {
        let _index = data.findIndex(x => x.id === rowId);
        if (_index !== -1) {
            let _model = Object.assign({}, data[_index], rowModel);
            data[_index] = _model;
        }
    }
}

export default new FriendCircle();