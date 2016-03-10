require(['http','jquery'],function($http){
    /* 兑换码兑换 */
    window.use = function(registration_id){
        $http.Put('/use_validate_code.do').params('_id',registration_id).success(function(resp){
            if($http.ValidateResp.success(resp)){
                window.location.reload();
            }else{
                alert('兑换劵消费失败');
            }
        }).go();
    }
    $(function(){
       $("#search").on('click',function(){
           var mobile = $('#mobile').val();
           var validate_code = $("#validate_code").val();
           window.location.href = "/user_list.html?mobile="+mobile+"&validate_code="+validate_code;
       });
    })
});