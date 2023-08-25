$(document).ready(function(){
    if (localStorage.getItem("userId")==null && localStorage.getItem("userType")==null && localStorage.getItem("X-LOCAL-TOKEN")==null){      	  			  		
      window.open("/login.html","_self");
    } else {
      getAllDiscounts();
    }
});

$("#addDiscountId").on('click',function(){
      var recordId = $("#recordId").val();
      var discountType = $("input:radio[name=discount]:checked").val();
      var discountValue = $("#discountxt").val();
      var flag=0;
      if (discountType==""){
        swal("Warning!", "Select discount type!", "warning");
        flag=1;
        return false;
     }
     if(discountValue==""){
         swal("Warning!", "Please enter discount value!", "warning");
         flag=1;
         return false;
     }
     if(flag==0){
         formData = {
                     id:recordId,
                     discountType:discountType,
                     discountValue:discountValue,
                     requestedById:1,
                     requestedBy:21
         };
         addDiscountSetting(formData);
     }
});

$("#closeId").on('click',function(){
    $("#recordId").val("");
    $("#discountxt").val("");
    $("#percentageId:checked").val();
});

function addDiscountSetting(formData){
    $.ajax({
        type : "POST",
        headers: {"Authorization": "Bearer " + TOKEN},
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/discounts/addDiscount",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
          if(data.result==true){
              if(formData.id==null){
                  swal({
                    title: "Added!",
                    text: "Discount added successfully!",
                    timer: 1500,
                    type: "success",
                    showConfirmButton: false
                  });
              }else{
                  swal({
                    title: "Updated!",
                    text: "Discount upadted successfully!",
                    timer: 1500,
                    type: "success",
                    showConfirmButton: false
                  });
              }
              getAllDiscounts();
              $("#recordId").val("");
              $("#discountxt").val("");
              $("#percentageId:checked").val();
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
        url : REST_HOST+"/api/discounts/getDiscountById",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
          if(data.result!=null){
              $("#recordId").val(data.result.id);
              $("#discountxt").val(data.result.discountValue);
              if(data.result.discountType==1){
                 $("#percentageId:checked").val();
              }else{
                 $("#rupeesId:checked").val();
              }
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

  function getAllDiscounts(){
    var formData = {entityId:1};
    var table = $('#discountSettingTableId').DataTable({
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
        url : REST_HOST+"/api/discounts/getAllDiscountsByUserId",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
          if(data.result!=null){
              var dataList=data.result;
              var count=1;
              for(var i in dataList){
                  var discountType = null;
                  if(dataList[i].discountType==1){
                     discountType = "Percentage";
                  }else{
                     discountType = "Rupees";
                  }
                  table.row.add( [
                          count,
                          discountType,
                          dataList[i].discountValue,
                          '<button class="btn btn-success btn-sm" type="button" onclick="getById('+dataList[i].id+')"><b>Edit</b></button>'
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

  