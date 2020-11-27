$(document).ready(function(){
    $("#thread").html(function(_, html){
        return html.replace(/(&gt;.*)/g, '<span style="color: grey">$1</span>');
        
        //return html.replace(/(&gt;&gt;\w+)/g, '<span style="color: red">$1</span>');
        //To DO: Figure out how to extract quotes.

        //Problem: > and >> are similar.  
    });
});

function showReply(quote) {
    var x = document.getElementById("post-form");
    if (x.style.display === "none") {
    	if(quote) {
    		var y = document.getElementById("text");
    		y.innerHTML = ">>" + quote + " ";
    	}
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function toggleImage(img) {
    var x = document.getElementById(img);

    if (x.style.maxWidth == "300px") {
        x.style.maxWidth = "100%";
    } else {
        x.style.maxWidth = "300px";
        console.log(x.style.maxWidth);
    }
}

/* Reply Highlighting */

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function highlightReply(id) {
    let replyId = id + "p";
    var x = document.getElementById(replyId);
    x.style.border = "2px dashed black";
}

async function exitHighlight(id) {
    let replyId = id + "p";
    var x = document.getElementById(replyId);
    
    await sleep(2500);
    x.style.border = "none";
}