import React from 'react';
import './HtmlOver.scss';




const Arrows3d: any = (props) => {
    return (
        <div className="Arrows3d">

            <div className="ArrowsMenu">
                <div id="Arrow3dUp" className="Arrow3d">
                    <span className="caption">&uarr; {props.isTouchScreen?"":"W"}</span>  
                </div>
                <div className="bottomLine">
                    <div id="Arrow3dLeft" className="Arrow3d">
                       <span className="caption">&larr; {props.isTouchScreen?"":"A"}</span>  
                    </div>
                    <div id="Arrow3dDown" className="Arrow3d">
                        <span className="caption">&darr; {props.isTouchScreen?"":"S"}</span>  
                    </div>
                    <div id="Arrow3dRight" className="Arrow3d">
                        <span className="caption">&rarr; {props.isTouchScreen?"":"D"}</span>  
                    </div>

                </div>
            </div>
        </div>
    );
};

const Tips: any = (props) =>{
    return <div
      className = "tips"
      style = {{display:"none"}}
    >
      <button id="delete_btn" style={{visibility:`${props.isTouchScreen?"visible":"hidden"}`,width:`${props.isTouchScreen?"105px":"0px"}`}}>
        Delete canvas
      </button>
      <button id="enter_btn">
        {`${props.isTouchScreen?"Hang Off canvas":"use Del or Enter"}`}
      </button>
    </div>
  }

const ArrowsNextPrev: any = (props: any) => {
    return (
        <div className="ArrowsNextPrev">
            <div id="Arrow3dPrev" className="Arrow3d">
                <span className="caption">&larr; prev </span>  
            </div>
            
            <div id="Arrow3dNext" className="Arrow3d">
                <span className="caption">next &rarr; </span>  
            </div>
        </div>
    );
};

const PaintInfo: React.FC<{}> = ()=>{
    return <div id="paintInfo"></div>
  }

const CloseXBtn: any = (props:any)=>{
    const clickHandler = () =>{
        console.log("CloseXBtn props", props.CloseXEvent);
        props.CloseXEvent()
    }
    return <div onClick={clickHandler} className="closeX"></div>
  }

const SaveBtn: any = (props) => {
    return (<button className="SaveBtn"
        onClick={props.onChangeSensor}
        >save Paints on the Walls position</button>)
}
const ClearBtn: any = (props) => {
    return (<button className="ClearBtn"
        onClick={props.apiClearCanvas}
        >Clear Paints</button>)
}

const Skins: any = (props) => {
    //   console.log('** props', props)   
    return (
        <div 
            className="Skins"
            >
            <label 
                htmlFor = "skins"
                style={{
                    background:"white",
                    margin:"0px 10px 0px 0px"
                }}
            >
                Choose skin:
            </label>
            <select onChange={(e)=>{
                props.getSkin(e.target.value)
                props.onChangeSensor()
            } } name="skins" id="skins">
                <option value="skin1">Skin 1</option>
                <option value="skin2">Skin 2</option>
            </select>
        
        </div>
    );
};

export  {Arrows3d, Tips, ArrowsNextPrev, PaintInfo, CloseXBtn, SaveBtn, ClearBtn, Skins};
