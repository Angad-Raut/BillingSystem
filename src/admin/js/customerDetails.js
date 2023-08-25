$(document).ready(function(){
    if(localStorage.getItem("userId")==null && localStorage.getItem("userType")==null && localStorage.getItem("X-LOCAL-TOKEN")==null){      	  			  		
        window.open("/login.html","_self");
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

$("#viewCustbtn").click(function(){
    window.location.href='../../admin/pages/viewCustomer.html';
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
              window.location.href='../../admin/pages/viewCustomer.html';
          }else{
            swal("Error",data.errorMessage, "error");
          }
        },
        error : function(result) {
          console.log(result.status);
        }
       });
  }

