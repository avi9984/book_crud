const { User, UserToken } = require('../models/user');
const { validEmail, validPwd } = require('../utils/validator');
const bcrypt = require('bcrypt');
const { createToken, verifyToken } = require('../services/tokenService');

const createUser = async (req, res) => {
    try {
        const body = req.body;
        const { name, email, password, cnfpassword } = body;
        if (!(name && email && password && cnfpassword)) {
            return res.status(400).json({ status: false, message: "These are fields are required" });
        }
        if (!validEmail(email)) {
            return res.status(400).json({ status: false, message: "Enter a valid email" });
        }
        let checkEmail = await User.findOne({ email: email });
        if (checkEmail) {
            return res.status(400).json({ status: false, message: "User already exists, login now" });
        }
        if (!validPwd(password && cnfpassword)) {
            return res.status(400).json({
                status: false,
                message:
                    "Password should be 8 characters long and must contain one of 0-9,A-Z,a-z and special characters",
            });
        }
        if (password !== cnfpassword) {
            return res.status(400).json({ status: false, message: "Passwords do not match" });
        } else {
            body.password = await bcrypt.hash(body.password, 12);
        }
        let userCount = await User.countDocuments();
        let id = parseInt(userCount) + 1;
        const obj = {
            userId: id,
            name: name,
            email: email.toLowerCase(),
            password: body.password
        }
        const userData = await User.create(obj);
        return res.status(201).json({ status: true, message: "User created successfully", data: userData });
    } catch (error) {
        console.log(error);
    }
}

const userLogin = async (req, res) => {
    try {
        const body = req.body;
        const { email, password } = body;
        if (!(email && password)) {
            return res.status(400).json({ status: false, message: "These are required fields" });
        }
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ status: false, message: 'Invalid credentials.' });
        }
        const userObj = {
            userId: user.userId,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
        const verification = await createToken(req, res, userObj);
        const userData = await User.findOne({ email: email.toLowerCase() }).select({ _id: 0, __v: 0, password: 0, updatedAt: 0, createdAt: 0 });
        if (verification.isVerified) {
            res.status(200).json({
                status: true,
                message: 'Login successful',
                data: userData,
                token: verification.token,
                refreshToken: verification.refreshToken,
            });
        } else {
            res.status(401).json({ status: false, message: 'UnAuthorized user!' });
        }
    } catch (error) {
        console.log(error);
    }
}

const logOut = async (req, res) => {
    const verification = await verifyToken(req, res);
    if (verification.isVerified) {
        await UserToken.findOneAndUpdate({ token: verification.token }, { active: 0, new: true })
        return res.status(200).json({ status: true, message: 'Succesfully logged out!' });
    } else {
        return res.status(401).json({ status: false, message: verification.message });
    }
};


module.exports = { createUser, userLogin, logOut }