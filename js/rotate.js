/*
Rotate.js is a small library to detect device orientation inspired by 
shake.js (https://github.com/alexgibson/shake.js). It is using the 
DeviceOrientation Event as descriped in the W3C craft
http://dev.w3.org/geo/api/spec-source-orientation and tries to 
compensate for different browser implementation.
Please note that this specification is still in flux and may be changed.

Testet for:
- chrome mobile
- firefox mobile
*/

var Rotate;

(function (window, document) {

	Rotate = function Rotate() {
		//feature detect
		this.hasDeviceOrientation = 'DeviceOrientationEvent' in window;
		if (!this.hasDeviceOrientation) {
			console.error('rotate.js: This browser does not support device orientation.');
		}
		
		//settings
		this.invert = false;
		
		//browser detect 
		var ua = window.navigator.userAgent;
		this.invertAxes = false;
		if (/Firefox/.test(ua)) {
			this.invertAxes = true; //mobile firefox inverts all angles
		}
		
		//create custom event
		if (typeof CustomEvent === "function") {
			this.event = new CustomEvent('rotate', {
				bubbles: true,
				cancelable: true
			});
			this.event.rotation = {};
		} else if (typeof document.createEvent === "function") {
			this.event = document.createEvent('Event');
			this.event.rotation = {};
			this.event.initEvent('rotate', true, true);
		} else {
			console.error('rotate.js: No custom event could be created.');
			return false;
		}
	}

	//reset timer values
	Rotate.prototype.reset = function () {
	};

	//start listening for deviceorientation
	Rotate.prototype.start = function (options) {
		this.invert = (options.invert == true);
		this.reset();
		if (this.hasDeviceOrientation) {
			window.addEventListener('deviceorientation', this);
		}
	};

	//stop listening for deviceorientation
	Rotate.prototype.stop = function () {
		if (this.hasDeviceOrientation) {
			window.removeEventListener('deviceorientation', this);
		}
		this.reset();
	};

	//calculates if rotate did occur
	Rotate.prototype.deviceorientation = function (e) {
		var rotX = e.beta;
		var rotY = e.gamma;
		var rotZ = e.alpha;
		var orientation = window.orientation || 0;
		
		if (this.invertAxes) {
			rotX *= -1;
			rotY *= -1;
			rotZ *= -1;
		}
		
		/* if (orientation == 90) {
			var tempY = rotY;
			rotY = rotX;
			rotX = -tempY;
			rotZ -= 90;
		} else if (orientation == 180) {
			rotX *= -1;
			rotY *= -1;
			rotZ -= 180;
		} else if (orientation == -90 || orientation == 270) {
			var tempY = rotY;
			rotY = -rotX;
			rotX = tempY;
			rotZ += 90;
		} */
		
		// correct angles when device is hold upside down
		var upsideDownFak = (rotY < 90 && rotY > -90) ? -1 : 1;
		rotX = rotX*upsideDownFak + 360;
		rotZ = rotZ*-1;
		
		rotX = (rotX + 360) % 360;
		rotY = (rotY + 360) % 360;
		rotZ = (rotZ + 360) % 360;
		
		if (this.invert) {
			rotX = (rotX*-1 + 360) % 360;
			rotY = (rotY*-1 + 360) % 360;
			rotZ = (rotZ*-1 + 360) % 360; 
		}
		
		this.event.rotation.x = rotX;
		this.event.rotation.y = rotY;
		this.event.rotation.z = rotZ; 
		this.event.orientation = orientation; 
		window.dispatchEvent(this.event);
	};

	//event handler
	Rotate.prototype.handleEvent = function (e) {
		if (typeof (this[e.type]) === 'function') {
			return this[e.type](e);
		}
	};

}(window, document));