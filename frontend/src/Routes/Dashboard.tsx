import React, { useContext } from 'react'
import { AuthContext } from '../Auth/AuthContext'

export default function Dashboard() {
    const { user, setToken } = useContext(AuthContext)

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Current user: {user?.name ?? '<none>'}</p>
            <button onClick={() => setToken('')}>Log Out</button>
        </div>
    )
}
