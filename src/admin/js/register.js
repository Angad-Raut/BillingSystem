$(document).ready(function() {

});

$("#registerId").on('click',function(){
   var userId = $("#userId").val();
   var firstName = $("#firstnametxt").val();
   var lastName = $("#lastnametxt").val();
   var mobileNumber = $("#mobiletxt").val();
   var email = $("#emailtxt").val();
   var shopName = $("#shopnametxt").val();
   var password = $("#passwordtxt").val();
   var conpassword = $("#conpasswordtxt").val();
   var flag=0;
   if (firstName==""){
       swal("Warning!", "Please enter first name!", "warning");
       flag=1;
       return false;
   }
   if(lastName==""){
       swal("Warning!", "Please enter last name!", "warning");
       flag=1;
       return false;
   }
   if(mobileNumber==""){
       swal("Warning!", "Please enter mobile number!", "warning");
       flag=1;
       return false;
   }
   if(shopName==""){
       swal("Warning!", "Please enter shop name!", "warning");
       flag=1;
       return false;
   }
   if(password==""){
       swal("Warning!", "Please enter password!", "warning");
       flag=1;
       return false;
   }
   if(conpassword==""){
       swal("Warning!", "Please enter confirm password!", "warning");
       flag=1;
       return false;
   }
   if(conpassword!=password){
       swal("Warning!", "Confirm password should not match with password!", "warning");
       flag=1;
       return false;
   }
   if(flag==0){
      var formData={
                       userId:null,
                       firstName:firstName,
                       lastName:lastName,
                       mobileNumber:mobileNumber,
                       email:email,
                       shopName:shopName,
                       password:password
        };
        addUser(formData);
   }
});

function addUser(formData){
   $("#myDiv").LoadingOverlay("show");
   $.ajax({
   		type : "POST",
   		contentType: "application/json; charset=utf-8",
   		url : REST_HOST+"/addUser",
   		dataType : "json",
   		data : JSON.stringify(formData),
   		success : function(data) {
   			if(data.result==true){
                swal({
                    title: "Added!",
                    text: "User added successfully!",
                    timer: 1500,
                    type: "success",
                    showConfirmButton: false
                  });
                clearData();
                window.open("/login.html","_self");
   			}else{
   				swal("Error",data.errorMessage, "error");
   			}
   		},
   		complete : function(){
   			$("#myDiv").LoadingOverlay("hide");
   		},
   		error : function(result) {
   			console.log(result.status);
   			$("#myDiv").LoadingOverlay("hide");
   		}
      });
}

function clearData(){
    $("#userId").val("");
    $("#firstnametxt").val("");
    $("#lastnametxt").val("");
    $("#mobiletxt").val("");
    $("#emailtxt").val("");
    $("#shopnametxt").val("");
    $("#passwordtxt").val("");
    $("#conpasswordtxt").val("");
}