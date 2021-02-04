import {
    MathUtils,
    Spherical,
    Vector3
} from "three/build/three.module.js";
import {possibleNextStep} from "../../utils/GlobalFunctions";

var FirstPersonControls = function ( object, domElement, viewHeight, roomLimit, wallsGlueSetMode) {

    if ( domElement === undefined ) {
        console.warn( 'THREE.FirstPersonControls: The second parameter "domElement" is now mandatory.' );
        domElement = document;
    }
    this.object = object;
    this.domElement = domElement;
    // API
    this.enabled = false;
    this.mouseMotionlessUp = false;
    this.moving = false;
    this.movementSpeed = 3.0;
    this.lookSpeed = 0.005;
    this.lookSwipeSpeed = 0.5;
    // for touch screen
    let minSwipeDistance = 1;
    // *********************
    this.lookVertical = true;
    this.autoForward = false;
    this.activeLook = true;
    this.heightSpeed = false;
    this.heightCoef = 1.0;
    this.viewHeight = viewHeight
    this.heightMin = this.viewHeight;
    this.heightMax = this.viewHeight+1;
    this.constrainVertical = false;
    this.verticalMin = 0;
    this.verticalMax = Math.PI;
    this.mouseDragOn = false;
    // internals
	this.autoSpeedFactor = 0;
	this.deltaX = 0;
	this.mouseXprev = 0;
	this.deltaY = 0;
	this.mouseYprev = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.viewHalfX = 0;
    this.viewHalfY = 0;
    this.current = {x:0,z:0}
    this.target = new Vector3();
    this.clickPoint = new Vector3();
    this.isPathAble = true;
    this.isMouseDown = false;
    // private variables
    var lat = 0;
    var lon = 0;
    var lookDirection = new Vector3();
    var spherical = new Spherical();
    var absSpeed = 2

    if ( this.domElement !== document ) {
        this.domElement.setAttribute( 'tabindex', - 1 );
    }
    //
    this.handleResize = function () {
        if ( this.domElement === document ) {
            this.viewHalfX = window.innerWidth / 2;
            this.viewHalfY = window.innerHeight / 2;
        } else {
            this.viewHalfX = this.domElement.offsetWidth / 2;
            this.viewHalfY = this.domElement.offsetHeight / 2;
        }
    };
    
    

    this.onMouseDown = function ( event) {
        this.enabled = true;
        this.mouseMotionlessUp = true;
        if(event.type === "mousedown") this.isMouseDown = true
        if (this.domElement !== document) this.domElement.focus();
        event.preventDefault();
        event.stopPropagation();
      
        this.mouseDragOn = true;
        // return 'onMouseDown'
    };

    this.onMouseUp = function ( event ) {
        this.isPathAble = true;
        // moving = true if mouseMotionlessUp === true
        this.moving = this.mouseMotionlessUp;
        this.mouseMotionlessUp = false;
        this.isMouseDown = false
        setTimeout(()=>{
            this.enabled = false;
        },0)
        setTimeout(()=>{
            this.moving = false;
        },200)
        event.preventDefault();
        event.stopPropagation();
        if ( this.activeLook ) {
            switch ( event.button ) {
                case 0: this.moveForward = false; break;
                case 2: this.moveBackward = false; break;
                default:;
            }
        }
        this.mouseDragOn = false;
    };
    this.onMouseLeave = function ( event ) {
        event.preventDefault();
        event.stopPropagation();
        this.enabled = false;
    };
    this.onMouseMove = function ( event ) {
			this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
            this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
		if(this.mouseDragOn){
            
            this.deltaX = this.mouseX - this.mouseXprev;
            this.deltaY = this.mouseY - this.mouseYprev;
            // console.log(this.deltaX, this.deltaY);
			if (Math.abs(this.deltaX)>minSwipeDistance){
                // block moving when turn
                this.moveForward = false;
                this.moveBackward = false;
                this.isPathAble = false;
                this.mouseMotionlessUp = false;
				lon += this.deltaX*this.lookSpeed;
			}
			if (Math.abs(this.deltaY)>minSwipeDistance){
                // block moving when turn
                this.moveForward = false;
                this.moveBackward = false;
                this.isPathAble = false;
                this.mouseMotionlessUp = false;
				lat += this.deltaY*this.lookSpeed;
				if(lat>85){
					lat =85;
				}
				if(lat<-85){
					lat =-85;
				}
			}
		}

		this.mouseXprev = this.mouseX;
		this.mouseYprev = this.mouseY;
    };

    // for touch screen
    this.onTouchStart = function ( event ) {
        const touch = event.touches[0];
        this.mouseXprev =  touch.clientX;
        this.mouseYprev =  touch.clientY;
        event.button =0
        this.isMouseDown = true
        this.onMouseDown( event)
    };

    this.onTouchMove = function ( event ) {
        if (event.changedTouches && event.changedTouches.length) {
            const touch = event.changedTouches[0];
            this.deltaX = Math.abs(touch.clientX - this.mouseXprev) > minSwipeDistance
            ? touch.clientX - this.mouseXprev
            : 0;
            
            this.deltaY = Math.abs(touch.clientY - this.mouseYprev) >
            minSwipeDistance
            ? touch.clientY - this.mouseYprev
            : 0;

            if(Math.abs(this.deltaY)>minSwipeDistance || Math.abs(this.deltaX)>minSwipeDistance){
                this.isPathAble = false;
                this.mouseMotionlessUp = false;
            }

            lat += Math.sign(this.deltaY)*this.lookSwipeSpeed;
            lon += Math.sign(this.deltaX)*this.lookSwipeSpeed;
            if(lat>85){
                lat =85;
            }
            if(lat<-85){
                lat =-85;
            }
            this.mouseXprev = touch.clientX;
            this.mouseYprev = touch.clientY;
          }

         

    };

    this.onTouchEnd = function ( event ) {
        this.isPathAble = true
        event.button =0
        this.onMouseUp(event)
        
    };

    this.onKeyDown = function ( event ) {
        // console.log(event.keyCode + " key");
        this.enabled = true;
        this.isPathAble = false;
        //event.preventDefault();
        switch ( event.keyCode ) {
            case 38: /*up*/
            case 87: /*W*/ this.moveForward = true; break;
            case 37: /*left*/
            case 65: /*A*/ this.moveLeft = true; break;
            case 40: /*down*/
            case 83: /*S*/ this.moveBackward = true; break;
            case 39: /*right*/
            case 68: /*D*/ this.moveRight = true; break;
            case 82: /*R*/ this.moveUp = wallsGlueSetMode; break;
            case 70: /*F*/ this.moveDown = wallsGlueSetMode; break;
            default:;
        }
    };
    this.onKeyUp = function ( event ) {
		this.enabled = false;
        switch ( event.keyCode ) {
            case 38: /*up*/
            case 87: /*W*/ this.moveForward = false; break;
            case 37: /*left*/
            case 65: /*A*/ this.moveLeft = false; break;
            case 40: /*down*/
            case 83: /*S*/ this.moveBackward = false; break;
            case 39: /*right*/
            case 68: /*D*/ this.moveRight = false; break;
            case 82: /*R*/ if(wallsGlueSetMode){this.moveUp = false;} break;
            case 70: /*F*/ if(wallsGlueSetMode){this.moveDown = false;} break;
            default:;
        }
        // console.log('key', event.keyCode)
    };
    this.lookAt = function ( x, y, z ) {
        if ( x.isVector3 ) {
            this.target.copy( x );
        } else {
            this.target.set( x, y, z );
        }
        this.object.lookAt( this.target );
        setOrientation( this );
        return this;
    };
    this.update = function () {
        var targetPosition = new Vector3();
        return function update( delta ) {
            if ( this.enabled === false ) return;
            if ( this.heightSpeed ) {
                var y = MathUtils.clamp( this.object.position.y, this.heightMin, this.heightMax );
                var heightDelta = y - this.heightMin;
                this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );
            } else {
                this.autoSpeedFactor = 1;
            }
            var actualMoveSpeed = delta * this.movementSpeed;
            if ( this.moveForward || ( this.autoForward && ! this.moveBackward ) ){
                this.object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor + absSpeed) );

            } 
            if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed + absSpeed);
            if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed - absSpeed);
            if ( this.moveRight ) this.object.translateX( actualMoveSpeed + absSpeed);
            if ( this.moveUp ) this.object.translateY( actualMoveSpeed + absSpeed);
            if ( this.moveDown ) this.object.translateY( - actualMoveSpeed - absSpeed);
            var phi = MathUtils.degToRad( 90 - lat );
            var theta = MathUtils.degToRad( lon );
            if ( this.constrainVertical ) {
                phi = MathUtils.mapLinear( phi, 0, Math.PI, this.verticalMin, this.verticalMax );
            }
            if(!wallsGlueSetMode){ this.object.position.setY(this.viewHeight) }; // prevent change camera.y
            
            var position = this.object.position;
            position.x = possibleNextStep(this.current, this.object.position, roomLimit).x;
            position.z = possibleNextStep(this.current, this.object.position, roomLimit).z;
            this.current.x = this.object.position.x;
            this.current.z = this.object.position.z;
            targetPosition.setFromSphericalCoords( 1, phi, theta ).add( position );

            this.object.lookAt( targetPosition );
        };
    }();
    function contextmenu( event ) {
        event.preventDefault();
    }
    this.dispose = function () {
        this.domElement.removeEventListener( 'contextmenu', contextmenu, false );
        this.domElement.removeEventListener( 'mousedown', _onMouseDown, false );
        this.domElement.removeEventListener( 'mousemove', _onMouseMove, false );
        this.domElement.removeEventListener( 'mouseup', _onMouseUp, false );
        this.domElement.removeEventListener( 'mouseleave', _onMouseLeave, false );
        // for touch screen
        this.domElement.addEventListener( 'touchstart', _onTouchstart, false );
        this.domElement.addEventListener( 'touchmove', _onTouchmove, false );
        this.domElement.addEventListener( 'touchend', _onTouchend, false );

        window.removeEventListener( 'keydown', _onKeyDown, false );
        window.removeEventListener( 'keyup', _onKeyUp, false );
    };
    var _onMouseMove = bind( this, this.onMouseMove );
    var _onMouseDown = bind( this, this.onMouseDown );
    var _onMouseUp = bind( this, this.onMouseUp );
    var _onMouseLeave = bind( this, this.onMouseLeave );
    // for touch screen
    var _onTouchstart = bind( this, this.onTouchStart );
    var _onTouchmove = bind( this, this.onTouchMove );
    var _onTouchend = bind( this, this.onTouchEnd );

    var _onKeyDown = bind( this, this.onKeyDown );
    var _onKeyUp = bind( this, this.onKeyUp );
    this.domElement.addEventListener( 'contextmenu', contextmenu, false );
    this.domElement.addEventListener( 'mousemove', _onMouseMove, false );
    this.domElement.addEventListener( 'mousedown', _onMouseDown, false );
    this.domElement.addEventListener( 'mouseup', _onMouseUp, false );
    this.domElement.addEventListener( 'mouseleave', _onMouseLeave, false );
    // for touch screen
    this.domElement.addEventListener( 'touchstart', _onTouchstart, false );
    this.domElement.addEventListener( 'touchmove', _onTouchmove, false );
    this.domElement.addEventListener( 'touchend', _onTouchend, false );

    window.addEventListener( 'keydown', _onKeyDown, false );
    window.addEventListener( 'keyup', _onKeyUp, false );
    function bind( scope, fn ) {
        return function () {
            fn.apply( scope, arguments );
        };
    }
    function setOrientation( controls ) {
        var quaternion = controls.object.quaternion;
        lookDirection.set( 0, 0, - 1 ).applyQuaternion( quaternion );
        spherical.setFromVector3( lookDirection );
        lat = 90 - MathUtils.radToDeg( spherical.phi );
		lon = MathUtils.radToDeg( spherical.theta );
    }
    this.handleResize();
    setOrientation( this );

};
export { FirstPersonControls };


