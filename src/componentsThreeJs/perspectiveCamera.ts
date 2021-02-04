import  {PerspectiveCamera} from "three";

export const  perspectiveCamera = (
    width: number, 
    height: number
    ):PerspectiveCamera => {
    const perspectiveCamera = new PerspectiveCamera(75, width / height, 0.1, 50000);
    return perspectiveCamera
};