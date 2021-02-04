import React from 'react';
import {Route} from "react-router";
import Viewing_Rooms_MA_Gallery from './Viewing_Rooms_MA_Gallery'

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    if(localStorage.getItem('hrefNow') !== window.location.href){
    localStorage.setItem('hrefNow', window.location.href);
    window.location.reload()
  }

    return (
      <div>
            <Route component={Viewing_Rooms_MA_Gallery} path={`/`}/>
      </div>
    )
}

