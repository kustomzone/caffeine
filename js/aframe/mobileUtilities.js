scene.renderingNormally = true

window.mouseenter = function (event) {
  window.squeakDisplay.vm = SqueakJS.vm
  disableControls('wasd-controls')}

window.mouseleave = function (event) {
  enableControls('wasd-controls')
  document.getElementById('camera').components['wasd-controls'].data.fly = true
    
  // Trick squeak.js into not queueing keyboard events.
  if (window.squeakDisplay) squeakDisplay.vm = null}

window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;};

function slowRender () {
  var delta

  if (this.clock) {
    delta = this.clock.getDelta() * 1000
    this.time = this.clock.elapsedTime * 1000

    if (this.isPlaying) {this.tick(this.time, delta)}

    scene.slowRenderTimeout = setTimeout(
      (function () {
	scene.renderer.setAnimationLoop(this.render)
	scene.renderer.render(this.object3D, this.camera, this.renderTarget)
      
	if (this.isPlaying) {this.tock(this.time, delta)}}).bind(this),
      1000)}}

function normalRender () {
  var delta

  if (this.clock) {
    delta = this.clock.getDelta() * 1000
    this.time = this.clock.elapsedTime * 1000

    if (this.isPlaying) {this.tick(this.time, delta)}

    scene.renderer.setAnimationLoop(this.render)
    scene.renderer.render(this.object3D, this.camera, this.renderTarget)
  
    if (this.isPlaying) {this.tock(this.time, delta)}}}

function spikeRendering () {
  var timeout

  if (scene.slowRenderOnsetTimeout) {
    clearTimeout(scene.slowRenderOnsetTimeout)
    scene.slowRenderOnsetTimeout = null}

  if (!scene.renderingNormally) {
    // console.log('rendering normally')
    if (scene.slowRenderTimeout) clearTimeout(scene.slowRenderTimeout)
    scene.renderer.setAnimationLoop(null)
    scene.render = normalRender.bind(scene)
    scene.render()
    scene.renderingNormally = true}

  // Code formatting can take a while, but it usually doesn't.
  if (scene.typing) timeout = 200
  else {
    if (scene.hasAnimations) timeout = 10000
    else {
      if (scene.goingHome) timeout = 1000
      else {
	// Raising windows can take a while.
	if (window.mousedown) timeout = 1500
	else timeout = 50}}}

  scene.typing = false
  
  if (!(window.mobilecheck())) {
    scene.slowRenderOnsetTimeout = setTimeout(
      function () {
	// Set the frame rate to 1 per second.
	// console.log('rendering slowly')
	cancelAnimationFrame(scene.animationFrameID)
	scene.render = slowRender.bind(scene)
	scene.render()
	scene.renderingNormally = false},
      timeout)}}

function focusMe (event) {
  event.target.focus()
  event.stopPropagation()}

function controlsEnabled (string) {
  return document.getElementById('camera').getAttribute(string).enabled}

function disableControls (string) {
  document.getElementById('camera').getAttribute(string).enabled = false}

function enableControls (string) {
  document.getElementById('camera').getAttribute(string).enabled = true}

function vectorFrom(object) {
  return new THREE.Vector3(
    object.x,
    object.y,
    object.z)}

function centerOf(entity) {
  return vectorFrom(entity.getAttribute('position'))}

function rotationOf(entity) {
  return vectorFrom(entity.getAttribute('rotation'))}

function rotate(geometry, rotation) {
  var degreesToRadians = Math.PI / 180
  
  geometry.rotateX(rotation.x * degreesToRadians).rotateY(rotation.y * degreesToRadians).rotateZ(rotation.z * degreesToRadians)}

function untranslate(geometry, point) {

  geometry.translate(
    0 - point.x,
    0 - point.y,
    0 - point.z)}

function unrotate(geometry, rotation) {
  rotate(
    geometry,
    vectorFrom(
      0 - rotation.x,
      0 - rotation.y,
      0 - rotation.z))}

function forwardProjectedMouseEvents(camera, plane, canvas) {
  var dispatch = function (planarEvent) {
    if ((!planarEvent.detail) || (!planarEvent.detail.intersection)) return
    var canvasEvent = new MouseEvent(planarEvent.type),
	cameraPoint = centerOf(camera),
	cameraRotation = rotationOf(camera),
	selectedPoint = vectorFrom(planarEvent.detail.intersection.point),
	translatedSelectedPoint = vectorFrom(planarEvent.detail.intersection.point),
	planeCenter = centerOf(plane),
	planeRotation = rotationOf(plane),
	simplePlane = new THREE.PlaneGeometry().fromBufferGeometry(plane.components.geometry.geometry),
	planeInCameraFrame = new THREE.PlaneGeometry().fromBufferGeometry(plane.components.geometry.geometry),
	origin = new THREE.Vector3(0, 0, 0),
	planeInCameraFrameVertices,
	simplePlaneVertices,
	originIndex,
	upperRightIndex,
	lowerLeftIndex,
	planeOrigin,
	upperRight,
	lowerLeft,
	translatedUpperRight,
	planarWidth,
	planarHeight,
	widthFactor,
	heightFactor,
	selectionDistance

    // We'll grab the origin point from simplePlane, after we figure out its vertex index.
    simplePlane.mergeVertices()
    planeInCameraFrame.mergeVertices()
    
    rotate(simplePlane, planeRotation)
    rotate(planeInCameraFrame, planeRotation)

    simplePlane.translate(planeCenter.x, planeCenter.y, planeCenter.z)
    planeInCameraFrame.translate(planeCenter.x, planeCenter.y, planeCenter.z)
    
    untranslate(planeInCameraFrame, cameraPoint)
    unrotate(planeInCameraFrame, cameraPoint)
    planeInCameraFrameVertices = planeInCameraFrame.vertices

    // Choose the leftmost point from the camera's point of view.
    if (planeInCameraFrameVertices[4].x < planeInCameraFrameVertices[6].x) {
      originIndex = 4
      upperRightIndex = 6
      lowerLeftIndex = 5}
    else {
      originIndex = 6
      upperRightIndex = 4
      lowerLeftIndex = 7}

    simplePlaneVertices = simplePlane.vertices
    planeOrigin = simplePlaneVertices[originIndex]
    upperRight = simplePlaneVertices[upperRightIndex]
    lowerLeft = simplePlaneVertices[lowerLeftIndex]
    planarWidth = planeOrigin.distanceTo(upperRight)
    planarHeight = planeOrigin.distanceTo(lowerLeft)

    translatedUpperRight = new THREE.Vector3(
      upperRight.x,
      upperRight.y,
      upperRight.z)

    translatedUpperRight.sub(planeOrigin)
    translatedSelectedPoint.sub(planeOrigin)
    theta = translatedUpperRight.angleTo(translatedSelectedPoint)
    
    widthFactor = canvas.width / planarWidth,
    heightFactor = canvas.height / planarHeight,
    selectionDistance = selectedPoint.distanceTo(planeOrigin)
    
    canvasEvent.projected = true
    canvasEvent.projectedX = Math.floor((selectionDistance * Math.cos(theta)) * widthFactor)
    canvasEvent.projectedY = Math.floor((selectionDistance * Math.sin(theta)) * heightFactor)
    canvas.lastProjectedEvent = canvasEvent
    
//  console.log(planarEvent.type + ' ' + canvasEvent.projectedX + ' ' + canvasEvent.projectedY)
    canvas.dispatchEvent(canvasEvent)}

  document.addEventListener(
    'keydown',
    function (event) {
      scene.typing = true
      spikeRendering()})

  plane.movemouse = function (x, y) {
    var canvas = document.getElementById('squeak'),
	lastProjectedEvent = canvas.lastProjectedEvent

    if (lastProjectedEvent) {
      lastProjectedEvent.projectedX = lastProjectedEvent.projectedX + x
      lastProjectedEvent.projectedY = lastProjectedEvent.projectedY + y
      canvas.dispatchEvent(lastProjectedEvent)}}
  
  plane.addEventListener(
    'fusing',
    dispatch)

  plane.addEventListener(
    'mouseenter',
    function(event) {
      window.mouseenter(event)

      if (!mousedown) {
	getCSSRule('canvas.a-canvas.a-mouse-cursor-hover:hover').style.cssText = "cursor: normal;"
	getCSSRule('.a-canvas.a-grab-cursor:hover').style.cssText = "cursor: normal;"
	plane.focus()
	dispatch(event)}})
  
  plane.addEventListener(
    'hovered',
    dispatch)

  plane.addEventListener(
    'mousedown',
    function (event) {
      spikeRendering()
      if (!(document.getElementById('scene').is('vr-mode'))) disableControls('look-controls')
      dispatch(event)})
  
  document.addEventListener(
    'mousemove',
    function (event) {
      spikeRendering()})

  plane.addEventListener(
    'mouseup',
    function (event) {
      getCSSRule('canvas.a-canvas.a-mouse-cursor-hover:hover').style.cssText = "cursor: normal;"
      getCSSRule('.a-canvas.a-grab-cursor:hover').style.cssText = "cursor: normal;"
      plane.focus()
      dispatch(event)})

  plane.addEventListener(
    'mouseleave',
    function (event) {
      enableControls('look-controls')

      getCSSRule('canvas.a-canvas.a-mouse-cursor-hover:hover').style.cssText = 'cursor: grab; cursor: -moz-grab; cursor: -webkit-grab;'
      getCSSRule('.a-canvas.a-grab-cursor:hover').style.cssText = 'cursor: grab; cursor: -moz-grab; cursor: -webkit-grab;'

      window.mouseleave(event)})}

var canvas = document.getElementById('squeak'),
    context = canvas.getContext('2d'),
    wind = document.getElementById('wind'),
    home = document.getElementById('home'),
    camera = document.getElementById('camera'),
    listeners

camera.getAttribute('wasd-controls').fly = true
window.mousedown = false

context.fillStyle = 'black'
context.fillRect(0, 0, 1400, 870)

forwardProjectedMouseEvents(
  document.getElementById('camera'),
  document.getElementById('squeak-plane'),
  canvas)

spikeRendering()

goHome = function (event) {
  var rig = document.getElementById('camera-wrapper'),
      currentPosition = rig.getAttribute('position')

  scene.goingHome = true
  spikeRendering()

//  camera.setAttribute('position', {x: currentPosition.x + 0.1, y: currentPosition.y, z: currentPosition.z})
//  camera.setAttribute('animation', 'property: position; to: 0 0 0')

//  camera.setAttribute('position', {x: 0, y: 0, z: 0})
//  lookControls.pitchObject.rotation.x = 0
//  lookControls.yawObject.rotation.y = 0

//  rig.setAttribute('animation', 'property: rotation; to: "5 0 0"')
  rig.setAttribute('animation', 'property: position; to: ' + {x: currentPosition.x + 5, y: currentPosition.y, z: currentPosition.z})

  home.blur()
  
  window.setTimeout(
    function() {scene.goingHome = false},
    1000)}

// home.onclick = goHome
  
document.addEventListener(
  "keydown",
  f => {
    if (!window.mobilecheck() && !window.squeakDisplay.vm) {
      var camera = document.getElementById('camera')

      if (f.which === 82) {
	var rotx,
	    roty,
	    rotxdeg,
	    position = camera.getAttribute('position'),
	    plane = document.getElementById('squeak-plane'),
	    posz = position.z - plane.getAttribute('position').z
      
	rotx = Math.atan2(-(position.y - plane.getAttribute('position').y), posz)

	if (posz >= 0) {
	  roty = -Math.atan2(position.x * Math.cos(rotx), posz)}
	else {
	  roty = Math.atan2(position.x * Math.cos(rotx), posz)}

	rotxdeg = rotx * 180 / Math.PI
	if (rotxdeg < -89) rotxdeg = rotxdeg + 180
	if (rotxdeg > 0) rotxdeg = -rotxdeg
	
	camera.components['look-controls'].init()
	window.setTimeout(
	  () => {camera.setAttribute('rotation', {x: rotxdeg, y: -(roty * 180 / Math.PI), z: 0})},
          20)} 
      else {
	camera.components['wasd-controls'].data.fly = true
	if (f.which === 69) goHome()}}})

// iOS doesn't do keyup events properly.
document.body.addEventListener(
  "keydown",
  f => {
    document.body.addEventListener(
      "keyup",
      function keyUp(e) {
	document.body.removeEventListener(
	  "keyup",
	  keyUp,
	  false) // Memory clean-up
	window.setTimeout(
	  function () {
	    var event = document.createEvent("Events")
	    
	    event.initEvent('keyup', true, true)
	    event.which = f.which 
	    event.keyCode = f.which
	    document.body.dispatchEvent(event)},
	  200)},
      false)},
  false)

var oscPort = new osc.WebSocketPort({
  url: "wss://mobile.demo.blackpagedigital.com:8081",
  metadata: true})

oscPort.on(
  "message",
  function (oscMsg) {
    scene.dispatchEvent(new CustomEvent(
      "oscEvent", 
      {detail: oscMsg}))})

oscPort.open()

