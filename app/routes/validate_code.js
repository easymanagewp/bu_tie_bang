var express = require('express');
var router = express.Router();

router.get('/hong_bao.html',require('./validate_code/to_hong_bao_1'));
router.get('/hong_bao_2.html',require('./validate_code/to_hong_bao_2'))
router.get('/hong_bao_3.html',require('./validate_code/to_hong_bao_3'))
router.put('/use_validate_code.do',require('./validate_code/put_validate_code_use'))

module.exports = router;