$(document).ready(function() {
    if (localStorage.getItem("userId")==null && localStorage.getItem("userType")==null && localStorage.getItem("X-LOCAL-TOKEN")==null){      	  			  		
       window.open("/login.html","_self");
    } else {
       getCropSettingByUserId();
    }
});

$("#cropSettingbtn").click(function(){
     var recordId= $("#recordid").val();
     var hamalitxt = $("#hamalitxtId").val();
     var tollaitxt= $("#tollaitxtId").val();
     var waraitxt = $("#waraitxtId").val();
     var bhadetxt = $("#bhadetxtId").val();
    var flag=0;
    if (hamalitxt==""){
        swal("Warning!", "Please enter hamali!", "warning");
        flag=1;
        return false;
    }
    if(tollaitxt==""){
       	swal("Warning!", "Please enter tollai!", "warning");
        flag=1;
        return false;
    }
    if(waraitxt==""){
        swal("Warning!", "Please enter warai!", "warning");
        flag=1;
        return false;
    }
    if(flag==0){
        formData = {
                    id:recordId,
                    warai:waraitxt,
                    hamali:hamalitxt,
                    tollai:tollaitxt,
                    bhade:bhadetxt,
                    requestedById:1,
                    requestedBy:21
        };
        addCropSetting(formData);
    }
});

function addCropSetting(formData){
    $.ajax({
        type : "POST",
        headers: {"Authorization": "Bearer " + TOKEN},
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/cropSetting/addCropSetting",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
          if(data.result==true){
              if(formData.id==null){
                  swal({
                    title: "Added!",
                    text: "Crop Setting added successfully!",
                    timer: 1500,
                    type: "success",
                    showConfirmButton: false
                  });
              }else{
                  swal({
                    title: "Updated!",
                    text: "Crop Setting updated successfully!",
                    timer: 1500,
                    type: "success",
                    showConfirmButton: false
                  });
              }
              getCropSettingByUserId();
          }else{
            swal("Error",data.errorMessage, "error");
          }
        },
        error : function(result) {
          console.log(result.status);
        }
       });
  }
  
  function getCropSettingByUserId(){
    var formData = {entityId:1};
    $.ajax({
        type : "POST",
        headers: {"Authorization": "Bearer " + TOKEN},
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/cropSetting/getCropSettingByUserId",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
          if(data.result!=null){
                if(data.result.id!=null){
                    $("#recordid").val(data.result.id);
                    $("#hamalitxtId").val(data.result.hamali);
                    $("#tollaitxtId").val(data.result.tollai);
                    $("#waraitxtId").val(data.result.warai);
                    $("#bhadetxtId").val(data.result.bhade);
                    disableAllFields();
                    $("#editbtn").show();
                }
          }else{
                swal("Error",data.errorMessage, "error");
          }
        },
        error : function(result) {
          console.log(result.status);
        }
       });
  }

 function disableAllFields(){
    $("#hamalitxtId").attr("disabled", "disabled"); 
    $("#tollaitxtId").attr("disabled", "disabled"); 
    $("#waraitxtId").attr("disabled", "disabled"); 
    $("#bhadetxtId").attr("disabled", "disabled"); 
 }

 $("#editbtn").on('click',function(){
    $("#hamalitxtId").removeAttr("disabled"); 
    $("#tollaitxtId").removeAttr("disabled"); 
    $("#waraitxtId").removeAttr("disabled"); 
    $("#bhadetxtId").removeAttr("disabled"); 
 });