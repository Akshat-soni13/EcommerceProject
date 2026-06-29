import express from "express";
import  {ProductMiddleware}  from "../middlewares/product.middleware.js";
const router = express.Router();
import {createProduct,getProductsBySeller} from "../controllers/product.controller.js";
import multer from "multer";
import { validationResult } from "express-validator";
import { productValidationRules } from "../validator/product.validator.js";
import {getAllProducts} from "../controllers/product.controller.js"


const upload = multer({
    storage : multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
})

router.post("/",ProductMiddleware, upload.array("images",5), productValidationRules, createProduct);


router.get("/seller",ProductMiddleware,getProductsBySeller)


router.get("/",getAllProducts)



export default router;