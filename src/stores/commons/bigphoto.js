import { observable, action, computed } from 'mobx'

class BigPhoto {
    @observable isShow=false
    @observable images=[]
    @observable index=0

    @action showBigPhoto=(index,images,callBack)=>{
        if(index!==undefined||index!==null){
            this.index=index;
        }
        if(images!==undefined && images!==null){
            this.images=images
        }
        this.isShow=true;
        if(callBack!==undefined){
            callBack();
        }
    }
    @action closeBigPhoto=()=>{
        this.isShow=false;
        this.index=0;
        this.images=[]
    }
}

export default new BigPhoto()