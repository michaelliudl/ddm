//Specify speed of scroll. Larger=faster (ie: 5)
var scrollspeed=cache=2

//Specify intial delay before scroller starts scrolling (in miliseconds):
var initialdelay=500

function initializeScroller(){
	dataobj=document.all? document.all.datacontainer : document.getElementById("datacontainer")
	dataobj.style.top="5px"
	setTimeout("getdataheight()", initialdelay)
}

function getdataheight(){
	thelength=dataobj.offsetHeight
	if (thelength==0)
		setTimeout("getdataheight()",10)
	else
		scrollDiv()
}

function scrollDiv(){
	dataobj.style.top=parseInt(dataobj.style.top)-scrollspeed+"px"
	if (parseInt(dataobj.style.top)<thelength*(-1))
		dataobj.style.top="5px"
	setTimeout("scrollDiv()",40)
}

if (window.addEventListener)
	window.addEventListener("load", initializeScroller, false)
else if (window.attachEvent)
	window.attachEvent("onload", initializeScroller)
else
	window.onload=initializeScroller