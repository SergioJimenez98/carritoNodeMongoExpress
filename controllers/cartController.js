const fs = require("fs");
const crypto = require("crypto");
const User = require("../models/User");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const catchAsync = require("../utils/catchAsync");

//CREATE
exports.addCart = catchAsync(async (req, res) => {
  
    const { productId, quantity, name, price } = req.body;

    const userId = req.user._id;
    const status = "pending";
    console.log(userId);
    //const userId = User.findById
  
    try {
      let cart = await Cart.findOne({ userId, status });
  
      if (cart) {
        //cart exists for user
        let itemIndex = cart.products.findIndex(p => p.productId == productId);
  
        if (itemIndex > -1) {
          //product exists in the cart, update the quantity
          let productItem = cart.products[itemIndex];
          productItem.quantity = quantity;
          cart.products[itemIndex] = productItem;
        } else {
          //product does not exists in cart, add new item
          cart.products.push({ productId, quantity, name, price });
        }
        cart = await cart.save();
        return res.status(200).send(cart);
      } else {
        //no cart for user, create new cart
        const newCart = await Cart.create({
          userId,
          status,
          products: [{ productId, quantity, name, price }]
        });
  
        return res.status(200).send(newCart);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
});


//DELETE
exports.deleteProductCart = catchAsync(async (req,res) => {
    const userId = req.user._id;
    console.log(userId);
    
    let cart = await Cart.findOne({userId, status:"pending"});
  
    if (cart) {

        cart.products = cart.products.filter(p => p.productId != req.params.id);
        cart.save();
        //cart.products.deleteOne({productId: req.params.id})
        res.status(200).json({
            status: "success",
            message: "deleted product with ID "+req.params.id,            
            data:{
              cart,
            }
          });
    }   
    else{
      res.status(500).send("Products was paid");
    }   
});


//PAGAR
exports.payCart = catchAsync(async (req,res) => {
    const userId = req.user._id;

    console.log(userId);
    
    let cart = await Cart.findOne({userId, status:"pending"});
  
    if (cart && cart.products.length > 0) {

        cart.status = "paid";
        cart.save();
        //cart.products.deleteOne({productId: req.params.id})
        res.status(200).json({
            status: "success",
            message: "shopping cart paid",            
            data:{
              cart,
            }
          });
    }   
    else{
      res.status(500).send("Something went wrong");
    }   
});