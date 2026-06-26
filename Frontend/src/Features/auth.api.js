// here write Api calling Logic

import axios from "axios"

const authAPiInstance= axios.create({
    baseURL:"/api/auth",
    withCredentials:true
})

export async function register({email,contact,password,fullname,isSeller})
{

    const response = await authAPiInstance.post("/register",{
        email,
        contact,
        password,
        fullname,
        isSeller
    })

    return response.data

}

export async function login({email,password})
{
    const response = await authAPiInstance.post("/login",{
        email,
        password
    })
    return response.data
}

export async function getMe()
{
    const response = await authAPiInstance.get("/me");
    return response.data;
}

export async function logout()
{
    const response = await authAPiInstance.post("/logout");
    return response.data;
}

