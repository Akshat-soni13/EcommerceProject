import ProductModel from "../models/product.model.js";
import {uploadImageToImageKit} from "../service/storage,service.js";


export const createProduct =  async(req,res)=>{


    const {title,description,priceAmount,priceCurrency,category}= req.body;
    const seller = req.user
      


    const images = await Promise.all(
    req.files.map(async(file)=>{
        
        return await uploadImageToImageKit({buffer:file.buffer,filename:file.originalname})
    })
)
  console.log("4. Images uploaded:", images);

    const product = await ProductModel.create({
    title,
    description,
    price:{
        amount:priceAmount,
        currency:priceCurrency||"INR"
    },
    images,
    seller:seller._id,
    category
    })

     res.status(201).json({
        message:"Product created successfully",
        sucess:true,
        product

    })

}

export const getProductsBySeller = async(req,res)=>{

    const seller = req.user;

    const products = await ProductModel.find({seller:seller._id});

    res.status(200).json({
        message:"Products fetched successfully",
        success:true,
        products
    })
}

export const getAllProducts = async(req,res)=>{

    const products = await ProductModel.find({}).populate("seller","name email");

    res.status(200).json({
        message:"Products fetched successfully",
        success:true,
        products
    })


}