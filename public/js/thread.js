$(document).ready(function(){
    $("#thread").html(function(_, html){
        return html.replace(/(@.*)/g, '<span style="color: grey">$1</span>'); //&gt; = '>'
        //return html.replace(/(&gt;&gt;\w+)/g, '<span style="color: red">$1</span>');
        //To DO: Figure out how to extract quotes.

        //Problem: > and @  are similar.
    });
});

$(document).ready(function(){
    $("#thread").html(function(_, html){
        return html.replace(/(&gt;.*)/g, '<span style="color: grey"><b>$1</b></span>'); //&gt; = '>'
    });
});

//Click a quote to reveal post form. Automatically adds @ quote number to post form text
function showReply(quote) {
    var x = document.getElementById("postForm");
    if (x.style.display === "none") {
    	if(quote) {
    		var y = document.getElementById("text");
    		y.innerHTML = "@" + quote + "\r\n";
    	}
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function reportId(id) {
  console.log("reporting " + id);
  $("#reportModal").val(id)
}

function displayDropDown(postId) {
  id = "dropdown_" + postId;
  var position = $("#" + id).position()
  console.log(id)
  console.log(position.left);

  idDropdown      = "dropdown_options_" + postId;
  idDropdownIcon  = "dropdown_icon_" + postId;

  if( $("#" + idDropdown).css('display') == 'none') {
    $("#" + idDropdown).css( {"display":"block", "left" : position.left,} );
    $("#" + idDropdownIcon).removeClass("fa-angle-down");
    $("#" + idDropdownIcon).addClass("fa-angle-up");

  } else {
    $("#" + idDropdown).css( {"display": "none", "left" : position.left,} );
    $("#" + idDropdownIcon).removeClass("fa-angle-up");
    $("#" + idDropdownIcon).addClass("fa-angle-down");
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

function deleteConfirmation(deleteId) {
  if(document.getElementById("dc_" + deleteId).style.display == "none") {
    document.getElementById("d_" + deleteId).style.display = "none";
    document.getElementById("dc_" + deleteId).style.display = "unset";
  } else {
    document.getElementById("d_" + deleteId).style.display = "unset";
    document.getElementById("dc_" + deleteId).style.display = "none";
  }
}

/* Reply Highlighting */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function highlightReply(id) {
    let replyId = id + "p";
    var x = document.getElementById(replyId);

    if(darkMode === 'enabled')
      x.style.border = "2px dashed white";
    else
      x.style.border = "2px dashed black";
}

async function exitHighlight(id) {
    let replyId = id + "p";
    var x = document.getElementById(replyId);

    //await sleep(2500);

    if(darkMode === 'enabled')
      x.style.border = "1px solid #2f3336";
    else
      x.style.border = "none";
}
