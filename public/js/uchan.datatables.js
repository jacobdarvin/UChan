$(document).ready( function () {
    var reportTable = $('#reportTable').DataTable();
    var moderatorTable = $('#moderatorTable').DataTable();
    var keysTable = $('#keysTable').DataTable();
    var bannedTable = $('#bannedTable').DataTable();

    //ON OPEN
    $('#reportTable tbody').on('click', 'tr', function () {
      var data = reportTable.row( this ).data();
      //alert( 'You clicked on '+data[0]+'\'s row' );

      $('#reportDataModal-Title').text("Post @" + data[0]);

      $('#reportDataModal-PostN').text(data[0]);
      $('#reportDataModal-Board').text(data[1]);
      $('#reportDataModal-Law').text(data[2]);
      $('#reportDataModal-Off').text(data[3]);
      $('#reportDataModal-Spam').text(data[4]);

      $('#reportDataModal').modal('show');

      $('#ban-post-number').val(data[0]);
    });

    $('#moderatorTable tbody').on('click', 'tr', function () {
      var data = moderatorTable.row( this ).data();

      //DELETE MODERATOR
      $("#deleteModeratorButton").attr("onclick","alert(" + data[0] + ")");
      $('#modManageUsername').val(data[0]);

      if(data[1] != ''){
        $('#modManageModal-Boards').text(data[1]);
        var boardArray = data[1].split(",");
        document.getElementById("removeBoardArea").innerHTML = '';
        for(let i = 0; i < boardArray.length; i++) {
          document.getElementById("removeBoardArea").innerHTML +=
          "<button type='button' class='btn btn-danger mb-1'><i class='fas fa-times-circle'></i> Remove " + boardArray[i] + "</button> <br>";
        }
      } else {
        $('#modManageModal-Boards').text("Managing No Boards");
        document.getElementById("removeBoardArea").innerHTML = '';
      }

      $('#modManageModal').modal('show');
    } );

    $('#bannedTable tbody').on('click', 'tr', function () {
      var data = bannedTable.row( this ).data();
      alert( 'You clicked on '+data[0]+'\'s row' );
    } );
} );
