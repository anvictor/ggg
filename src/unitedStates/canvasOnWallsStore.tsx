import { createContext } from 'react'
import { decorate, observable, computed } from 'mobx'


export interface IPaintItem {
    id: string;
    description: string;
    name: string;
    isLoading: boolean;
    url: any;
    order?: number;
    width?: number;
    height?: number;
    pWidth?:number;
    pHaight?: number;
}

export class CanvasOnWallsStore {
    paints: IPaintItem[];

    constructor(){
        this.paints = [{
            id: "-1",
            pWidth: 400,
            pHaight: 400,
            description: "", 
            name: "", 
            isLoading: true,
            url: ""
        },
        {
            id: "-2", 
            pWidth: 400,
            pHaight: 400,
            description: "",
            name: "", 
            isLoading: true,
            url: ""
        },
        {
            id: "-3", 
            pWidth: 400,
            pHaight: 400,
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
