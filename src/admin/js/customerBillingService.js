
function displayData(){
    if(arrayList.length!=0){
       $("#savebtn").show();
       $("#clearDataId").show();
       $("#finalBillDetails").show();
    }
}

function hideData(){
 if(arrayList.length==0){
    $("#savebtn").hide();
    $("#clearDataId").hide();
    $("#finalBillDetails").hide();
 }
}

function getCropDropDown(){
    var formData ={entityId:1};
    $.ajax({
        type : "POST",
        headers: {"Authorization": "Bearer " + TOKEN},
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/cropDetails/getCropDropDownByUserId",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
          if(data.result!=null){
            cropList = data.result;
            var output;
            for(i in data.result){
              output+='<option value="'+data.result[i].cropId+'">'+data.result[i].cropName+'</option>';				
            }
            output='<option value="">Select Crop</option>'+output;
            $('#croptxt').html(output);
          }else{
            swal("Error",data.errorMessage, "error");
          }
        },
        error : function(result) {
          console.log(result.status);
        }
       });
}

function getDiscountDropDown(type){
    var formData ={entityId:1,entityType:type};
    $.ajax({
        type : "POST",
        headers: {"Authorization": "Bearer " + TOKEN},
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/discounts/getDiscountDropDownByUserId",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
          if(data.result!=null){
            var output;
            for(i in data.result){
              output+='<option value="'+data.result[i].discount+'">'+data.result[i].discount+'</option>';				
            }
            output='<option value="">Select Discount</option>'+output;
			      $('#discounttxtId').html(output);
          }else{
            swal("Error",data.errorMessage, "error");
          }
        },
        error : function(result) {
          console.log(result.status);
        }
       });
}

function getCustomerDetailsByMobile(mobileNo){
    var formData ={entityId:mobileNo};
    $.ajax({
        type : "POST",
        headers: {"Authorization": "Bearer " + TOKEN},
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/customerDetails/getCustomerDetailsByMobile",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
          if(data.result!=null){
              $("#customerId").val(data.result.customerId);
              $("#fnametxt").val(data.result.customerName);
              $("#mobiletxt").val(data.result.customerMobile);
              $("#emailtxt").val(data.result.customerEmail);
              $("#villagetxt").val(data.result.customerVillage);
          }else{
            swal("Error",data.errorMessage, "error");
          }
        },
        error : function(result) {
          console.log(result.status);
        }
    });
}

function placeOrder(formData){
    $.ajax({
        type : "POST",
        headers: {"Authorization": "Bearer " + TOKEN},
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/customerBilling/placeOrder",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
          if(data.result!=null && data.result==true){
            swal({
              title: "Inserted!",
              text: "Order successfully placed!",
              timer: 1500,
              type: "success",
              showConfirmButton: false
            });
          }else{
            swal("Error",data.errorMessage, "error");
          }
          clearAllData();
          window.location.href='../../admin/pages/customerOrders.html';
        },
        error : function(result) {
          console.log(result.status);
        }
    });
}

function clearAllData() {
    clearData();
    var table = $('#billingTableId').DataTable();
    table.clear();
    $("#customerId").val("");
    $("#fnametxt").val("");
    $("#mobiletxt").val("");
    $("#emailtxt").val("");
    $("#villagetxt").val("");
    $('#dicountTypetxtId').val("");
    $('#discounttxtId').val("");
    $("#finaltotaltxt").val("");
    $("#discountedAmttxt").val("");
    $("#orderFinalTotaltxt").val("");
    $("#searchtxt").val("");
    orderFinalAmount=0;
    orderTotalAmount=0;
    itemList = [];
    arrayList = [];
    cropList = [];
}