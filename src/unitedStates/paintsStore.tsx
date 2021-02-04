import { createContext } from 'react'
import { decorate, observable, computed } from 'mobx'
import { IPaintItem } from './canvasOnWallsStore';

export class PaintsStore {
    paints: IPaintItem[];

    constructor(){
        this.paints = [{
            id: "-1",
            width: 400,
            height: 400,
            description: "", 
            name: "", 
            isLoading: true,
            url: ""
        },
        {
            id: "-2", 
            width: 400,
            height: 400,
            description: "",
            name: "", 
            isLoading: true,
            url: ""
        },
        {
            id: "-3", 
            width: 400,
            height: 400,
            description: "",
            name: "", 
            isLoading: true,
            url: ""
        }]
}

  get newsLength() {
    return this.paints.length
  }

  setPaints = (paints: any) => {
    this.paints = paints;
  }
}

decorate(PaintsStore, {
  paints: observable,
  newsLength: computed
})

export default createContext(new PaintsStore())
