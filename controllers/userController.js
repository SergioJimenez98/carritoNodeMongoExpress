const fs = require("fs");
const crypto = require("crypto");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

//READ
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    timeOfRequest: req.requestTime,
    results: users.length,
    data: {
      users,
    },
  });
});

//CREATE
exports.addUser = catchAsync(async (req, res) => {
  req.body.password = crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("hex");

  let newUser = await User.create(req.body);
  newUser = newUser.toObject();
  delete newUser.password;

  res.status(200).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

//READ ONE
exports.getUserById = catchAsync(async (req, res) => {
  const foundUser = await User.findById(req.params.id);
  if (foundUser) {
    res.status(200).json({
      status: "success",
      data: {
        user: foundUser,
      },
    });
  } else {
    res.status(404).json({
      status: "not found",
    });
  }
});

//UPDATE
exports.upDateUser = catchAsync (async (req, res) => {

  if(req.body.password) {
    req.body.password=crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("hex");
  }

  let foundUser = await User.findByIdAndUpdate(req.params.id, req.body,{new:true});  

  if(foundUser) {
    
    res.status(200).json({
    status: "success",
    message: "updated",
    data: {
        user: foundUser,
        },
    });
  }

  else {
    //console.log(id);
    res.status(404).json({
        status: "not found",
      });
  }
  
});

//DELETE
exports.deleteUser = catchAsync (async (req, res) => {
  //const products = JSON.parse(fs.readFileSync(`${__dirname}/../data/products.json`));
  
  dropUser = await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "deleted product with ID "+req.params.id,
    results: dropUser.length,
    data:{
      user: dropUser
    }
  });
  
});