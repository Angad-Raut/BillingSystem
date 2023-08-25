$(document).ready(function(){
    if (localStorage.getItem("userId")==null && localStorage.getItem("userType")==null && localStorage.getItem("X-LOCAL-TOKEN")==null){      	  			  		
      window.open("/login.html","_self");
    } else {
      getAllAgentList();
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
              getAllAgentList();
          }else{
            swal("Error",data.errorMessage, "error");
          }
        },
        error : function(result) {
          console.log(result.status);
        }
       });
  }
  
  function getAllAgentList(){
      var formData = {entityId:1};
      var table = $('#agentTableId').DataTable({
        'paging'      : true,
        'lengthChange': false,
        'searching'   : false,
        'ordering'    : true,
        'info'        : true,
        'autoWidth'   : false
      });
      table.clear().draw();
      $.ajax({
          type : "POST",
          headers: {"Authorization": "Bearer " + TOKEN},
          contentType: "application/json; charset=utf-8",
          url : REST_HOST+"/api/agentDetails/getAllAgentDetailsByUserId",
          dataType : "json",
          data : JSON.stringify(formData),
          success : function(data) {
            if(data.result!=null){
                var dataList=data.result;
                var count=1;
                for(var i in dataList){
                    table.row.add( [
                            count,
                            dataList[i].agentName,
                            dataList[i].agentMobile,
                            dataList[i].agentEmail,
                            dataList[i].agentAddress,
                            '<button class="btn btn-success btn-sm" type="button" onclick="getById('+dataList[i].agentId+')"><b>Edit</b></button>&nbsp;&nbsp;<button class="btn btn-danger btn-sm" type="button" onclick="updateStatus('+dataList[i].agentId+')"><b>'+dataList[i].status+'</b></button>'
                    ] ).draw(false);
                    count++;
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
  
function getById(id){
      var formData = {entityId:id};
      $.ajax({
          type : "POST",
          headers: {"Authorization": "Bearer " + TOKEN},
          contentType: "application/json; charset=utf-8",
          url : REST_HOST+"/api/agentDetails/getAgentById",
          dataType : "json",
          data : JSON.stringify(formData),
          success : function(data) {
            if(data.result!=null){
                $("#agentId").val(data.result.agentId);
                $("#agentnameid").val(data.result.agentName);
                $("#agentmobileid").val(data.result.agentMobile);
                if(data.result.emailId!=null){
                    $("#agentemailid").val(data.result.agentEmail);
                }
                $("#addresstxt").val(data.result.agentAddress);
                $("#modal-default").modal("show");
            }else{
                swal("Error",data.errorMessage, "error");
            }
          },
          error : function(result) {
            console.log(result.status);
          }
         });
}
  
function updateStatus(id){
      var formData ={entityId:id};
      swal({
                   title: "Are you sure?",
                   text: "Once you confirm Status will be updated",
                   type: "warning",
                   showCancelButton: true,
                   confirmButtonColor: "#DD6B55",
                   confirmButtonText: "Yes, update it!",
                   cancelButtonText: "No, cancel please!",
                   closeOnConfirm: false,
                   closeOnCancel: false
            },
            function(isConfirm){
                if (isConfirm) {
                  $.ajax({
                    type : "POST",
                    headers: {"Authorization": "Bearer " + TOKEN},
                    contentType: "application/json; charset=utf-8",
                    url : REST_HOST+"/api/agentDetails/updateAgentStatusById",
                    dataType : "json",
                    data : JSON.stringify(formData),
                    success : function(data) {
                      if(data.result==true){
                          swal({
                            title: "Updated!",
                            text: "Agent status updated successfully!",
                            timer: 1500,
                            type: "success",
                            showConfirmButton: false
                          });
                      }else{
                          swal("Error",data.errorMessage, "error");
                      }
                      getAllAgentList();
                    },
                    error : function(result) {
                      console.log(result.status);
                    }
                   });
                } else {
                    swal("Cancelled", "Agent status is not updated it's safe", "error");
                }
           });
}