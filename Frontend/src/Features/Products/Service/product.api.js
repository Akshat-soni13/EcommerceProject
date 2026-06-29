import axios from "axios"


const productApiInstace = axios.create({
    baseUrl:"/api/products",
    withCredentials:true
})

export const getAllProducts = async () => {

    const response = await productApiInstace.get("/")

    return response.data

}

export const createProduct = async(formData)=>{
    const response = await productApiInstace.post("/",formData)

    return response.data

}