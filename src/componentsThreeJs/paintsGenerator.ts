import shadowImg from '../images/squareshadow.png';
import {contactShadowOpacity} from "../unitedStates/configState";
import {singleTonMtl} from "../unitedStates/configState";
import {preloadingTextureBeforeView} from '../utils/GlobalFunctions'
import  { 
  TextureLoader, MeshLambertMaterial, 
  Mesh, PlaneGeometry, WebGLRenderer, 
  LinearFilter, Texture,   
  } from "three";
const textureLoader = new TextureLoader();
const shadowOffset = 15

export const Paint3d =(
  element: any, 
  src: string,
  сanvasMeshClone:any,
  paintsOnTheWalls: any,
  renderer: WebGLRenderer
  ):any =>{
console.log(
  // "Paint3d args",
  // element,
  // src,
//   сanvasMeshClone,
//   paintsOnTheWalls,
//   renderer
)

// img ratio
let imgRatio = 0;
const img = new Image();
img.onload = function() {
  imgRatio = img.height/img.width
//********************************************* */
// contact shadow
let mtlShadow = new MeshLambertMaterial();
let textureShadow: Texture;

if(!singleTonMtl.hasOwnProperty("mtlShadow")){
  
   textureShadow = textureLoader.load( shadowImg,
    texture=>preloadingTextureBeforeView(renderer, texture)
  ); 

  mtlShadow.map = textureShadow
  mtlShadow.name = `mtl_Shadow`
  mtlShadow.transparent = true
  mtlShadow.opacity = contactShadowOpacity
  singleTonMtl["mtlShadow"] = mtlShadow
} else {
  mtlShadow = singleTonMtl["mtlShadow"]
}

// contact shadow Highlighted
let mtlShadowHglghtd = new MeshLambertMaterial();

if(!singleTonMtl.hasOwnProperty("mtlShadowHglghtd")){
  singleTonMtl["mtlShadowHglghtd"] = mtlShadowHglghtd
} 


const shadow = new Mesh(new PlaneGeometry(
  100 + shadowOffset, 
  100 + shadowOffset 
  ), mtlShadow)
shadow.position.set(0,-55,-0.5)
shadow.rotateY(Math.PI)
shadow.name="shadow"

// Obj3d with paint on it
const texturePaint = textureLoader.load( src,
  texture=>preloadingTextureBeforeView(renderer, texture)
); 

texturePaint.minFilter = LinearFilter;

texturePaint.name =  `texture_${element.name}`;

const mtlPaint = new MeshLambertMaterial({map: texturePaint });
mtlPaint.name = `mtl_${element.name}`;


сanvasMeshClone.material = mtlPaint;
сanvasMeshClone.name = `paint_${element.name}`
сanvasMeshClone.position.x=element.px
сanvasMeshClone.position.y=element.py
сanvasMeshClone.position.z=element.pz
сanvasMeshClone.rotation.x=+element.rx
сanvasMeshClone.rotation.y=+element.ry
сanvasMeshClone.rotation.z=+element.rz
сanvasMeshClone.scale.x = element.width/1000
сanvasMeshClone.scale.y = element.width/1000 * imgRatio
сanvasMeshClone.userData = {
  src: src,
  name:element.name,
  order: element.order,
  description:element.description,
  width:element.width,
  height:element.height,
  id:element.id,
  url:element.url
} 
сanvasMeshClone.material.userData.parent = сanvasMeshClone

сanvasMeshClone.onBeforeRender = (renderer:any, scene:any, camera:any, geometry:any, material:any, group:any) =>{
  material.userData.parent.userData.isVisible = true
}
сanvasMeshClone.add(shadow)

return !!paintsOnTheWalls.add(сanvasMeshClone)

//******************************************** */
}
img.src = src;


}
