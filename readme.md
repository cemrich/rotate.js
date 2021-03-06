# What is rotate.js?

Rotate.js is a small library to detect device orientation inspired by 
shake.js (https://github.com/alexgibson/shake.js). It is using the 
DeviceOrientation Event as descriped in the W3C craft
http://dev.w3.org/geo/api/spec-source-orientation and tries to 
compensate for different browser implementation.
Please note that this specification is still in flux and may be changed.

## Where does it work?
Tested for:
- chrome mobile
- firefox mobile

## Demo
Please try the demo at http://cemrich.github.io/rotate.js

## How to use
Basically you just need to include rotate.js in your html file:

	<script src="js/rotate.js"></script>

Now you can instantiate rotate.js and add you listeners for the 'rotate' event:

	var myRotateEvent = new Rotate();
	window.addEventListener('rotate', displayRotation);

In order to receive these events you have to start rotate.js. You can also stop it whenever you like, e.g. to save power when the browser window is not visible:

	myRotateEvent.start();
	...
	myRotateEvent.stop();

The orientation event provides four attributes:
- **x**: Rotation around the devices x axis in degress
- **y**: Rotation around the devices y axis in degress
- **z**: Rotation around the devices z axis in degress
- **orientation**: the basic orientation of the device in 90 degree steps (currently not working in firefox)

Or review the demo html at https://github.com/cemrich/rotate.js/blob/master/index.html to see a full example of how to use rotate.js