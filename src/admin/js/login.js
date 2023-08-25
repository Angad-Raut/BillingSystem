$("#loginbtnId").on('click',function(){
     var logintype = $("input:radio[name=loginType]:checked").val()
     var username = $("#usernametxt").val();
     var password = $("#passwordtxt").val();
     var flag=0;
     if (logintype==""){
        swal("Warning!", "Please select login type!", "warning");
        flag=1;
        return false;
    }
    if(username==""){
        swal("Warning!", "Please enter username!", "warning");
        flag=1;
        return false;
    }
    if(password==""){
        swal("Warning!", "Please enter password!", "warning");
        flag=1;
        return false;
    }
    if(flag==0){
        var isMobileValue=false;
        if(logintype==1)
        {
            isMobileValue=true;
        }
        var formData = {isMobile:isMobileValue,userName:username,password:password};
        getLogin(formData);
    }
});

function getLogin(formData){
    $("#myDiv").LoadingOverlay("show");
    $.ajax({
            type : "POST",
            contentType: "application/json; charset=utf-8",
            url : REST_HOST+"/auth/login",
            dataType : "json",
            data : JSON.stringify(formData),
            success : function(data) {
                if(data.result!=null){
                    swal({
                        title: "LogedIn!",
                        text: "Login successfully!",
                        timer: 1500,
                        type: "success",
                        showConfirmButton: false
                    });
                    var loginData = data.result.loginResponseDto;
                    localStorage.setItem("firstName", loginData.firstName);
                    localStorage.setItem("lastName", loginData.lastName);
                    localStorage.setItem("userId", loginData.userId);
                    localStorage.setItem("userType",loginData.userType);	
                    localStorage.setItem("X-LOCAL-TOKEN",data.result.jwtToken);  
                    window.open("src/admin/pages/dashboard.html","_self");
                    clearData();
                }else{
                    swal("Error",data.errorMessage, "error");
                }
            },
            complete : function(){
                $("#myDiv").LoadingOverlay("hide");
            },
            error : function(result) {
                console.log(result.status);
                $("#myDiv").LoadingOverlay("hide");
            }
       });
}

function clearData(){
    $("#usernametxt").val("");
    $("#passwordtxt").val("");
}