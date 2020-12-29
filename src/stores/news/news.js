import { observable, action, computed } from 'mobx'

class News {
    @observable NewsList=[];
    @observable NewsFilter = {
        pageNumber: 1,
        pageSize: 20,
        pageCount: 0,
        totalItemCount: 0
    }

    @action setList = (reload, data, filter) => {
        if (data !== undefined) {
            if (reload) {
                this.NewsList = data;
            } else {
                this.NewsList.concat(data);
            }
        }

        if (filter !== undefined) {
            this.NewsFilter = filter;
        }

    }

  
}

export default new News();