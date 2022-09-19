const fs = require("fs");
const Product = require("../models/Product");
const catchAsync = require("../utils/catchAsync");

//READ ALL
exports.getAllProducts = catchAsync(async (req, res) => {
  const products = await Product.find();

  res.status(200).json({
    status: "success",
    timeOfRequest: req.requestTime,
    results: products.length,
    data: {
      products,
    },
  });
});

//CREATE
exports.addProduct = catchAsync(async (req, res) => {
  const newProduct = await Product.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      product: newProduct,
    },
  });
});

//READ ONE
exports.getProductById = catchAsync(async (req, res) => {
  const foundProduct = await Product.findById(req.params.id);
  if (foundProduct) {
    res.status(200).json({
      status: "success",
      data: {
        product: foundProduct,
      },
    });
  } else {
    res.status(404).json({
      status: "not found",
    });
  }
});

//UPDATE
exports.upDateProduct = catchAsync (async (req, res) => {

  foundProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {new:true});
  res.status(200).json({
    status: "success",
    message: "updated",
    data: {
        foundProduct,
        },
    });
  
});

//DELETE
exports.deleteProduct = catchAsync (async (req, res) => {
  //const products = JSON.parse(fs.readFileSync(`${__dirname}/../data/products.json`));
  
  dropProduct = await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "deleted product with ID "+req.params.id,
    results: dropProduct.length,
    data:{
      product: dropProduct
    }
  });
  
});
