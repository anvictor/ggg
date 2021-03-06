// const choosed_room: string = "G_1_12x16"
const choosed_room: string = "BrickGallery"

const userMode: string = "admin" //["guest", "admin"]
const wallsGlueSetMode = false;
const wallsLimitsSetMode = false;
const contactShadowOpacity = 0.5
const raycastingFrequency = 5//oscillations per second
const wayStepsToCanvas = 50
const elementsLoadingCounter = {value:0}
const loadingIncrementCounter = {value:false}
let singleTonMtl:any = {};
let singleTonTxtr:any = {};
let singleTonGetPaintsData:any = {data: 'init'};
const glue_step_roundTo = 1
export {
    choosed_room, userMode, wallsGlueSetMode, 
    contactShadowOpacity, raycastingFrequency, 
    wayStepsToCanvas, elementsLoadingCounter, 
    loadingIncrementCounter, singleTonMtl,
    singleTonTxtr, singleTonGetPaintsData,
    wallsLimitsSetMode, 
    glue_step_roundTo
}