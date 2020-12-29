import { observable, action, computed } from 'mobx'

class Location {
    @observable List=[];
    @observable Locations = []

    @computed get LocationName(){
        let names = [];
        this.Locations.forEach(item => {
            names.push(item.Name);
        })
        return names.join(' ');
    }
    @computed get LocationId(){
        return this.Locations.length === 0 ? 0 : this.Locations[this.Locations.length - 1].Id;
    }

    @action setToLocation=(item)=>{
        let _index = this.Locations.findIndex(x=>x.Type===item.Type && x.Id===item.Id);
        if(_index!==-1){
            //更新
            let _data = this.Locations.slice();
            _data[_index]=item;
            this.Locations=_data;
        }else{
            this.Locations.push(item);
        }
    }

    @action removeLastLocation=()=>{
        if(this.Locations.length>0){
            var _locations = this.Locations.slice();
            _locations.splice(_locations.length-1,1);
            this.Locations = _locations;
        }
    }

    @action setList=(data)=>{
        this.List = data;
    }

    @action initLocation=()=>{
        this.Locations=[];
    }
}

export default new Location()