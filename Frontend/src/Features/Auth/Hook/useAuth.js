import {setError, setLoading, setUser} from "../State/auth.slice"

import { register, login, getMe, logout } from "../auth.api"
import { useDispatch } from "react-redux"   


export const userAuth = () => {

    const dispatch = useDispatch()

    async function HandleRegister({email, contact, password, fullname, isSeller = false}) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))

            const data = await register({email, contact, password, fullname, isSeller})

            dispatch(setUser(data.user))

            return { success: true, data }
        } catch (err) {
            const message = err.response?.data?.message || "Registration failed"
            dispatch(setError(message))
            return { success: false, message }
        } finally {
            dispatch(setLoading(false))
        }
    }

    


    async function HandleLogin({email, password}) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))

            const data = await login({email, password})

            dispatch(setUser(data.user))

            return { success: true, data }
        } catch (err) {
            const message = err.response?.data?.message || "Login failed"
            dispatch(setError(message))
            return { success: false, message }
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function FetchCurrentUser() {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))

            const data = await getMe()
            dispatch(setUser(data.user))

            return { success: true, user: data.user }
        } catch (err) {
            // It is expected to fail if the user has no cookie (guest)
            dispatch(setUser(null))
            return { success: false }
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function HandleLogout() {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))

            await logout()
            dispatch(setUser(null))

            return { success: true }
        } catch (err) {
            const message = err.response?.data?.message || "Logout failed"
            dispatch(setError(message))
            return { success: false, message }
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {HandleRegister, HandleLogin, FetchCurrentUser, HandleLogout}

}
