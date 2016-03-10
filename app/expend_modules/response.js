module.exports = {
    create : function(status,result,msg){
        return {
            status : status,
            result : result,
            message : msg
        }
    },
    STATUS : {
        SUCCESS : 0,
        FAIL : -1,
        EMPTY : 1
    }
}