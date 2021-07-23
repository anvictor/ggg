import React, {useRef, useEffect, useState} from 'react';
import './gallery.scss';
import  {
  Scene, Group, Clock, Vector3, Euler,
  Vector2, Raycaster,  Object3D,   Intersection,
  CubeTextureLoader, Color,
  TextureLoader, RepeatWrapping,  MathUtils, MeshStandardMaterial     
} from "three";
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2'; // 2
import { FirstPersonControls } from '../../threeObjects/controls/FirstPersonControls';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import {addLights} from '../../componentsThreeJs/lights';
import {antuorage} from "../PaintsStore/paintsSrc";
import {onKeydown, onKeyup} from "../../threeObjects/controls/keysListener";
import {mouseGetXY} from '../../threeObjects/controls/mouseGetXY';
import PaintsBar from "../PaintsStore/PaintsBar";
import {Arrows3d, Tips, ArrowsNextPrev, PaintInfo,  SaveBtn, ClearBtn} from "../HtmlOverCanvasComponents/HtmlOver";
import Loading from "../Loading/Loading";
import {perspectiveCamera} from "../../componentsThreeJs/perspectiveCamera";
import {Renderer} from "../../componentsThreeJs/renderer";
import { observer } from 'mobx-react';
import {skinMaterials} from "../../componentsThreeJs/materials";
import {Paint3d} from "../../componentsThreeJs/paintsGenerator";
import { apiSaveCanvas, apiClearCanvas} from '../../componentsThreeJs/api.metods';
import {
  wallsGlueSetMode, 
  raycastingFrequency, wayStepsToCanvas, 
  elementsLoadingCounter, loadingIncrementCounter,
  singleTonMtl, glue_step_roundTo
} from "../../unitedStates/configState";
import { softPathTo } from '../../utils/GlobalFunctions';
import {
  room_lights, room_limit, room_Object,
  room_Position, room_Rotaion, room_Scale,
  wall_canvas_glue_props, normalized_names_props
} from "../../componentsThreeJs/roomProps";
// require is good. do not change // TODO move to separate module
const canvas_obj = require("../../threeObjects/obj/canvas.obj"); 
const glass_texture = require("../../images/glass.jpg"); 
const checker = require("../../images/checker-map_tho.png"); 
// shift paintCanvas on walls vertically by step
let paintsOnTheWalls = new Group();
let changeSensor = 0;

const GalleryRoom: any = observer((props: any) => {
    let loading: boolean = true; 
  const choosedRoom: string = props.roomId
  const [isTouchScreen, setIsTouchScreen] = useState(false);
  let [skin, setSkin] = useState(props.roomSkin);
  let paintsFromLinks = props.paintsOnWall
  /**
   * paintPicture is a definite picture from a 2D list {name, width, height, url}
   * paintCanvas is a 3D object inside <canvas/> html Tag
   */
  const raycaster = new Raycaster(new Vector3(), new Vector3(), 0, 500000);
  let mouse = new Vector2(0, 0);
  let roomParts: Object3D[] =[];

  
  const viewHeight = 178/100*90; // sm
  // const viewHeight = 500 // high point of view
  const renderer  = Renderer();
  const title: string = choosedRoom;
  document.title=(`3d Gallery web ${title}`);

  let roomObject = room_Object(choosedRoom);
  let roomLimit = room_limit(choosedRoom);
  let lightsData = room_lights(choosedRoom);
  let roomPosition =  room_Position(choosedRoom);
  let roomRotation = room_Rotaion(choosedRoom);
  let roomScale =  room_Scale(choosedRoom);
  
  
  const clock = new Clock();
  const mount = useRef(null);
  /************************************************* */
  const textureLoader = new TextureLoader();
  const glass_txtr = textureLoader.load( glass_texture.default ); 
        glass_txtr.name = "Glass"
  
  /*
  checker texture is bright & attractive 
  for checking of scene children
  */ 
  const checker_txtr = textureLoader.load( checker.default ); 
  checker_txtr.wrapS = RepeatWrapping;
  checker_txtr.wrapT = RepeatWrapping;
  checker_txtr.name = "Checker"
  
  const mtl_checker = new MeshStandardMaterial({ map: checker_txtr });
  mtl_checker.name = 'mtl_checker';
  
  const mtl_glass = new MeshStandardMaterial({ map: glass_txtr});
  mtl_glass.name = 'mtl_glass';
  mtl_glass.emissive = new Color('#fff');
  mtl_glass.emissiveIntensity = 0.8;
  mtl_glass.opacity = 0.5;
  mtl_glass.transparent = true;
  /************************************************* */
  const swapOrder = (paints: any) => {
    paintsOnTheWalls.children.forEach((mesh: Object3D) => {
        mesh.userData.order = paints.filter((paint: { id: any; }) => paint.id === mesh.userData.id)[0].order
    })
  }
  
  useEffect(() => {
    const isTouchScreen = !!("ontouchstart" in window || navigator.msMaxTouchPoints);
    setIsTouchScreen(isTouchScreen)
    let currentTourPointOrder: number = 0
    let  UserX:number;
    let  UserY:number;
    let softPath: Vector3[] = []
    let startView = new Vector3()
    let finView = new Vector3(0, 0, -1);
    let lastPaintName: string = ""
    let lastPaintCanvasPosition: Vector3;
    let lastPaintCanvasRotaion: Euler;

    const setUserXY = (event: MouseEvent)=>{
      UserX = event.clientX
      UserY = event.clientY
    }

    const hangOff = ()=>{
      paintCanvasInHand=null;
      paintPictureInHand = null;
      tips.setAttribute("style", "display:none")
    }

    const deletePaint = ()=>{
      if(paintCanvasInHand){
        paintCanvasInHand.parent.remove(paintCanvasInHand)
        paintCanvasInHand=null;
        paintPictureInHand = null;
      }
      tips.setAttribute("style", "display:none")
    }

    const escComeBack = ()=>{
      paintCanvasInHand.position.copy(lastPaintCanvasPosition)
      paintCanvasInHand.rotation.copy(lastPaintCanvasRotaion)
      hangOff()
    }

    const blinkPaint = (paint: any) => {
      if(lastPaintName !== paint.parent.userData.name){
        paint.material= singleTonMtl.mtlShadowHglghtd
        setTimeout(() => {
          paint.material = singleTonMtl.mtlShadow
        },1000)
      }
      lastPaintName = paint.parent.userData.name
    }

    const cameraGoToPaintCanvas = (paintCanvasName: any) => {
      
      const paintCanvas: Object3D = paintsOnTheWalls.children.filter((item: { name: string; })=>item.name === `paint_${paintCanvasName}`)[0]
      currentTourPointOrder = paintCanvas.userData.order;

      let sign = Math.sign(paintCanvas.rotation.y);
      sign = sign === 0 || sign === 1 ? -1 : 1;
      let zAxis = Math.abs(Math.round(MathUtils.radToDeg(paintCanvas.rotation.y)));
      let z = 0, x = 0;
      let goodDistanceCoeff = 8
      let viewDistance = 
      paintCanvas.userData.width>paintCanvas.userData.height
      ? paintCanvas.userData.width / goodDistanceCoeff
      : paintCanvas.userData.height / goodDistanceCoeff
      
      if ((zAxis >-1 && zAxis < 1) || (zAxis > 179 && zAxis < 181)) {
        if(paintCanvas.rotation.x < 0){
          z = -viewDistance;
        }else{
          z = viewDistance;
        }
      } else if (zAxis > 89 && zAxis < 91) {
          x = viewDistance
      }
      const finCameraPosition = new Vector3()
      finCameraPosition.set(
        paintCanvas.position.x + x * sign, 
        paintCanvas.position.y - paintCanvas.userData.height/20, 
        paintCanvas.position.z + z * sign
      )
      //  console.log("finCameraPosition", finCameraPosition);
     
      const lookAtNow = (new Vector3( 0, 0, -1 )).applyQuaternion( camera.quaternion ).add( camera.position )
      startView.set(
        lookAtNow.x,
        lookAtNow.y,
        lookAtNow.z,
      )
      
      finView.set(
        paintCanvas.position.x, 
        paintCanvas.position.y-paintCanvas.userData.height/20, 
        paintCanvas.position.z
      );

      softPath = softPathTo(
        camera.position, 
        finCameraPosition,
        startView,
        finView,
        wayStepsToCanvas 
      )
    }

    const cameraGoToPointOnFloor = (point: Vector3) => {
      point.setY(viewHeight)
      const lookAtNow = (new Vector3( 0, 0, -1 )).applyQuaternion( camera.quaternion ).add( camera.position )
      
      startView.set(
        lookAtNow.x,
        lookAtNow.y,
        lookAtNow.z,
      )
      finView.set(
        lookAtNow.x,
        lookAtNow.y,
        lookAtNow.z+10,
      )
      
      softPath = softPathTo(
        camera.position, 
        point,
        startView,
        point,
        wayStepsToCanvas 
      )
    }

    const flyCamera=(finCameraPosition: Vector3) =>{
      camera.position.set(
        finCameraPosition.x,
        finCameraPosition.y,
        finCameraPosition.z
        );
        controls.viewHeight = finCameraPosition.y
    }

    const turnCamera=(finCameraLookAt: Vector3) =>{
      controls.lookAt(
        finCameraLookAt.x,
        finCameraLookAt.y,
        finCameraLookAt.z
        );
    }
    
    const setLoadingVisibility = () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if(loading){
        // eslint-disable-next-line react-hooks/exhaustive-deps
        loading = !!elementsLoadingCounter.value
        Loading.setAttribute("style",`display:${loading?"block":"none"}`)
      }
    }

    const setPaintInfo = (x:number,y:number,argsStr: string)=>{
          
      if(argsString !== argsStr && props.userMode === "guest"){
        
        argsString = argsStr

        const args = argsStr.split(",")
        const name: string = args[0]
        const width: number = +args[1]
        const height: number = +args[2]
        const description: string = args[3]
        const visibility: string = args[4]
        
        paintInfo.setAttribute("class", `paintInfo_active`)
        paintInfo.setAttribute("style",`${isTouchScreen?"right":"left"}:${isTouchScreen?0:x+25}px;top:${isTouchScreen?0:y+25}px;display:${visibility==="visible"?"block":"none"}`)
        
        paintInfo.innerHTML = `
        <h3>name: ${name}</h3>
        <p>Author: <br>
        ${description}<br>
        Width: ${width}<br>
        Height: ${height}</p>
        `
        setTimeout(()=>{
          paintInfo.setAttribute("class", `paintInfo`)
        paintInfo.innerHTML = ``
        },3000)
        
      }
    }

    const glue_props = wall_canvas_glue_props(choosedRoom)
    const names_props = normalized_names_props(choosedRoom)?normalized_names_props(choosedRoom).normalized_names:null;
    
    const tips = document.getElementsByClassName("tips")[0]
    const paintInfo = document.getElementById("paintInfo")
    const Loading = document.getElementById("Loading")
    const Arrow3dDown = document.getElementById("Arrow3dDown")
    const Arrow3dUp = document.getElementById("Arrow3dUp")
    const Arrow3dLeft = document.getElementById("Arrow3dLeft")
    const Arrow3dRight = document.getElementById("Arrow3dRight")
    const Arrow3dPrev = document.getElementById("Arrow3dPrev")
    const Arrow3dNext = document.getElementById("Arrow3dNext")
    const delete_btn = document.getElementById("delete_btn")
    const enter_btn = document.getElementById("enter_btn")
  
    let getNormName = (
      name: string, 
      choosedRoom: string
      ) =>{
      
      let nName = {
        mtl:mtl_checker, 
        type: "noType",
        roomChildrenLengthDec:0
      }
      // console.log(names_props);
      
        for (let [key1] of Object.entries(names_props)) {
          for(let i=0; i<names_props[key1].length; i++){
            if(names_props[key1][i]===name){
              
              // start loading every texture
              elementsLoadingCounter.value++
              loadingIncrementCounter.value = false
              const data = skinMaterials(skin,choosedRoom,key1,renderer) 
              nName.mtl = data.mtl
              
              // console.log('+ texture', elementsLoadingCounter.value, "txtr", data.mtl.name);

              if(key1==="window_glasses"){
                // finish loading every texture
                elementsLoadingCounter.value--
                // console.log('- texture', elementsLoadingCounter.value,"txtr", mtl_glass.name);
                nName.mtl = mtl_glass
              }
              nName.type = key1
              return nName
            }
          }
        }
      return nName
    }

    let paintPictureInHand = null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let newPaintCanvas: Object3D;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let paintPosition = {x:0,y:0,z:200}; 
    let paintCanvasInHand: Object3D;
    let canvasProto:any;
    
    const canvasLoader = new OBJLoader2();
       
    canvasLoader.load( canvas_obj.default, (сanvasMesh)=> {
      canvasProto = сanvasMesh.children[0]
      getCanvasOnTheWalls();
    }, undefined, function ( error ) {} );

    const getCanvasOnTheWalls = async () => {
     
      if(paintsFromLinks && paintsFromLinks.length){
        paintsOnTheWalls.children=[];
        paintsFromLinks.forEach((element:any) => {
          newPaintCanvas = Paint3d(
            element,
            element.url,
            canvasProto.clone(),
            paintsOnTheWalls,
            renderer        
          )
        });
      }
    };
      
    console.log("paintsOnTheWalls", paintsOnTheWalls);

   

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let canvasCoord: {
      canvasPosition: Vector3; 
      canvasRotaion: Euler;
    };

    let width = window.innerWidth;
    let height = window.innerHeight;
    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener( 'keyup', (event)=> onKeyup(event, "up"), false );
    Arrow3dUp.addEventListener('mousedown', ()=>Arrows3d("forward"), false);
    Arrow3dUp.addEventListener( 'mouseup',()=> Arrows3d("stop"), false );
    Arrow3dDown.addEventListener('mousedown', ()=>Arrows3d("backward"), false);
    Arrow3dDown.addEventListener( 'mouseup',()=> Arrows3d("stop"), false );
    Arrow3dLeft.addEventListener('mousedown', ()=>Arrows3d("left"), false);
    Arrow3dLeft.addEventListener( 'mouseup',()=> Arrows3d("stop"), false );
    Arrow3dRight.addEventListener('mousedown', ()=>Arrows3d("right"), false);
    Arrow3dRight.addEventListener( 'mouseup',()=> Arrows3d("stop"), false );

    Arrow3dUp.addEventListener('touchstart', ()=>Arrows3d("forward"), false);
    Arrow3dUp.addEventListener( 'touchend',()=> Arrows3d("stop"), false );
    Arrow3dDown.addEventListener('touchstart', ()=>Arrows3d("backward"), false);
    Arrow3dDown.addEventListener( 'touchend',()=> Arrows3d("stop"), false );
    Arrow3dLeft.addEventListener('touchstart', ()=>Arrows3d("left"), false);
    Arrow3dLeft.addEventListener( 'touchend',()=> Arrows3d("stop"), false );
    Arrow3dRight.addEventListener('touchstart', ()=>Arrows3d("right"), false);
    Arrow3dRight.addEventListener( 'touchend',()=> Arrows3d("stop"), false );

    Arrow3dPrev.addEventListener('click', ()=>Arrows3d("prev"), false);
    Arrow3dNext.addEventListener('click', ()=>Arrows3d("next"),false );

    delete_btn.addEventListener( 'click',()=> deletePaint(), false );
    enter_btn.addEventListener( 'click',()=> hangOff(), false );


    document.addEventListener('mousemove', (event) => setUserXY(event), false)
    
    const paintsBar = document.getElementsByClassName("paintsBar")[0]
    renderer.domElement.addEventListener( 'mousemove', (event) => mouseMoveHandler(event), false );
    renderer.domElement.addEventListener( 'touchstart', (event) => mouseMoveHandler(event), false );

    const Arrows3d = (direction:string) => {
      let paintCanvas=undefined;
      controls.isPathAble = false
      lastPaintName = ""
      switch (direction) {
        case "forward":
          controls.enabled = true;
          controls.moveForward = true;
          break;
        case "backward":
          controls.enabled = true;
          controls.moveBackward = true;
          break;
        case "left":
          controls.enabled = true;
          controls.moveLeft = true;
          break;
        case "right":
          controls.enabled = true;
            controls.moveRight = true;
            break;  
        case "stop": 
          controls.enabled = false;
          controls.moveForward = false;
          controls.moveBackward = false;
          controls.moveLeft = false;
          controls.moveRight = false;
          break;
        case "prev": 
          currentTourPointOrder--
          // eslint-disable-next-line no-loop-func
          paintCanvas = paintsOnTheWalls.children.filter(item=>item.userData.order === currentTourPointOrder)[0];
          if(paintsOnTheWalls.children.length){
            // if the picture is missed
            while (!paintCanvas) {
              // eslint-disable-next-line no-loop-func
              paintCanvas = paintsOnTheWalls.children.filter(item=>item.userData.order === currentTourPointOrder)[0];
              // console.log("jump over the missing paintCanvas", currentTourPointOrder);
              currentTourPointOrder--
              if(currentTourPointOrder < 0){
                currentTourPointOrder = Object.keys(paintsFromLinks).length-1
              }
            }
            cameraGoToPaintCanvas(paintCanvas.name.replace("paint_",""));
          }else{alert("First, hang at least 2 paintings on the wall")}
          break;
        case "next": 
        currentTourPointOrder++
        // eslint-disable-next-line no-loop-func
        paintCanvas = paintsOnTheWalls.children.filter(item=>item.userData.order === currentTourPointOrder)[0];
        if(paintsOnTheWalls.children.length){
        // if the picture is missed
        while (!paintCanvas) {
          // eslint-disable-next-line no-loop-func
          paintCanvas = paintsOnTheWalls.children.filter(item=>item.userData.order === currentTourPointOrder)[0];
          // console.log("jump over the missing paintCanvas", currentTourPointOrder);
          
          currentTourPointOrder++
          if(currentTourPointOrder > Object.keys(paintsFromLinks).length){
            currentTourPointOrder = 0
          }
        }
        cameraGoToPaintCanvas(paintCanvas.name.replace("paint_",""));
        }else{alert("First, hang at least 2 paintings on the wall")}
        break;
        default: 
          controls.enabled = false;
          controls.moveForward = false;
          controls.moveBackward = false;
          controls.moveLeft = false;
          controls.moveRight = false;
          break;
      }
    }
    
    // if userMode === "guest" then no paintsBar
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const paintBarListener = props.userMode === "admin"
    ? paintsBar.addEventListener("click", (event)=> handlePaintBarOutOfCanvasClick(event), false)
    : null;
    
    const scene = new Scene();
    
    const loader = new CubeTextureLoader();
    const entourage = loader.load([
      antuorage.px,
      antuorage.nx,
      antuorage.py,
      antuorage.ny,
      antuorage.pz,
      antuorage.nz
    ]);
    scene.background = entourage;

    window.scene = scene; // commit scene to crome developer tool 

    const camera = perspectiveCamera(width, height);
    const camLookAt = new Object3D();
    camera.add( camLookAt );
    function onWindowResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      renderer.setSize( width, height );
      camera.updateProjectionMatrix();
    }

    renderer.setSize( width, height );
    
    document.body.appendChild( renderer.domElement ); // canvas to body
    
    const controls = new FirstPersonControls( camera, renderer.domElement, viewHeight, roomLimit, wallsGlueSetMode );
    controls.movementSpeed = 150;
    controls.lookSpeed = 0.2;
    controls.lookSwipeSpeed = isTouchScreen ? 1.5 : 0.5;
    
    if(lightsData){
      addLights(
        scene,
        lightsData.isLightsOn,
        lightsData.isLightHelpers,
        lightsData.spotLightPosition,
        lightsData.spotLightTargetPosition,
        lightsData.dirLightPosition,
        lightsData.dirLightTargetPosition,
      )
    }
  
    const objLoader = new OBJLoader2();
    const mtlLoader = new MTLLoader();
    scene.add(paintsOnTheWalls );
    mtlLoader.load( checker.default, function( materials ) {
      materials.preload();
    });
    
    
    
    if(roomObject){
      // start loading room object
      elementsLoadingCounter.value++;
      // console.log('+ room', elementsLoadingCounter.value);
      objLoader.load( roomObject.default, function ( RoomMesh ) {
        RoomMesh.position.copy(roomPosition);
        RoomMesh.scale.copy(roomScale);
        RoomMesh.rotation.copy(roomRotation);

        // Assignments to the 'objects' variable from inside React Hook useEffect avoid unnesessery re-render.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        roomParts = RoomMesh.children
        console.log("roomParts", roomParts);
        
       // /**/////////////////////////////////////////////////////////////*****************************************************************************/ 
        roomParts.forEach((mesh:any) => {
          // console.log('"'+mesh.name+'",');
          let nName =  getNormName(mesh.name, choosedRoom)
          if(nName.mtl){
            mesh.material = nName.mtl
          }
          // console.log('mesh', mesh.name, 'nName', nName.mtl.userData.name);
          if(nName.mtl.userData.name === "roof"){

          }
          mesh.receiveShadow = true;
          if(!mesh.name){
            mesh.name = nName.type
          }
        });
        
        // finish loading room object
        elementsLoadingCounter.value--;
        // console.log('- room', elementsLoadingCounter.value);

        scene.add( RoomMesh );
      }, undefined, function ( error ) {} );
    }

    camera.position.x = 0;
    camera.position.y = viewHeight;
    camera.position.z = 300;
    camera.rotation.x = 0;

    const handlePaintBarOutOfCanvasClick = (e: any) =>{
      e.preventDefault();
      const paint_id: string = e.target.dataset.paint_id
      /**
       * Assignments to the 'paintPictureInHand' variable from inside React Hook useEffect will avoid unnesessery re-renders.
       */
      
      paintPictureInHand = paintsFromLinks.filter(paint=> paint.id===paint_id)[0]

      if(paintPictureInHand){
        paintCanvasInHand = paintsOnTheWalls.children.filter(item=>item.name === `paint_${paintPictureInHand.name}`)[0]

        if(!paintCanvasInHand){

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          newPaintCanvas = Paint3d(
            paintPictureInHand, 
            paintPictureInHand.url,
            canvasProto.clone(),
            paintsOnTheWalls,
            renderer        
            )
            paintCanvasInHand = paintsOnTheWalls.children.filter(item=>item.name === `paint_${paintPictureInHand.name}`)[0]
          }
      }
    }

    const mouseMoveHandler = (event: any) =>{
        event.preventDefault();
        let pointer = mouseGetXY(event, width, height, isTouchScreen);
        mouse.x = pointer.x
        mouse.y = pointer.y
    } 
    
    // *********************************************** 
    const canvasTag = document.getElementsByTagName("canvas")[0];
    canvasTag.addEventListener( 'keydown', (event)=> {
      onKeydown(event, camera.position, hangOff, deletePaint, escComeBack);
      (() =>{lastPaintName = ""})()
    }, false );
    
    // *********************************************** 

    let tic: number = 0
    let previousTic: number = 0
    let intersectedPaint: Intersection = null;
    let argsString: string = ""
    
    if(paintPictureInHand){
      paintCanvasInHand = paintsOnTheWalls.children.filter(item=>item.name === `paint_${paintPictureInHand.name}`)[0]
    }
    
    const animate   = (time: number) =>{
      setLoadingVisibility()
      raycaster.setFromCamera(mouse, camera)
      if(softPath.length){
        const step:any = softPath.shift()
        flyCamera(step.position)
        turnCamera(step.lookAt);
      }
      
      tic = Math.round(time*raycastingFrequency/1000)
      let intersects: any[] = []
      if(tic !== previousTic){
        intersects = raycaster.intersectObjects(roomParts);
        if(paintsOnTheWalls.children){
          const visiblePaints: Object3D[] = []
          paintsOnTheWalls.children.forEach(paint => {
            if (paint.userData.isVisible){
              visiblePaints.push(paint)
            }
            paint.userData.isVisible = false
          })
          
          intersectedPaint = raycaster.intersectObjects(visiblePaints)[0];
          
        }
       
        if(changeSensor>0){
          saveCanvas(paintsOnTheWalls.children)
          changeSensor = 0
        }
        if(intersectedPaint && controls.isPathAble ){
          
          if(intersects.length && intersectedPaint.distance < intersects[0].distance){
            const {name, width, height, description} = intersectedPaint.object.userData
            if(props.userMode === "admin"){
              blinkPaint(intersectedPaint.object.children[0])
            }else{
              setPaintInfo(UserX,UserY,`${name},${width},${height},${description},visible`)
            }
            
            if(controls.isMouseDown){
              if(!paintCanvasInHand){
                paintCanvasInHand = paintsOnTheWalls.children.filter(item=>item.name === `paint_${name}`)[0]
                lastPaintCanvasPosition=paintCanvasInHand.position.clone()
                lastPaintCanvasRotaion=paintCanvasInHand.rotation.clone()
              }
              if(props.userMode === "admin"){
                paintPictureInHand = paintsFromLinks.filter(paint=> paint.id===paintCanvasInHand.userData.id)[0]
              }else{
                cameraGoToPaintCanvas(name)
              }
            }
          }
        }else{
          // console.log("** intersected NOTHING");
          
        }
      } //finish of tic scope
      
      requestAnimationFrame( animate );
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      controls.update( clock.getDelta() );
      renderer.render( scene, camera );

      /**
       * Assignments to the 'paintPosition' variable from inside React Hook useEffect will be lost after each render, but this avoid the canvas from being reloaded unnecessarily. 
       */
      if (intersects.length){
        controls.clickPoint = intersects[0].point
      }

      if (
        intersects.length 
        && intersects[0].object.material.userData.name === "floor" 
        && controls.moving
        ){cameraGoToPointOnFloor(intersects[0].point)}

      if (intersects.length && wallsGlueSetMode){
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        paintPosition = intersects[0].point;
      }
      
      if(intersects.length && paintPictureInHand){
        // glue canvas to walls
        let normalized_intersects: any = undefined;
        if (glue_props.normalized_intersects[intersects[0].object.name]!== undefined){
          normalized_intersects = glue_props.normalized_intersects[intersects[0].object.name][intersects[0].face.a]
        }
        
        if(paintCanvasInHand && wallsGlueSetMode){ 
          // you can drag paint to any place, not only inside framed walls area
          // console.log("intersects[ 0 ].point", intersects[ 0 ].point);
          
          paintCanvasInHand.position.copy(intersects[ 0 ].point)
          // console.log(" paintCanvasInHand",  paintCanvasInHand);
          console.log(intersects[0].object.name,intersects[0].face.a)
        }

        if(paintCanvasInHand && normalized_intersects !== undefined){
          if(props.userMode === "admin"){
            tips.setAttribute("style", "display:block")
            paintCanvasInHand.setRotationFromEuler(new Euler(0, normalized_intersects[0], 0))
            paintCanvasInHand.position.x= intersects[ 0 ].point.x;
            paintCanvasInHand.position.y= roundBy(intersects[ 0 ].point.y,glue_step_roundTo);
            paintCanvasInHand.position.z= intersects[ 0 ].point.z;
          } else{
            paintCanvasInHand = null
            paintPictureInHand = null
            normalized_intersects = undefined
          }
        }
      }
      previousTic = tic
    };
    animate(0);
    // ***********************************************

    mount.current.appendChild(renderer.domElement)
    
    const roundBy =(c: number, by: number)=>{
      return Math.round(c/by)*by
    }

    const saveCanvas = (canvases:any) =>{
      const prepareCanvasesData = [];
      canvases.forEach((element: any) => {
        prepareCanvasesData.push({
          description: element.userData.description,
          height: element.userData.height,
          id: element.userData.id,
          name: element.userData.name,
          order: element.userData.order,
          px: element.position.x,
          py: element.position.y,
          pz: element.position.z,
          rx: element.rotation.x,
          ry: element.rotation.y,
          rz: element.rotation.z,
          width: element.userData.width,
          url: element.userData.url
        })
      });
      apiSaveCanvas(prepareCanvasesData, choosedRoom)
    }

    const memoryClear = () => {
      // console.log('** memory clear');
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mount.current.removeChild(renderer.domElement)
      document.removeEventListener( 'keyup', (event)=> onKeyup(event, "up"), false );
      window.removeEventListener( 'resize', onWindowResize, false );
      renderer.domElement.removeEventListener( 'mousemove', (event) => mouseMoveHandler(event), false );
      canvasTag.removeEventListener( 'keydown', (event)=> {
        onKeydown(event,  camera.position  ,hangOff,deletePaint,escComeBack);
        (() =>{lastPaintName = ""})()
      }, false );
      Arrow3dUp.removeEventListener('mousedown', ()=>Arrows3d("forward"), false);
      Arrow3dUp.removeEventListener( 'mouseup',()=> Arrows3d("stop"), false );
      Arrow3dDown.removeEventListener('mousedown', ()=>Arrows3d("forward"), false);
      Arrow3dDown.removeEventListener( 'mouseup',()=> Arrows3d("stop"), false );
      Arrow3dLeft.removeEventListener('mousedown', ()=>Arrows3d("left"), false);
      Arrow3dLeft.removeEventListener( 'mouseup',()=> Arrows3d("stop"), false );
      Arrow3dRight.removeEventListener('mousedown', ()=>Arrows3d("right"), false);
      Arrow3dRight.removeEventListener( 'mouseup',()=> Arrows3d("stop"), false );

      Arrow3dUp.removeEventListener('touchstart', ()=>Arrows3d("forward"), false);
      Arrow3dUp.removeEventListener( 'touchend',()=> Arrows3d("stop"), false );
      Arrow3dDown.removeEventListener('touchstart', ()=>Arrows3d("forward"), false);
      Arrow3dDown.removeEventListener( 'touchend',()=> Arrows3d("stop"), false );
      Arrow3dLeft.removeEventListener('touchstart', ()=>Arrows3d("left"), false);
      Arrow3dLeft.removeEventListener( 'touchend',()=> Arrows3d("stop"), false );
      Arrow3dRight.removeEventListener('touchstart', ()=>Arrows3d("right"), false);
      Arrow3dRight.removeEventListener( 'touchend',()=> Arrows3d("stop"), false );

      Arrow3dPrev.removeEventListener('click', ()=>Arrows3d("prev"), false);
      Arrow3dNext.removeEventListener('click', ()=>Arrows3d("next"),false );

      delete_btn.removeEventListener( 'click',()=> deletePaint(), false );
    enter_btn.removeEventListener( 'click',()=> hangOff(), false );

      if(paintsBar){
        paintsBar.removeEventListener("click", (event)=> handlePaintBarOutOfCanvasClick(event), false)
      }
      
      document.removeEventListener('mousemove', (event) => setUserXY(event), false)
      renderer.domElement.removeEventListener( 'touchstart', (event) => mouseMoveHandler(event), false );
      while(scene.children.length > 0){ 
        console.warn("removed", scene.children[0]);
        scene.remove(scene.children[0]); 
      }
    }
    
    return memoryClear
  }, [changeSensor]
  );
  
  

  return (
    <div 
      className="Room_Type"
      ref={mount}
    >
     
      <PaintInfo/>
      
      {props.userMode === "admin" &&
      <>
        <PaintsBar
          swapOrder ={swapOrder}
          paints={paintsFromLinks}
        /> 
        {/* injected comment */}
        {/* NEXT injected comment */}
        <SaveBtn
          onChangeSensor = {()=>{changeSensor++}}
        />

        <ClearBtn
          apiClearCanvas = {apiClearCanvas}
        />
      </>
      }
    
    <Tips
      isTouchScreen = {isTouchScreen}
    />
    <Arrows3d
      isTouchScreen = {isTouchScreen}
    />

    <ArrowsNextPrev
      isTouchScreen = {isTouchScreen}
    />

    {loading
    ? <Loading/>
    : <></>
    }
    
    
    </div>
  );
});

export default GalleryRoom;
