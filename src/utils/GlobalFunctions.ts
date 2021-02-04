import {Ilimit} from './interfaces';
import { Vector3, WebGLRenderer } from 'three';
import packageJSON from "../../package.json";

const  HomePage = (): string => {
    return packageJSON.homepage+'/'
};

function inferLiteral<U, T extends U>(arg: T): T {
    return arg;
}

function inferStringLiteral<T extends string>(arg: T): T {
    return inferLiteral<string, T>(arg);
}

const isCameraInRoom = (
    next: Ilimit, 
    roomLimit: Ilimit[]
    ): boolean => {
    
        const x = +next.x, z = +next.z;
    
    var inside = false;
    for (var i = 0, j = roomLimit.length - 1; i < roomLimit.length; j = i++) {
        var xi = +roomLimit[i].x, zi = +roomLimit[i].z;
        var xj = +roomLimit[j].x, zj = +roomLimit[j].z;
        const intersect = ((zi > z) !== (zj > z))
            && (x < (xj - xi) * (z - zi) / (zj - zi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};

interface IIslands{
    insideIslands: Ilimit[][];
    outsideIslands: Ilimit[][];
}

const separateByIslands = (roomLimit: Ilimit[]): IIslands => {
    let insideIslands: Ilimit[][] = [];
    let outsideIslands: Ilimit[][] = [];
    
    let island: Ilimit[] = [];
    let flag: "insideIsland" | "outesideIsland" | "finishIsland" | "" = "";
    
    if(roomLimit){
        for(let i=0; i < roomLimit.length; i++){
            
            if(roomLimit[i].x === "insideIsland" 
            && roomLimit[i].z === "insideIsland"){
                flag = "insideIsland";
                island = [];
            }
            
            if(roomLimit[i].x === "outesideIsland" 
            && roomLimit[i].z === "outesideIsland"){
                flag = "outesideIsland";
                island = [];
            }
            
            if(roomLimit[i].x === "finishIsland" 
            && roomLimit[i].z === "finishIsland"
            && flag === "insideIsland"){
                flag = "finishIsland";
                insideIslands.push([...island])
            }
    
            if(roomLimit[i].x === "finishIsland" 
            && roomLimit[i].z === "finishIsland"
            && flag === "outesideIsland" ){
                flag = "finishIsland";
                outsideIslands.push([...island])
            }
            
    
            if ((flag === "insideIsland" || flag === "outesideIsland") &&
            roomLimit[i].x !== flag &&
            roomLimit[i].z !== flag ){
                island.push(roomLimit[i]) 
            }
        }
    }
    return {
        insideIslands,
        outsideIslands
    }
}

const possibleNextStep = (
    current: Ilimit, 
    next: Ilimit, 
    roomLimit: Ilimit[]
    ): Ilimit => {

        const islands: IIslands = separateByIslands(roomLimit)

        const x = current.x, z = current.z;
        let tryNext = {...next};
        
        for (let i=0; i< islands.insideIslands.length; i++){
            if(!isCameraInRoom(tryNext, islands.insideIslands[i])){
                tryNext = {...next, x};
                if(!isCameraInRoom(tryNext, islands.insideIslands[i])){
                    tryNext = {...next, z};
                    if(!isCameraInRoom(tryNext, islands.insideIslands[i])){
                        tryNext = {...current};
                    }
                }
            } 
        }
     
        for (let i=0; i< islands.outsideIslands.length; i++){
            if(isCameraInRoom(tryNext, islands.outsideIslands[i])){
                tryNext = {...next, x};
                if(isCameraInRoom(tryNext, islands.outsideIslands[i])){
                    tryNext = {...next, z};
                    if(isCameraInRoom(tryNext, islands.outsideIslands[i])){
                        tryNext = {...current};
                    }
                }
            } 
        }
        return tryNext;
};

const coordCalc = (i: number, step: number, start: number, finish: number) => {
    
    return Math.pow(Math.sin(Math.acos(1 - i*step)), 6)*(finish-start)+start
}





const softPathTo = (
    startCameraPosition: Vector3, 
    finishCameraPosition: Vector3, 
    startCameraView: Vector3, 
    finishCameraView: Vector3, 
    steps: number): any[] =>{
        let normStartView = new Vector3()  
        normStartView.set(
            Math.acos(Math.cos(startCameraView.x)),
            Math.acos(Math.cos(startCameraView.y)),
            Math.acos(Math.cos(startCameraView.z))
        )

      
        let step = 1/steps
        const {x: spx, y: spy, z: spz} = startCameraPosition
        const {x: fpx, y: fpy, z: fpz} = finishCameraPosition
        const {x: slx, y: sly, z: slz} = startCameraView
        const {x: flx, y: fly, z: flz} = finishCameraView
        
        let softSteps: any[] = []
        for (let i = 0; i < steps; i++){
        const position = new Vector3()
        position.set(
            coordCalc(i,step,spx,fpx),
            coordCalc(i,step,spy,fpy),
            coordCalc(i,step,spz,fpz),
        ) 
        const lookAt = new Vector3()
        lookAt.set(
            coordCalc(i,step,slx,flx),
            coordCalc(i,step,sly,fly),
            coordCalc(i,step,slz,flz),
        ) 
        softSteps.push({
            position,
            lookAt
        })
    }
    softSteps.shift()     // first === 0 no need
    return softSteps
}

const preloadingTextureBeforeView = (
    renderer: WebGLRenderer, 
    texture: any
) =>{
    renderer.initTexture(texture)
}

export {
        HomePage, inferStringLiteral,
        isCameraInRoom, possibleNextStep,
        softPathTo, preloadingTextureBeforeView
    }