import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const ResetPassword = () => {
    const { token } = useParams()
    const navigate = useNavigate()
    const [newPassword, setNewPassword] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, newPassword })
        })

        const data = await response.json()
        setMessage(data.message)

        if (response.ok) {
            setTimeout(() => navigate("/signin"), 2000)
        }
    }

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="password" 
                    placeholder="Enter new password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}

export default ResetPassword
