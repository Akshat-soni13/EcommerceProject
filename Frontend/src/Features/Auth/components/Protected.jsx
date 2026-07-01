import React from 'react'
import { useSelector } from 'react-redux'
import KrishnaLoader from '../Styles/Loader'
import { Navigate } from 'react-router-dom'

const Protected = ({children,role="buyer"}) => {
    const user = useSelector(state=>state.auth.user)
    const loading = useSelector(state=>state.auth.loading)
    const initialized = useSelector(state=>state.auth.initialized)

    // Wait until FetchCurrentUser has completed at least once
    if (!initialized || loading)
    {
        return <KrishnaLoader></KrishnaLoader>
    }
    if (!user)
    {
        return <Navigate to="/Login"></Navigate>
    }

    if(user.role!==role)
    {
        return <Navigate to="/"></Navigate>
    }

  return children
}

export default Protected