import  {TextureLoader, WebGLRenderer} from "three";
import { elementsLoadingCounter, singleTonTxtr } from "../unitedStates/configState";
import { preloadingTextureBeforeView } from "../utils/GlobalFunctions";

 
const textureLoader = new TextureLoader();
const exclusion = ["checker", "window_glasses"]
const noMapMessage = (mapName:string, name:string, ) => {
    
    if(!exclusion.includes(name)){
        // logging those that are lacking
        console.log(`no ${name}${mapName}`); 
    }
}

const logTxtr= (name: string, txtr: any)=>{
    // console.log(name,txtr);
}

export const skinTextures=(
    name: string,
    renderer: WebGLRenderer, 
    skin?: string, 
    room?: string 
) =>{
    
    let AoMap_src;
    let ao_txtr;
    if(!exclusion.includes(name) && !singleTonTxtr.hasOwnProperty(`${name}_aoMap`)){ 
        try {
            AoMap_src = require(`../threeObjects/obj/${room}/${skin}/${name}_aoMap.jpg`)
            ao_txtr = textureLoader.load(AoMap_src.default,
                texture=>preloadingTextureBeforeView(renderer, texture)
                ); 

            ao_txtr.name = `${room}_${name}_aoMap`
            singleTonTxtr[`${name}_aoMap`] = ao_txtr;
            logTxtr("_aoMap", singleTonTxtr);
            
        } catch (error) {
            ao_txtr = null;
            noMapMessage("_aoMap.jpg",name)
        }  
    }else{
        if(!exclusion.includes(name)){
            ao_txtr = singleTonTxtr[`${name}_aoMap`]?singleTonTxtr[`${name}_aoMap`]:null;
        }
    }
        
    
        
        
    let lightMap_src;
    let light_txtr;
    if(!exclusion.includes(name) && !singleTonTxtr.hasOwnProperty(`${name}_lightMap`)){ 
        try {
            lightMap_src = require(`../threeObjects/obj/${room}/${skin}/${name}_lightMap.jpg`)
            
            light_txtr = textureLoader.load(lightMap_src.default,
                texture=>preloadingTextureBeforeView(renderer, texture)
            ); 
            light_txtr.name = `${room}_${name}_lightMap`
            singleTonTxtr[`${name}_lightMap`] = light_txtr;
            logTxtr("_lightMap", singleTonTxtr);
        } catch (error) {
            light_txtr = null;
            noMapMessage("_lightMap.jpg",name)
        }  
    }else{
        if(!exclusion.includes(name)){
            light_txtr = singleTonTxtr[`${name}_lightMap`]?singleTonTxtr[`${name}_lightMap`]:null;
        }
    }

    let roughnessMap_src;
    let roughness_txtr;
    if(!exclusion.includes(name) && !singleTonTxtr.hasOwnProperty(`${name}_roughnessMap`)){ 
        try {
            
            roughnessMap_src = require(`../threeObjects/obj/${room}/${skin}/${name}_roughnessMap.jpg`)
            roughness_txtr = textureLoader.load(roughnessMap_src.default,
                texture=>preloadingTextureBeforeView(renderer, texture)
                ); 
        
            roughness_txtr.name = `${room}_${name}_roughnessMap`
            singleTonTxtr[`${name}_roughnessMap`] = roughness_txtr;
            logTxtr("_roughnessMap", singleTonTxtr);
        } catch (error) {
            roughness_txtr = null;
            noMapMessage("_roughnessMap.jpg",name)
        }  
    }else{
        if(!exclusion.includes(name)){
            roughness_txtr = singleTonTxtr[`${name}_roughnessMap`]?singleTonTxtr[`${name}_roughnessMap`]:null;
        }
    }

    let normalMap_src;
    let normal_txtr;
    if(!exclusion.includes(name) && !singleTonTxtr.hasOwnProperty(`${name}_normalMap`)){ 
        try {
            normalMap_src = require(`../threeObjects/obj/${room}/${skin}/${name}_normalMap.jpg`)
            normal_txtr = textureLoader.load(normalMap_src.default,
                texture=>preloadingTextureBeforeView(renderer, texture)
                ); 
                
            normal_txtr.name = `${room}_${name}_normalMap`
            singleTonTxtr[`${name}_normalMap`] = normal_txtr;
            logTxtr("_normalMap", singleTonTxtr);
        } catch (error) {
            normal_txtr = null;
            noMapMessage("_normalMap.jpg",name)
        }  
    }else{
        if(!exclusion.includes(name)){
            normal_txtr = singleTonTxtr[`${name}_normalMap`]?singleTonTxtr[`${name}_normalMap`]:null;
        }
    }

        let map_src;
        let map_txtr;
        const countHandler = (txtr: any) => {
            // stop loading every texture
            elementsLoadingCounter.value--;
            // console.log('- texture', elementsLoadingCounter.value, "txtr", txtr.name);
        }
        if(!exclusion.includes(name) && !singleTonTxtr.hasOwnProperty(`${name}_map`)){ 
        try {
            map_src = require(`../threeObjects/obj/${room}/${skin}/${name}_map.jpg`)
            map_txtr = textureLoader.load(map_src.default,
                texture=>{
                    preloadingTextureBeforeView(renderer, texture)
                    countHandler(texture)
                }
                );  
            map_txtr.name = `${room}_${name}_map`
            singleTonTxtr[`${name}_map`] = map_txtr;
            // console.log("_map", singleTonTxtr);
        } catch (error) {
            map_txtr = null;
            noMapMessage("_map.jpg",name)
        } 
    }else{
        if(!exclusion.includes(name)){

            map_txtr = singleTonTxtr[`${name}_map`]?singleTonTxtr[`${name}_map`]:null;
            countHandler(map_txtr)
        }
    }
    
    
    const resultTexture = {
        ao_txtr: ao_txtr,
        light_txtr: light_txtr,
        roughness_txtr: roughness_txtr,
        normal_txtr: normal_txtr,
        map_txtr: map_txtr,
    }

    return resultTexture
}
    

    