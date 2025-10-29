const router = require('express').Router();
const ctrl = require('../controllers/transaction.controller');

router.post('/', ctrl.create);
router.get('/', ctrl.list);
router.get('/stats', ctrl.stats);
router.get('/summary', ctrl.summary);

module.exports = router;
