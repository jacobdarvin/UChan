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

$("#reply-section").find( "post" ).css( "background-color", "red" );