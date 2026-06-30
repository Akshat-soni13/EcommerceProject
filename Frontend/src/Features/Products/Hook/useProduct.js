import {createProduct,getAllProducts} from "../Service/product.api"

import { setSellerProducts } from "../State/product.slice"

import { useDispatch } from "react-redux"

export const useProduct =()=>{

    const dispatch= useDispatch()


    async function HandleCreateProduct(formData){
   
        const data = await createProduct(formData)
        
        return data.product
   
    }

     async function handleSellerProduct()
{
    const data = await getAllProducts()
    dispatch(setSellerProducts(data.products    ))
    return data.products
}

return{
    handleSellerProduct , HandleCreateProduct
}


}