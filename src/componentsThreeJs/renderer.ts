import  {WebGLRenderer, PCFSoftShadowMap} from "three";

export const Renderer =():WebGLRenderer =>{
    const renderer  = new WebGLRenderer({
        antialias: true
    });
    renderer.physicallyCorrectLights = true;
    renderer.setClearColor('#abcdef')
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    return renderer
}
