var express = require('express');
// var data= require('../dummydata/data')
var router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../generateToken');
// const { allUsers } = require('../controllers/userController');
// const { protect } = require('../middleware/authMiddleware');

// var chat=data.chats;

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.send(chat);
  res.render('index');
});

router.post('/', asyncHandler(async (req,res, next) => {
  console.log(req.body)
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    var token = generateToken(user._id);
    console.log(token);
    res.cookie("access_token", token, { 
  // sameSite: 'None', 
    secure: true, 
    httpOnly: true 
  });
    
    res.redirect('/chats');
  }
  else {
    res.send("invalid credentials");
  }
})
)

// router.route('/').get(protect,allUsers);

module.exports = router;