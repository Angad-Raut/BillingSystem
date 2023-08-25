$(document).ready(function(){
    if (localStorage.getItem("userId")==null && localStorage.getItem("userType")==null && localStorage.getItem("X-LOCAL-TOKEN")==null){      	  			  		
       window.open("/login.html","_self");
    } else {
       getAllCustomerOrders();
    }
});

function getAllCustomerOrders(){
    var formData = {entityId:1};
    var table = $('#customerOrderTableId').DataTable({
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
        url : REST_HOST+"/api/customerBilling/getAllCustomersOrdersByUserId",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
          if(data.result!=null){
              var dataList=data.result;
              for(var i in dataList){
                  table.row.add( [
                          dataList[i].srNo,
                          dataList[i].customerName,
                          dataList[i].customerMobile,
                          dataList[i].orderNumber,
                          dataList[i].orderDate,
                          dataList[i].discountedAmount,
                          '<button class="btn btn-success btn-sm" type="button" data-toggle="modal" data-target="#order-modal" onclick="getOrderDetails('+dataList[i].orderId+');"><b>View Order</b></button>&nbsp;&nbsp;<button class="btn btn-danger btn-sm" type="button" data-toggle="modal" data-target="#payment-info" onclick="getOrderAndPaymentDetails('+dataList[i].orderId+');"><b>Make Payment</b></button>'
                  ] ).draw(false);
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

function getOrderDetails(orderId){
  var formData = {entityId:orderId};
  $.ajax({
      type : "POST",
      headers: {"Authorization": "Bearer " + TOKEN},
      contentType: "application/json; charset=utf-8",
      url : REST_HOST+"/api/customerBilling/getOrderDetailsByOrderId",
      dataType : "json",
      data : JSON.stringify(formData),
      success : function(data) {
        if(data.result!=null){
            populateCustomerData(data.result);
            populateOrderData(data.result);
            populateOrderItems(data.result.orderItems);
        }else{
           swal("Error",data.errorMessage, "error");
        }
      },
      error : function(result) {
        console.log(result.status);
      }
     });
}

function populateCustomerData(data){
    $("#orderCustomerTableId").dataTable().fnDestroy();
    var custTable = $('#orderCustomerTableId').DataTable({
      'paging'      : false,
      'lengthChange': false,
      'searching'   : false,
      'ordering'    : false,
      'info'        : false,
      'autoWidth'   : false
    });
    custTable.clear().draw();
    custTable.row.add( [
        data.customerName,
        data.customerMobile,
        data.customerEmail,
        data.customerVillage
    ] ).draw(false);
}

function populateOrderData(data) {
    $("#orderTableId").dataTable().fnDestroy();
    var orderTable = $('#orderTableId').DataTable({
      'paging'      : false,
      'lengthChange': false,
      'searching'   : false,
      'ordering'    : false,
      'info'        : false,
      'autoWidth'   : false
    });
    orderTable.clear().draw();
    orderTable.row.add( [
        data.orderNumber,
        data.orderDate,
        data.orderAmount,
        data.orderDiscount,
        data.orderDiscountedAmount,
        data.paymentStatus
    ] ).draw(false);
}

function populateOrderItems(dataList) {
    $("#orderItemsTableId").dataTable().fnDestroy();
    var itemsTable = $('#orderItemsTableId').DataTable({
      'paging'      : false,
      'lengthChange': false,
      'searching'   : false,
      'ordering'    : false,
      'info'        : false,
      'autoWidth'   : false
    });
    itemsTable.clear().draw();
    for(var i in dataList) {
          itemsTable.row.add( [
            dataList[i].srNo,
            dataList[i].cropName,
            dataList[i].cropPrice,
            dataList[i].weight,
            dataList[i].quantity,
            dataList[i].totalAmount
        ] ).draw(false);
    }
}

$("#closeId").click(function(){
    var custTable = $('#orderCustomerTableId').DataTable({
      'paging'      : false,
      'lengthChange': false,
      'searching'   : false,
      'ordering'    : false,
      'info'        : false,
      'autoWidth'   : false
    });
    custTable.clear().draw();
    var orderTable = $('#orderTableId').DataTable({
      'paging'      : false,
      'lengthChange': false,
      'searching'   : false,
      'ordering'    : false,
      'info'        : false,
      'autoWidth'   : false
    });
    orderTable.clear().draw();
    var itemsTable = $('#orderItemsTableId').DataTable({
      'paging'      : false,
      'lengthChange': false,
      'searching'   : false,
      'ordering'    : false,
      'info'        : false,
      'autoWidth'   : false
    });
    itemsTable.clear().draw();
});

function getOrderAndPaymentDetails(orderId){
    var formData = {entityId:orderId};
    $.ajax({
        type : "POST",
        headers: {"Authorization": "Bearer " + TOKEN},
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/customerBilling/getOrderAndPaymentByOrderId",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
          if(data.result!=null){
              $("#orderid").val(orderId);
              $("#paymentid").val(data.result.paymentId);
              $("#ordernumbertxt").val(data.result.orderNumber);
              $("#orderdatetxt").val(data.result.orderDate);
              $("#orderamounttxt").val(data.result.orderAmount);
              $("#discountedamounttxt").val(data.result.discountedAmount);
              $("#paidamounttxt").val(data.result.paidAmount);
              $("#unpaidamounttxt").val(data.result.unpaidAmount);
              $("#paymentStatustxt").val(data.result.paymentStatus);
          }else{
            swal("Error",data.errorMessage, "error");
          }
        },
        error : function(result) {
          console.log(result.status);
        }
      });
}

$("#makePaymentbtn").click(function(){
      var orderId = $("#orderid").val();
      var paymentId = $("#paymentid").val();
      var amount = $("#amounttxt").val();
      var orderAmount = $("#discountedamounttxt").val();
      var paidAmount = $("#paidamounttxt").val();
      var flag=0;
      if(amount==""){
          swal("Warning!", "Please enter some amount!", "warning");
          flag=1;
          return false;
      }
      if(paidAmount==orderAmount) {
          swal("Warning!", "Payment already done!", "warning");
          flag=1;
          return false;
      }
      if(flag==0) {
          var formData = {
            orderId:orderId,
            paymentId:paymentId,
            paymentAmt:amount,
            requestedById:1,
            requestedBy:21
          };
          makePaymentDetails(formData);
      }
});

function makePaymentDetails(formData) {
      $.ajax({
        type : "POST",
        headers: {"Authorization": "Bearer " + TOKEN},
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/customerBilling/makePayment",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
          if(data.result!=null){
             swal({
              title: "Updated!",
              text: "Payment done successfully!",
              timer: 1500,
              type: "success",
              showConfirmButton: false
            });
             $("#payment-info").modal("hide");
          }else{
             swal("Error",data.errorMessage, "error");
          }
          clearData();
        },
        error : function(result) {
          console.log(result.status);
        }
      });
}

$("#clearDataId").click(function(){
    clearData();
});

function clearData(){
    $("#orderid").val("");
    $("#paymentid").val("");
    $("#ordernumbertxt").val("");
    $("#orderdatetxt").val("");
    $("#orderamounttxt").val("");
    $("#discountedamounttxt").val("");
    $("#paidamounttxt").val("");
    $("#unpaidamounttxt").val("");
    $("#paymentStatustxt").val("");
    $("#amounttxt").val("");
}