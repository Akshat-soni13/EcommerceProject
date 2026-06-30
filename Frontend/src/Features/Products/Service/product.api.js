import axios from "axios"


const productApiInstace = axios.create({
    baseURL:"/api/products",
    withCredentials:true
})

export const getAllProducts = async () => {

    const response = await productApiInstace.get("/seller")

    return response.data

}

export const createProduct = async(formData)=>{
    const response = await productApiInstace.post("/",formData)

    return response.data

}