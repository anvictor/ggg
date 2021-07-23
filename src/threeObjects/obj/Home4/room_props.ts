import { Vector3, Euler } from "three"
import { Ilimit } from "../../../utils/interfaces"

const roomScale = new Vector3(100,100,100)
const roomRotation = new Euler(0, 0, 0)
const roomPosition =  new Vector3(0, 0, 0)
const isLightsOn = true;
const isLightHelpers = true
const lights = {
    spotLightPosition: {x: 680, y: 900, z: 1000},
    spotLightTargetPosition: {x: 300, y: 0, z: 130},
    dirLightPosition: {x: 0, y: 300, z: 0},
    dirLightTargetPosition: {x: 200, y: 0, z: -10}
}
const Limit: Ilimit[] =[
    {x:   "insideIsland", z:  "insideIsland"},// big example square
    {x: -2000, z:     -2000}, // portalRight out
    {x: -2000, z:     2000}, // portalRight out
    {x: 2000, z:     2000}, // portalRight out
    {x: 2000, z:     -2000}, // portalRight out
    
    {x:   "finishIsland", z:  "finishIsland"},
    {x:   "outesideIsland", z:  "outesideIsland"},// room
    // inside *******************************************
   

    {x:   "finishIsland", z:  "finishIsland"},
  ];
  export {
    roomScale, 
    roomRotation, 
    roomPosition, 
    isLightsOn, 
    isLightHelpers, 
    lights, 
    Limit,
  }