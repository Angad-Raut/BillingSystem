$(document).ready(function(){
    if(localStorage.getItem("userId")==null && localStorage.getItem("userType")==null && localStorage.getItem("X-LOCAL-TOKEN")==null){      	  			  		
        window.open("/login.html","_self");
    }
});
$("#agentsavebtn").on('click',function(){
    var agentId = $("#agentId").val();
    var agentName = $("#agentnameid").val();
    var agentMobileNo = $("#agentmobileid").val();
    var agentEmailId = $("#agentemailid").val();
    var agentAddress = $("#addresstxt").val();
    var flag=0;
    if(agentName==""){
        swal("Warning!", "Please enter agent name!", "warning");
        flag=1;
        return false;
    }
    if(agentMobileNo==""){
        swal("Warning!", "Please enter agent mobile number!", "warning");
        flag=1;
        return false;
    }
    if(agentAddress==""){
        swal("Warning!", "Please enter agent address!", "warning");
        flag=1;
        return false;
    }
    if(flag==0){
        formData = {
                    agentId:agentId,
                    agentName:agentName,
                    agentMobile:agentMobileNo,
                    agentEmail:agentEmailId,
                    agentAddress:agentAddress,
                    requestedById:1,
                    requestedBy:21
        };
        addAgentDetails(formData);
    }
});

function clearData(){
    $("#agentId").val("");
    $("#agentnameid").val("");
    $("#agentmobileid").val("");
    $("#agentemailid").val("");
    $("#addresstxt").val("");
}

$("#cancelId").click(function(){
    clearData();
 });

$("#viewAgentbtn").click(function(){
    window.location.href='../../admin/pages/viewAgentDetails.html';
});

function addAgentDetails(formData){
    $.ajax({
        type : "POST",
        headers: {"Authorization": "Bearer " + TOKEN},
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/agentDetails/addAgent",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
          if(data.result==true){
              if(formData.cropId==null){
                  swal({
                    title: "Added!",
                    text: "Agent details added successfully!",
                    timer: 1500,
                    type: "success",
                    showConfirmButton: false
                  });
              }else{
                  swal({
                    title: "Updated!",
                    text: "Agent details updated successfully!",
                    timer: 1500,
                    type: "success",
                    showConfirmButton: false
                  });
              }
              clearData();
              window.location.href='../../admin/pages/viewAgentDetails.html';
          }else{
            swal("Error",data.errorMessage, "error");
          }
        },
        error : function(result) {
          console.log(result.status);
        }
       });
  }

