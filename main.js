var _startX = 0;            // mouse starting positions
var _startY = 0;
var _offsetX = 0;           // current element offset
var _offsetY = 0;
var _dragElement;           // needs to be passed from OnMouseDown to OnMouseMove
var _oldZIndex = 0;         // we temporarily increase the z-index during drag
var iterator = 10;

var premadePhrases = {
    sample:"the,quick,brown,fox,jumps,over,the,lazy,dog",
    lolcat:"lol,cat,lolcat,iz,r,ur,good,?,i,want,cheezburger,nao",
    geek:"battle,awesome,are,an,action,could,complete,cheat,bit,force,information,is",
    bacon:"the,day,begin,s,with,this,morning,marvel,bring,ing,the,aroma,of,satisfaction,bacon",
    beard:"my,beard,is,a,lifestyle,facial,hair,touch,it,thanks",
    explicit:"fuck,fuck,fuck"
};


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
        iterator++;
        target.style.zIndex = iterator;
        
        // we need to access the element in OnMouseMove
        _dragElement = target;

        // tell our code to start moving the element with the mouse
        document.addEventListener('mousemove', onMouseMove);


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
        // _dragElement.style.zIndex = ;

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


function convertInput(inputTextValue, selectValue) {
    var selectInput = document.getElementById('selectExisting');
    var selectValue = selectInput.options[selectInput.selectedIndex].value;
    var inputTextValue = $('#inputTextArea').val().trim();

    console.log(inputTextValue, "text");

    //if selection & value text box, reset select and process the text box
    if (inputTextValue.length > 1) {
        selectInput.value = 'selectone';
        var splitInput = inputTextValue.split(",");
    }
    //if selection & no value text box, process selection
    else if (selectValue != 'selectone') {
        var splitInput = premadePhrases[selectValue].split(",");
    }
    else {
        alert("You didn't do anything.");
    }



    var holdMe = $(".main-container");
    var heightMax = holdMe.height();

    console.log(splitInput);

    for (i = 0; i < splitInput.length; i++) {
        var word = splitInput[i];
        var posy = 100 + Math.floor( Math.random() * (heightMax-100*2));
        var posx = 40 + Math.random() * ((700-40*2)-120);
        var rotateDegrees = (Math.random() * (5 - (-5) + 1)) + (-5);

        var newMagnet = ($('<div class="magnet drag">'+word+'</div>'));
        iterator++;
        newMagnet.css({
            'transform': 'translate3d('+posx+'px, '+posy+'px, 0px) rotate('+rotateDegrees+'deg)',
            'z-index': iterator
        });
        holdMe.append(newMagnet);

    }

}

function clearInput(selectValue) {
    var textInput = document.getElementById('inputTextArea');
    var selectInput = document.getElementById('selectExisting');

    textInput = textInput.value = "";
    selectInput.value = 'selectone';
}

function clearMagnets() {
    var elements = document.getElementsByClassName("magnet drag");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}