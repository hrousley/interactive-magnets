var _startX = 0;            // mouse starting positions
var _startY = 0;
var _offsetX = 0;           // current element offset
var _offsetY = 0;
var _dragElement;           // needs to be passed from OnMouseDown to OnMouseMove
var _oldZIndex = 0;         // we temporarily increase the z-index during drag

var textarea = "the,quick,brown,fox,jumps,over,the,lazy,dog";

//when load mousedown
//when click mouseMOVE
//when unclick mouseUP

function initDragDrop() {
    document.addEventListener('mousedown', onMouseDown);
}

initDragDrop();

function onMouseDown(e) {
    // IE doesn't pass the event object
    if (e == null) 
        e = window.event; 
    
    // IE uses srcElement, others use target
    var target = e.target != null ? e.target : e.srcElement;
    
    // for IE, left click == 1
    // for Firefox, left click == 0
    if ((e.button == 1 && window.event != null || e.button == 0) && target.className.indexOf('drag') > -1) {
        // grab the mouse position
        _startX = e.clientX;
        _startY = e.clientY;
        
        // grab the clicked element's position
        _offsetX = extractNumber(target.style.left);
        _offsetY = extractNumber(target.style.top);
        
        // bring the clicked element to the front while it is being dragged
        _oldZIndex = target.style.zIndex;
        target.style.zIndex = 10000;
        
        // we need to access the element in OnMouseMove
        _dragElement = target;

        // tell our code to start moving the element with the mouse
        document.addEventListener('mousemove', onMouseMove);

        // cancel out any text selections
        document.body.focus();

        // prevent text selection in IE
        document.onselectstart = function () { return false; };
        // prevent IE from trying to drag an image
        target.ondragstart = function() { return false; };

        document.addEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousedown', onMouseDown);
        
        // prevent text selection (except IE)
        return false;
     }
}

var onMouseMove = function(e) {
    if (e == null) 
        var e = window.event; 

    // this is the actual "drag code"
    _dragElement.style.left = (_offsetX + e.clientX - _startX) + 'px';
    _dragElement.style.top = (_offsetY + e.clientY - _startY) + 'px';
     
}

function onMouseUp(e) {

    if (_dragElement != null)
    {
        _dragElement.style.zIndex = _oldZIndex;

        // we're done with these events until the next OnMouseDown
        document.removeEventListener('mousemove', onMouseMove);
        document.addEventListener('mousedown', onMouseDown);
        document.removeEventListener('mouseup', onMouseUp);

        document.onselectstart = null;
        _dragElement.ondragstart = null;

        // this is how we know we're not dragging      
        _dragElement = null;
    }
}

function extractNumber(value) {
    var n = parseInt(value);
	
    return n == null || isNaN(n) ? 0 : n;
}

// this is simply a shortcut for the eyes and fingers
function $(id) {
    return document.getElementById(id);
}

function convertInput(textarea) {
    var splitInput = textarea.split(",");
    var holdMe = document.getElementsByClassName("main-container")[0];

    console.log(splitInput);

    for (i = 0; i < splitInput.length; i++) {
        var word = splitInput[i];
        holdMe.innerHTML += '<div class="magnet drag">'+word+'</div>';
    }
}

convertInput(textarea);