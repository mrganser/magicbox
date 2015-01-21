//Enables bootstrap tooltips
$(function () { $("[data-toggle='tooltip']").tooltip(); });

function setVisibility(visibility){
	document.getElementById('secret').value = visibility;
	return true;
}

function clickSend(event){
	if (event.keyCode == 13) document.getElementById("sharelink").click();
}