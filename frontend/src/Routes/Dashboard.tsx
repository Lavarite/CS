import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../Auth/AuthContext'

export default function Dashboard() {
    const { token, setToken } = useContext(AuthContext)

    useEffect(() => {
        console.log('Token is now >', token)
    }, [token])

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Current token: {token || '<none>'}</p>
            <button onClick={() => setToken('abc123')}>
                Set token to "abc123"
            </button>
        </div>
    )
}
