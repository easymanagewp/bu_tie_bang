require(['jquery','http','utils'],function($,$http,$utils){
    var validateCodeBtn = $("#get_validatecode_btn"),
        submitBtn = $('#submit_btn'),
        mobileInput = $(':input[name="mobile"]'),
        validateCodeInput = $(':input[name="validate_code"]'),
        openIdInput = $('#openid');

    var validateCodeClick = function(){
        if($utils.strIsBlankOrNull(mobileInput.val())){
            $utils.alert('请输入手机号');
            return;
        }
        var iIndex = 60;
        var html = validateCodeBtn.html();
        var execTimeout = function(){
            validateCodeBtn.unbind('click');
            setTimeout(function(){
                iIndex --;
                var nhtml = html + "(" + iIndex+")";
                if(iIndex ==0){
                    validateCodeBtn.bind('click',validateCodeClick);
                    nhtml = html;
                }
                validateCodeBtn.html(nhtml);
                if(iIndex > 0){
                    execTimeout();
                }
            },1000)
        };
        execTimeout();

        $http.Get('/registration/validate_code.do').params('mobile',mobileInput.val()).success(function(resp){
            if($http.ValidateResp.success(resp)){
                validateCodeBtn.attr('disable',false);
                setTimeout(function(){
                    validateCodeBtn.removeAttr('disable');
                },6*1000);
            }else{
                $utils.alert(resp.message);
            }
        }).go();
    };
    validateCodeBtn.bind('click',validateCodeClick);

    submitBtn.on('click',function(){
        if($utils.strIsBlankOrNull(mobileInput.val())){
            $utils.alert('请输入手机号');
            return;
        }

        if($utils.strIsBlankOrNull(validateCodeInput.val())){
            $utils.alert('请输入验证码');
            return;
        }

        $http.Post('/registration.do').params({
            openid : openIdInput.val(),
            mobile : mobileInput.val(),
            validate_code : validateCodeInput.val()
        }).success(function(resp){
            if($http.ValidateResp.success(resp)) {
                $utils.next('/v/registration/success.html?validateCode='+resp.result.validateCode)
            }else{
                $utils.alert(resp.message);
            }
        }).go();
    });

})