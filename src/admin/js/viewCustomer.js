$(document).ready(function(){
    if (localStorage.getItem("userId")==null && localStorage.getItem("userType")==null && localStorage.getItem("X-LOCAL-TOKEN")==null){      	  			  		
      window.open("/login.html","_self");
    } else {
      getAllCustomerList();
    }
});

$("#custsavebtn").on('click',function(){
  var customerId = $("#custId").val();
  var fullname = $("#fnameid").val();
  var mobileNo = $("#mobileid").val();
  var emailId = $("#emailid").val();
  var village = $("#villageid").val();
  var flag=0;
  if(fullname==""){
      swal("Warning!", "Please enter customer full name!", "warning");
      flag=1;
      return false;
  }
  if(mobileNo==""){
      swal("Warning!", "Please enter customer mobile number!", "warning");
      flag=1;
      return false;
  }
  if(village==""){
      swal("Warning!", "Please enter customer village name!", "warning");
      flag=1;
      return false;
  }
  if(flag==0){
      formData = {
                  customerId:customerId,
                  customerName:fullname,
                  customerMobile:mobileNo,
                  customerEmail:emailId,
                  village:village,
                  requestedById:1,
                  requestedBy:21
      };
      addCustomer(formData);
  }
});

function clearData(){
  $("#custId").val("");
  $("#fnameid").val("");
  $("#mobileid").val("");
  $("#emailid").val("");
  $("#villageid").val("");
}

$("#cancelId").click(function(){
  clearData();
});

function addCustomer(formData){
  $.ajax({
      type : "POST",
      headers: {"Authorization": "Bearer " + TOKEN},
      contentType: "application/json; charset=utf-8",
      url : REST_HOST+"/api/customerDetails/addCustomer",
      dataType : "json",
      data : JSON.stringify(formData),
      success : function(data) {
        if(data.result==true){
            if(formData.cropId==null){
                swal({
                  title: "Added!",
                  text: "Customer added successfully!",
                  timer: 1500,
                  type: "success",
                  showConfirmButton: false
                });
            }else{
                swal({
                  title: "Updated!",
                  text: "Customer updated successfully!",
                  timer: 1500,
                  type: "success",
                  showConfirmButton: false
                });
            }
            clearData();
            getAllCustomerList();
        }else{
          swal("Error",data.errorMessage, "error");
        }
      },
      error : function(result) {
        console.log(result.status);
      }
     });
}

function getAllCustomerList(){
    var formData = {entityId:1};
    var table = $('#customerTableId').DataTable({
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
        url : REST_HOST+"/api/customerDetails/getAllCustomerDetailsByUserId",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
          if(data.result!=null){
              var dataList=data.result;
              var count=1;
              for(var i in dataList){
                  table.row.add( [
                          count,
                          dataList[i].customerName,
                          dataList[i].customerMobile,
                          dataList[i].customerEmail,
                          dataList[i].village,
                          '<button class="btn btn-success btn-sm" type="button" onclick="getById('+dataList[i].customerId+')"><b>Edit</b></button>&nbsp;&nbsp;<button class="btn btn-danger btn-sm" type="button" onclick="updateStatus('+dataList[i].customerId+')"><b>'+dataList[i].status+'</b></button>'
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
        url : REST_HOST+"/api/customerDetails/getCustomerById",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
          if(data.result!=null){
              $("#custId").val(data.result.customerId);
              $("#fnameid").val(data.result.customerName);
              $("#mobileid").val(data.result.customerMobile);
              if(data.result.emailId!=null){
                  $("#emailid").val(data.result.emailId);
              }
              $("#villageid").val(data.result.village);
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
                  url : REST_HOST+"/api/customerDetails/updateCustomerStatusById",
                  dataType : "json",
                  data : JSON.stringify(formData),
                  success : function(data) {
                    if(data.result==true){
                        swal({
                          title: "Updated!",
                          text: "Customer status updated successfully!",
                          timer: 1500,
                          type: "success",
                          showConfirmButton: false
                        });
                    }else{
                        swal("Error",data.errorMessage, "error");
                    }
                    getAllCustomerList();
                  },
                  error : function(result) {
                    console.log(result.status);
                  }
                 });
              } else {
                  swal("Cancelled", "Customer status is not updated it's safe", "error");
              }
         });
    }