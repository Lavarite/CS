import React, { useContext } from 'react'
import { AuthContext } from '../Auth/AuthContext'
import {RoleElementGuard} from "../Auth/RoleGuard";

export default function Dashboard() {
    const { user } = useContext(AuthContext)

    return (
        <div>
            <h1>Welcome, {user?.name}</h1>

            {/* Only admins see this button */}
            <RoleElementGuard allowedRoles={["admin"]}>
                <button>Admin Only Action</button>
            </RoleElementGuard>

            {/* Only students see this button */}
            <RoleElementGuard allowedRoles={["student"]}>
                <button>Student Only Action</button>
            </RoleElementGuard>
        </div>
    )
}
