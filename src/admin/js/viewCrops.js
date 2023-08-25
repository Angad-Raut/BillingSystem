$(document).ready(function() {
    if (localStorage.getItem("userId")==null && localStorage.getItem("userType")==null && localStorage.getItem("X-LOCAL-TOKEN")==null){      	  			  		
      window.open("/login.html","_self");
    } else {
      getAllCrops();
    }
});
$("#addCropId").click(function(){
    var cropId = $("#cropId").val();
    var cropName = $("#cropName").val();
    var cropPrice = $("#cropPrice").val();
    var flag=0;
    if (cropName==""){
       swal("Warning!", "Please enter crop name!", "warning");
       flag=1;
       return false;
    }
    if(cropPrice==""){
       	swal("Warning!", "Please enter crop price!", "warning");
        flag=1;
        return false;
    }
    if(flag==0){
        formData = {
                    cropId:cropId,
                    cropName:cropName,
                    cropPrice:cropPrice,
                    requestedById:1,
                    requestedBy:21
        };
        addCrop(formData);
    }
});

function addCrop(formData){
  $.ajax({
      type : "POST",
      headers: {"Authorization": "Bearer " + TOKEN},
      contentType: "application/json; charset=utf-8",
      url : REST_HOST+"/api/cropDetails/addCrop",
      dataType : "json",
      data : JSON.stringify(formData),
      success : function(data) {
        if(data.result==true){
            if(formData.cropId==null){
                swal({
                  title: "Added!",
                  text: "Crop added successfully!",
                  timer: 1500,
                  type: "success",
                  showConfirmButton: false
                });
            }else{
                swal({
                  title: "Updated!",
                  text: "Crop updated successfully!",
                  timer: 1500,
                  type: "success",
                  showConfirmButton: false
                });
            }
            clearData();
            getAllCrops();
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
      url : REST_HOST+"/api/cropDetails/getCropById",
      dataType : "json",
      data : JSON.stringify(formData),
      success : function(data) {
        if(data.result!=null){
            $("#cropId").val(data.result.cropId);
            $("#cropName").val(data.result.cropName);
            $("#cropPrice").val(data.result.cropPrice);
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

function getAllCrops(){
  var formData = {entityId:1};
  var table = $('#cropTableId').DataTable();
  table.clear().draw();
  $.ajax({
      type : "POST",
      headers: {"Authorization": "Bearer " + TOKEN},
      contentType: "application/json; charset=utf-8",
      url : REST_HOST+"/api/cropDetails/getAllCropDetailsByUserId",
      dataType : "json",
      data : JSON.stringify(formData),
      success : function(data) {
        if(data.result!=null){
            var dataList=data.result;
            var count=1;
            for(var i in dataList){
                table.row.add( [
                        count,
                        dataList[i].cropName,
                        dataList[i].cropPrice,
                        dataList[i].status,
                        '<button class="btn btn-success btn-sm" type="button" onclick="getById('+dataList[i].cropId+')"><b>Edit</b></button>&nbsp;&nbsp;<button class="btn btn-danger btn-sm" type="button" onclick="updateStatus('+dataList[i].cropId+')"><b>'+dataList[i].status+'</b></button>'
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


$("#closeId").click(function(){
   clearData();
});

function clearData(){
  $("#cropId").val("");
  $("#cropName").val("");
  $("#cropPrice").val("");
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
                url : REST_HOST+"/api/cropDetails/updateCropStatusById",
                dataType : "json",
                data : JSON.stringify(formData),
                success : function(data) {
                  if(data.result==true){
                      swal({
                        title: "Updated!",
                        text: "Crop status updated successfully!",
                        timer: 1500,
                        type: "success",
                        showConfirmButton: false
                      });
                  }else{
                      swal("Error",data.errorMessage, "error");
                  }
                  getAllCrops();
                },
                error : function(result) {
                  console.log(result.status);
                }
               });
            } else {
                swal("Cancelled", "Crop status is not updated it's safe", "error");
            }
       });
  }
