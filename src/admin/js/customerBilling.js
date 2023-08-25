var arrayList = [];
var itemList = [];
var cropList = [];
var counter = 0;
var orderTotalAmount=0;
var orderFinalAmount=0;
$(document).ready(function(){
    if (localStorage.getItem("userId")==null && localStorage.getItem("userType")==null && localStorage.getItem("X-LOCAL-TOKEN")==null){      	  			  		
        window.open("/login.html","_self");
    } else {
        $('input[type=radio][name=r3]').change(function() {
            if (this.value == 1) {
                $("#mydiv").hide();
                $(".mydiv2").show();
            }else if (this.value == 2) {
                $("#mydiv").show();
                $(".mydiv2").hide();
            }
        });
        getCropDropDown();
    }
});

$("input").keypress(function(){
    var weight = parseFloat($("#weighttxt").val());
    var rate = $("#pricetxt").val();
    var total = parseFloat((weight*rate)/100);
    $("#totaltxt").val(total);
  });

$("#searchbtn").click(function(){
    $(".mydiv2").show();
    var mobileNo = $("#searchtxt").val();
    if(mobileNo==""){
        swal("Warning!", "Please enter mobile number", "warning");
        return false;
    } else {
        getCustomerDetailsByMobile(mobileNo);
    }
});

$('#dicountTypetxtId').change(function () {
    var discounttype = $('#dicountTypetxtId').val();
    if (discounttype=="") {
        swal("Warning!", "Please select discount type", "warning");
        return false;
    } else {
        getDiscountDropDown(discounttype);
    }
});

$('#discounttxtId').change(function () {
  var discounttype = $('#dicountTypetxtId').val();
  var discount = $('#discounttxtId').val();
  var finaltotal = $("#finaltotaltxt").val();
  if (discounttype=="") {
      swal("Warning!", "Please select discount type", "warning");
      return false;
  } else if (discount=="") {
      swal("Warning!", "Please select discount", "warning"); 
      return false;
  } else if (finaltotal=="") {  
      swal("Warning!", "Please provide final total amount", "warning");   
      return false;  
  } else {
      var totalDiscountAmt=0;
      if (discounttype==1) {
         totalDiscountAmt=((finaltotal*discount)/100);
         totalFinalAmount=(finaltotal-totalDiscountAmt);
      } else if (discounttype==2) {
         totalDiscountAmt=discount;
         totalFinalAmount=(finaltotal-totalDiscountAmt);
      } 
      $("#discountedAmttxt").val(totalDiscountAmt);
      $("#orderFinalTotaltxt").val(totalFinalAmount);
  }
});

$('#croptxt').change(function () {
  var cropid = $('#croptxt').val();
  if (cropid=="") {
      swal("Warning!", "Please select crop", "warning");
      return false;
  } else {
      var price = getCropPrice(cropid);
      $("#pricetxt").val(price);
  }
});

$("#savebtn").click(function(){
      var customerId = $("#customerId").val();
      var customerName = $("#fnametxt").val();
      var customerMobile = $("#mobiletxt").val();
      var customerEmail = $("#emailtxt").val();
      var customerVillage = $("#villagetxt").val();
      var discountType = $('#dicountTypetxtId').val();
      var discount = $('#discounttxtId').val();
      var finaltotalAmount = $("#finaltotaltxt").val();
      var finalOrderAmount = $("#orderFinalTotaltxt").val();
      var flag=0;
      if (customerName=="") {
          swal("Warning!", "Please enter customer name", "warning");
          flag=1;
          return false;
      } else if (customerMobile=="") {
          swal("Warning!", "Please enter customer mobile", "warning");
          flag=1;
          return false;
      } else if (customerVillage=="") {
          swal("Warning!", "Please enter customer village", "warning");
          flag=1;
          return false;
      } else if (arrayList.length==0) {
          swal("Warning!", "Please add atleast one item", "warning");
          flag=1;
          return false;
      } else if (finaltotalAmount=="") {
          swal("Warning!", "Please provide order total amount", "warning");
          flag=1;
          return false;
      } else if (finalOrderAmount=="") {
          swal("Warning!", "Please provide order final total amount", "warning");
          flag=1;
          return false;
      }
      if(flag==0){
          if(discountType=="" && discount==""){
             discountType=null;
             discount=null;
             orderFinalAmount=finaltotalAmount;
          }
          var formData = {
                        customerId:customerId,
                        customerName:customerName,
                        customerMobile:customerMobile,
                        customerEmail:customerEmail,
                        village:customerVillage,
                        orderTotalAmt:finaltotalAmount,
                        orderDiscount:discount,
                        orderDiscountType:discountType,
                        orderDiscountedAmt:finalOrderAmount,
                        itemDtoList:itemList,
                        requestedById:1,
                        requestedBy:21
          };
          placeOrder(formData);
      }
});

$("#addCropItemId").click(function(){
    var recordId = $("#recordId").val();
    var cropId = $("#croptxt").val();
    var rate = $("#pricetxt").val();
    var weight = $("#weighttxt").val();
    var quantity = $("#quantitytxt").val();
    var total = $("#totaltxt").val();
    var flag=0;
    if (cropId==""){
       swal("Warning!", "Select Crop!", "warning");
       flag=1;
       return false;
    }
    if(rate==""){
       	swal("Warning!", "Please Enter Crop Rate!", "warning");
        flag=1;
        return false;
    }
    if(weight==""){
        swal("Warning!", "Please Enter Crop Weight!", "warning");
        flag=1;
        return false;
    }
    if(quantity==""){
        swal("Warning!", "Please Enter Crop Quantity!", "warning");
        flag=1;
        return false;
    }
    if(total==""){
        swal("Warning!", "Total cannot be empty!", "warning");
        flag=1;
        return false;
    }
    if(isCropExist(cropId)){
        swal("Warning!", "This crop you have already added, please try another one!", "warning");
        flag=1;
        return false;
    }
    if(flag==0){
       if (recordId==""){
            orderTotalAmount=(orderTotalAmount+parseFloat(total));
            var cropname = getCropName(cropId);
            arrayList.push({"counter":counter,"cropId":cropId,"crop":cropname,
                            "rate":rate,"weight":weight,
                            "quantity":quantity,"totalAmount":total,
                            "requestedById":1,"requestedBy":21
                          });            
            clearData();
            populateTable(arrayList,true);
            swal({
                title: "Inserted!",
                text: "Record Inserted Successfully!",
                timer: 1500,
                type: "success",
                showConfirmButton: false
            });
       } else {
            updateRow(recordId);
       }
       displayData();
    }
});

$("#closeId").click(function(){
   clearData();
});

function clearData(){
   $("#recordId").val("");
   $("#croptxt").val("");
   $("#pricetxt").val("");
   $("#weighttxt").val("");
   $("#quantitytxt").val("");
   $("#totaltxt").val("");
}

function populateTable(arrayList,isAddFlag){
    var discountType = $('#dicountTypetxtId').val();
    var table = $('#billingTableId').DataTable();
    table.clear().draw();
    var count=1;
    itemList = [];
    for(var i in arrayList){
       $("#finaltotaltxt").val(orderTotalAmount);
       if(discountType==""){
          $("#orderFinalTotaltxt").val(orderTotalAmount);
       }
       itemList.push({"cropId":arrayList[i].cropId,"rate":arrayList[i].rate,"weight":arrayList[i].weight,
                          "quantity":arrayList[i].quantity,"totalAmount":arrayList[i].totalAmount
                         });  
       table.row.add( [
                  count,
                  arrayList[i].crop,
                  arrayList[i].rate,
                  arrayList[i].weight,
                  arrayList[i].quantity,
                  arrayList[i].totalAmount,
                  '<a class="btn btn-success btn-sm btn-edit" type="button"><b>Edit</b></a>&nbsp;&nbsp;<a class="btn btn-danger btn-sm" onclick="deleteRow(this)" type="button"><b>Delete</b></a>'
       ] ).draw(false);
       if(isAddFlag){
          counter++;
       }
       count++;
    }
}

/******** Delete Record **********/
function deleteRow(r) {
  swal({
    title: "Are you sure?",
    text: "Once you confirm Record will be deleted",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel please!",
    closeOnConfirm: false,
    closeOnCancel: false
  },
  function(isConfirm){
    if (isConfirm) {
      var i = r.parentNode.parentNode.rowIndex;
      document.getElementById("billingTableId").deleteRow(i);
      var index = i-1;
      if (index > -1) {
        arrayList.splice(index, 1);
      }
      populateTable(arrayList,false);
      hideData();
      swal({
        title: "Deleted!",
        text: "Record is deleted successfully!",
        timer: 1500,
        type: "success",
        showConfirmButton: false
     });
    } else {
      swal("Cancelled", "Record is not updated it's safe", "error");
    }
  });
}

/******** Edit Record **********/
 $("body").on("click", ".btn-edit", function(){
        var table = $('#billingTableId').DataTable();
        var data = table.row($(this).parents('tr')).data();
        var index = data[0];
        var crop = data[1];
        var rate = data[2];
        var weight = data[3];
        var quantity = data[4];
        var total = data[5];
        $("#recordId").val(index-1);
        $("#croptxt").val(crop);
        $("#pricetxt").val(rate);
        $("#weighttxt").val(weight);
        $("#quantitytxt").val(quantity);
        $("#totaltxt").val(total);
        $("#crop-modal").modal("show");
 });

/******** Update Record **********/
 function updateRow(id) {
      swal({
        title: "Are you sure?",
        text: "Once you confirm Record will be updated",
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
            var table = $('#billingTableId').DataTable();
            var count=1;
            var crop = $("#croptxt").val();
            var rate = $("#pricetxt").val();
            var weight = $("#weighttxt").val();
            var quantity = $("#quantitytxt").val();
            var total = $("#totaltxt").val();
            objIndex = arrayList.findIndex((obj => obj.counter == id));
            arrayList[objIndex].crop = crop;
            arrayList[objIndex].rate = rate;
            arrayList[objIndex].weight = weight;
            arrayList[objIndex].quantity = quantity;
            arrayList[objIndex].totalAmount = total;
            populateTable(arrayList,false);
            swal({
                title: "Updated!",
                text: "Record is updated successfully!",
                timer: 1500,
                type: "success",
                showConfirmButton: false
             });
            clearData();
        } else {
            swal("Cancelled", "Record is not updated it's safe", "error");
        }
      });
 }

 function getCropName(cropId){
     var cropname = null;
     for(var i in cropList){
         if(cropList[i].cropId==cropId){
             cropname = cropList[i].cropName;
             break;
         }
     }
     return cropname;
 }

 function getCropPrice(cropId){
  var cropPrice = null;
  for(var i in cropList){
      if(cropList[i].cropId==cropId){
          cropPrice = cropList[i].cropPrice;
          break;
      }
  }
  return cropPrice;
}

function isCropExist(cropid) {
     for(var i in arrayList){
        if(arrayList[i].cropId==cropid){
            return true;
        } else {
            return false;
        }
     }
}

$("#clearDataId").click(function(){
    clearAllData();
});
