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


The MIT License (MIT)

Copyright (c) 2013 cemrich

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

(function (window, document) {

	function Rotate() {
		//feature detect
		this.hasDeviceOrientation = 'DeviceOrientationEvent' in window;
		if (!this.hasDeviceOrientation) {
			console.error('rotate.js: This browser does not support device orientation.');
		}
		
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
	Rotate.prototype.start = function () {
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

	//create a new instance of rotate.js.
	var myRotyteEvent = new Rotate();
	myRotyteEvent && myRotyteEvent.start();

}(window, document));