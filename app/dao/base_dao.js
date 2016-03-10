/*
BaseDAO 提供通用的数据交互接口
*/


var base_dao = function(model,schema){
	this.model = model;
	this.schema = schema;
};



/* 保存 */
base_dao.prototype.save = function(doc,success,err){
	var entity = new this.model(doc);
	entity.save(function(error){
		 if(error) {
            err(error);
        } else {
        	success(entity);
        }
	});
};

/* 查询全部 */
base_dao.prototype.find = function(find_info,fields,sort,callback){
	if(typeof(fields)=='function'){
		callback = fields;
	}
	this.model.find(find_info,fields,sort,callback);
};

base_dao.prototype.findById = function(id,callback){
	this.model.find({_id:id},function(err,docs){
		if(err){
			callback(err,null);
		}else{
			callback(null,docs[0]);
		}

	});
}

/* 分页 */
base_dao.prototype.page = function(find_info,start_page,page_size,callback){

}

/* 删除 */
base_dao.prototype.deleteById = function(del_ids,callback){
	this.model.remove({_id:del_ids},callback);
}

/* 更新 */
base_dao.prototype.update = function(conditions, doc, options, callback){
	this.model.update(conditions, doc, options, callback);
}

module.exports = base_dao;