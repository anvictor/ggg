interface IPointer{
    x: number;
    y: number;
}

export const mouseGetXY = ( 
    event: any, 
    width: number,
    height: number,
    isTouches: boolean,
    ) => {
        let pointer: IPointer={x: 0, y: 0};
        event.preventDefault();
        if (isTouches && event.touches) {
            pointer.x = (event.touches[0].clientX / width) * 2 - 1;
            pointer.y = - (event.touches[0].clientY / height) * 2 + 1;
        }else{
            pointer.x = (event.clientX / width) * 2 - 1;
            pointer.y = - (event.clientY / height) * 2 + 1;
        }
    return pointer
}