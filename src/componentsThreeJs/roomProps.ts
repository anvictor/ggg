const room_Object=(room:string) =>{
  let roomObj: any = null;
  if(room !== "init"){
    roomObj = require(`../threeObjects/obj/${room}/room.obj`); 
  }
  return   roomObj
}

const room_limit=(room:string) =>{
  let limit: any = null;
  if(room !== "init"){
    limit = require(`../threeObjects/obj/${room}/room_props.ts`).Limit; 
  }
  return   limit
}

const room_lights=(room:string) =>{
  let lights: any = null;
  if(room !== "init"){
    lights = require(`../threeObjects/obj/${room}/room_props.ts`).lights; 
  }
  return   lights
}

const room_Scale=(room:string) =>{
  let Scale: any = null;
  if(room !== "init"){
    Scale = require(`../threeObjects/obj/${room}/room_props.ts`).roomScale; 
  }
  return   Scale
}

const room_Rotaion=(room:string) =>{
  let Rotaion: any = null;
  if(room !== "init"){
    Rotaion = require(`../threeObjects/obj/${room}/room_props.ts`).roomRotation; 
  }
  return   Rotaion
}

const room_Position=(room:string) =>{
  let Position: any = null;
  if(room !== "init"){
    Position = require(`../threeObjects/obj/${room}/room_props.ts`).roomPosition; 
  }
  return   Position
}

const wall_canvas_glue_props=(room:string) =>{
  let glue: any = null;
  if(room !== "init"){
    glue = require(`../threeObjects/obj/${room}/normalized_intersects.ts`); 
  }
  return   glue
}

const normalized_names_props=(room:string) =>{
  let name_props: any = null; 
  if(room !== "init"){
    name_props = require(`../threeObjects/obj/${room}/normalized_names.ts`); 
  }
  return name_props
}

export {room_Object,
        room_limit,
        room_lights,
        room_Scale,
        room_Rotaion,
        room_Position,
        wall_canvas_glue_props,
        normalized_names_props
      }
