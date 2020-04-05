const router = require('express').Router();
const { isAuthenticate  }=require('../middleware/authMiddleware')
 const { dashboardController} = require('../controllers/dashboardController');

 router.get('/',isAuthenticate,dashboardController);

 module.exports = router;