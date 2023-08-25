var REST_HOST="http://127.0.0.1:9597";
var TOKEN = localStorage.getItem("X-LOCAL-TOKEN");
$("#logoutId").click(function(){
    $.ajax({
        type : "GET",
        url: REST_HOST+"/auth/logout",
        contentType: "application/json; charset=utf-8",
        success: function(data, textStatus, jqXHR){
          if(jqXHR.status==200){
            localStorage.clear();
            swal({
                title: "Logout!",
                text: "your logout successfully!",
                timer: 1500,
                type: "success",
                showConfirmButton: false
            });
            //window.open("../../../login.html","_self");
            window.open("/login.html","_self");
          }
        },
        error: function(jqXHR, textStatus, errorThrown){
          console.log(textStatus + ": " + jqXHR.status + " " + errorThrown);
        }
      });
});