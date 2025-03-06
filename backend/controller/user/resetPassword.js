const User = require('../../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body
        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required" })
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.id)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword
        await user.save()

        res.status(200).json({ message: "Password has been reset successfully" })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Invalid or expired token" })
    }
}

module.exports = resetPassword
