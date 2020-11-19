

function moveImg(event) {
    var x = event.clientX;
    var y = event.clientY;

    console.log("{{postNumber}}");

    var thumb = document.getElementById("{{postNumber}}");
    var canvas = document.getElementById("c__{{postNumber}}")

    $("#{{postNumber}}").css({
        "position": "absolute",
        "left": x - (thumb.width / 2) +'px',
        "top":  y - (thumb.height / 2)+'px',
        "width": "40%",
        "height": "auto",
    });

    $("#c__{{postNumber}}").css({
        "width": thumb.width,
        "height": thumb.height,
    });
}

function revertImg() {
    var thumb = document.getElementById("{{postNumber}}");

    $("{{postNumber}}").css({
        "position": "relative",
     });
}

