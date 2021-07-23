import {userMode, choosed_room} from "../unitedStates/configState";
// import {paintsCanvasOnTheWalls} from '../threeObjects/obj/BrickGallery/paintsCanvasOnTheWalls';
console.log(`choosed_room`, choosed_room)
// const paintsCanvasOnTheWalls = require(`../threeObjects/obj/${choosed_room}/paintsCanvasOnTheWalls`).paintsCanvasOnTheWalls; 
const paintsCanvasOnTheWalls = require(`../threeObjects/obj/Sovushka/paintsCanvasOnTheWalls`).paintsCanvasOnTheWalls; 
const save = async(canvases:any, room:string)=>{
    const jsoned = JSON.stringify(canvases)
    localStorage.setItem(`gallery3d_${room}`,jsoned);
    
}

const awaitGet = () =>{
    let canvases:any;
    console.log(localStorage.getItem(`gallery3d_${choosed_room}`));
    
    
    try {
        canvases = userMode === "admin" 
        ?localStorage.getItem(`gallery3d_${choosed_room}`)
            ? JSON.parse('' + localStorage.getItem(`gallery3d_${choosed_room}`))
            : JSON.parse('' + paintsCanvasOnTheWalls)
        : JSON.parse('' + paintsCanvasOnTheWalls)
    } catch (error) {
        console.log('͡☠:', error);
    }
    
    return canvases
}


const get = async ()=>{
    let canvases = await awaitGet()
    return canvases
}

export const apiSaveCanvas = async (canvases: any, room:string): 
Promise<any> => {
    return await save(canvases, room);
};

export const apiGetCanvasOnTheWals = async (): 
Promise<any> => {
    const roomCanvasOntheWalls = get()
    
    return await roomCanvasOntheWalls;
};

export const apiClearCanvas = () => {
    console.log("apiClearCanvas");
    localStorage.removeItem(`gallery3d_${choosed_room}`)
    document.location.reload();
}