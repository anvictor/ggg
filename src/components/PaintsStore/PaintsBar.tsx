import React, {useState, useEffect, useContext} from 'react';
import PaintsStore from '../../unitedStates/paintsStore';
import './PaintsBar.scss';
import { Checkbox } from 'antd';
import { observer } from 'mobx-react';

const PaintsBar: any = observer((props: any) => {
    
    const store = useContext(PaintsStore);
    const paintsFromStore = store.paints;
    const isPaintsPresent: boolean = paintsFromStore[0].id !== "-1";
    const localHeight = window.innerHeight;
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [paints, setPaints] = useState(paintsFromStore);
    const [isLoading, setIsLoading] = useState<boolean>(!isPaintsPresent);
    const [isTourOrderChecked, setIsTourOrderChecked] = useState(false)
    const swapOrder = props.swapOrder
    
    useEffect(() => {

        if (props.paints && props.paints.length){

            setPaints(props.paints);
                setIsLoading(!props.paints.length);
                props.paints.forEach((paint, index) => {
                    paint.order = index
                })
                store.setPaints(props.paints);
        }
        swapOrder(paints)
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPaintsPresent, store, paints, swapOrder]);

      const onChangeHandler = (e: { target: { checked: React.SetStateAction<boolean>; }; }) => {
        setIsTourOrderChecked(e.target.checked)
      }

       const orderDecrement =(mainElementIndex:number) =>{
        let arr : any[] = [];
        let secondaryElement: number = (
            +mainElementIndex === 0)
            ? paints.length-1
            : mainElementIndex - 1;
            
            arr= [...swapArrayElements(
                paints, 
                secondaryElement,
                mainElementIndex
            )]
            store.setPaints(arr);
            setPaints(arr)
    }

       const orderIncrement =(mainElementIndex:number) =>{
        let arr : any[] = [];
        let secondaryElement: number = (
            +mainElementIndex === paints.length-1)
            ? 0
            : +mainElementIndex + 1;
            
            arr= [...swapArrayElements(
                paints, 
                mainElementIndex, 
                secondaryElement
            )]
            store.setPaints(arr);
            setPaints(arr)
    }

    const swapArrayElements = (
        array:any[], 
        mainElement: number, 
        secondaryElement: number
        ) => {
        if (array.length === 1) return array;
        let order : number = array[mainElement].order
        array[mainElement].order = array[secondaryElement].order
        array[secondaryElement].order = order
        array.splice(secondaryElement, 1, array.splice(mainElement, 1, array[secondaryElement])[0]);
        return array;
      };
      
    return (
        <div
            onClick={() => {
                if(isTourOrderChecked){
                    setIsCollapsed(false);
                } else {
                    setIsCollapsed(!isCollapsed);
                }
            }}
            onMouseLeave={
                () => {
                    if(isTourOrderChecked){
                        setIsCollapsed(false);
                    } else {
                        setIsCollapsed(true);
                    }
                }
            }
            onBlur={
                () => {
                    if(isTourOrderChecked){
                        setIsCollapsed(false);
                    } else {
                        setIsCollapsed(true);
                    }
                }
            }
            className={isCollapsed && !isTourOrderChecked ? "paintsBar collapsed" : "paintsBar expanded"}
        >
            <h1>
                Paints Bar
            </h1>

            <div style={{display:`${isCollapsed?"none":"block"}`}}>

            <Checkbox
                onChange={onChangeHandler}
            >
                {` Change Tour order`}
            </Checkbox>
                
            
             
            </div>

            <div
                style={{display:`${isCollapsed ? "none":"block"}`,height:`${localHeight-300}px`}}
                className="paintsScroll"
            >
                <ul>
                    {isLoading?<li>Loading...</li>: 
                    paints.map((paint, index) => (
                        <li key={index}
                            data-paint_id={paint.id}
                        >
                            <h3>Author: {paint.description}</h3>
                            <p>name: {paint.name}</p>
                            <img width="200" src={paint.url} alt="paint"/>
                            <div 
                                className={"arrowsOrder"}
                                style={{display:`${isTourOrderChecked?"block":"none"}`}}
                            >
                                <div 
                                    id="OrderUp" 
                                    data-order = {paint.order}
                                    className="Arrow3d"
                                    onClick={(e)=>orderDecrement(e.target.dataset.order)}
                                >
                                    <span className="caption">&uarr; </span>  
                                </div>
                                <div 
                                    id="OrderDown" 
                                    data-order = {paint.order}
                                    className="Arrow3d"
                                    onClick={(e)=>orderIncrement(e.target.dataset.order)}
                                >
                                    <span className="caption">&darr; </span>  
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    );
});


export default PaintsBar;
