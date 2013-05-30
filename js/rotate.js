(function (window, document) {

	function Rotate() {
		//feature detect
		this.hasDeviceOrientation = 'DeviceOrientationEvent' in window;
		
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
		var rotX = event.beta;
		var rotY = event.gamma;
		var rotZ = event.alpha;
		
		if (window.orientation == 90) {
			var tempY = rotY;
			rotY = rotX;
			rotX = -tempY;
			rotZ -= 90;
		} else if (window.orientation == 180) {
			rotX *= -1;
			rotY *= -1;
			rotZ -= 180;
		} else if (window.orientation == -90 || window.orientation == 270) {
			var tempY = rotY;
			rotY = -rotX;
			rotX = tempY;
			rotZ += 90;
		}
		
		this.event.rotation.x = rotX;
		this.event.rotation.y = rotY;
		this.event.rotation.z = rotZ;
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