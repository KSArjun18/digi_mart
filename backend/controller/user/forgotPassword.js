const User = require('../../models/userModel')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        // Generate a password reset token valid for 15 minutes
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' })

        // Configure the transporter for nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS  // Your email password
            }
        })

        // Reset password link
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset Request",
            html: `<p>You have requested a password reset. Click the link below to reset your password:</p>
                   <a href="${resetLink}">${resetLink}</a>
                   <p>This link is valid for 15 minutes.</p>`
        }

        // Send email
        await transporter.sendMail(mailOptions)

        res.status(200).json({ message: "Password reset link sent to your email" })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

module.exports = forgotPassword
