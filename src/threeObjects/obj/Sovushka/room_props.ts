import { Vector3, Euler } from "three"
import { Ilimit } from "../../../utils/interfaces"

const roomScale = new Vector3(1,1,1)
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
    {x: -1000, z:     -1000}, // portalRight out
    {x: -1000, z:     1000}, // portalRight out
    {x: 1000, z:     1000}, // portalRight out
    {x: 1000, z:     -1000}, // portalRight out
    
    {x:   "finishIsland", z:  "finishIsland"},
    {x:   "outesideIsland", z:  "outesideIsland"},// room
    // inside *******************************************
    {x: -446, z: -220}, //door in left inside
    {x: -446, z:  350}, //wall door in left
    {x: -233, z:  350}, //wall partition corner
    {x: -233, z:   -9}, //partition end1
    {x: -187, z:   -9}, //partition end2
    {x: -187, z:  350}, //partition wall corner 
    {x:  457, z:  350}, //wall corner 
    {x:  457, z:  117}, //wall partition corner 
    {x:  196, z:  117}, //partition out corner 
    {x:  196, z: -166}, //partition end1 
    {x:  214, z: -166}, //partition end2
    {x:  214, z:   77}, //partition in corner
    {x:  475, z:   77}, //partition wall corner
    {x:  475, z: -211}, //door out right inside
    // outside *******************************************
    {x:  534, z: -211}, //door out left outside
    {x:  534, z:  395}, //building corner out
    {x: -520, z:  395}, //building corner out
    {x: -520, z: -220}, //building corner out
    {x:   "finishIsland", z:  "finishIsland"},
    {x:   "outesideIsland", z:  "outesideIsland"},// room
    // outside *******************************************
    {x: -520, z: -280}, //door in left outside
    {x: -520, z: -430}, //building corner out
    {x:  534, z: -430}, //building corner out
    {x:  534, z: -280}, //door out left outside
    // inside *******************************************
    {x:  475, z: -280}, //door out left outside
    {x:  475, z: -354}, //wall windows corner
    {x: -170, z: -354}, //wall partition windows corner
    {x: -170, z: -190}, //partition end1
    {x: -215, z: -190}, //partition end2
    {x: -215, z: -354}, //partition wall windows corner
    {x: -446, z: -354}, //wall windows corner
    {x: -446, z: -280}, //door in right inside

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