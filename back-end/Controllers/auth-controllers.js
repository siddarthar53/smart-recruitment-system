const User = require("../Models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const registerUser = async (req, res) => {
    try {
        const { name, phoneno, email, password,confirm_password,role} = req.body

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        if(confirm_password!==password){
            return res.status(400).json({ message: "Password and confirm password do not match" });
        }

        // Create new user
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, phoneno, email, password:hashPassword,role: role || "user"});
        return res.status(201).json({ user });
    } catch (error) {
        console.error("Error in user registration:", error);
        return res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        // Check if password is correct
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Create token
        const token = jwt.sign({ userID: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        return res.status(200).json({ user ,token});
    } catch (error) {
        console.error("Error in user login:", error);
        return res.status(500).json({ message: error.message });
    }
};

const logoutUser = async (req, res) => {
    try {
        return res.status(200).json({ message: "User logged out" });
    } catch (error) {
        console.error("Error in user logout:", error);
        return res.status(500).json({ message: error.message });
    }
};


module.exports={
    registerUser,
    loginUser,
    logoutUser
}