import { observable, action, computed } from 'mobx'

class Common {
    @observable canMySlideViewScroll=true
    @action setMySlideViewScroll=(scrollable)=>{
        this.canMySlideViewScroll=scrollable;
    }
}
export default new Common()