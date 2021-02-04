import { createContext } from 'react'
import { decorate, observable, computed } from 'mobx'


export interface IRoomItem {
    id: string;
    name: string;
    isLoading: boolean;
}

export class RoomsStore {
    rooms: IRoomItem[];

    constructor(){
        this.rooms = [{
            id: "-1", 
            name: "", 
            isLoading: true
        },
        {
            id: "-2", 
            name: "", 
            isLoading: true
        },
        {
            id: "-3", 
            name: "", 
            isLoading: true
        }]
}

  get newsLength() {
    return this.rooms.length
  }

  setRooms = (rooms: any) => {
    this.rooms = rooms;
  }
}

decorate(RoomsStore, {
  rooms: observable,
  newsLength: computed
})

export default createContext(new RoomsStore())
