const { UserToken } = require('../models/user')
const jwt = require('jsonwebtoken');
require('dotenv').config();
let jwtSecretKey = process.env.JWT_AUTH_KEY;
let jwtRefreshKey = process.env.JWT_AUTH_REFRESH_KEY;
const createToken = async (req, res, data) => {
    try {
        let message = {
            isVerified: false,
            token: '',
            refreshToken: '',
        };

        // Check if a token already exists for the given user
        const existingUserToken = await UserToken.findOne({ userId: data.userId });

        if (existingUserToken) {
            // If a token exists, update it
            const expiresInOneDay = 3600 * 24;
            const token = jwt.sign({ data: data }, jwtSecretKey, {
                expiresIn: expiresInOneDay, // 24 hours in seconds
            });

            // Update the existing token with the new access token
            existingUserToken.token = token;
            await existingUserToken.save();

            // Generate a new refresh token
            const refreshToken = jwt.sign(
                { data: { ...data, id: existingUserToken._id } },
                jwtRefreshKey,
                {
                    expiresIn: expiresInOneDay, // 24 hours in seconds
                }
            );

            // Update the existing token with the new refresh token
            existingUserToken.refreshToken = refreshToken;
            await existingUserToken.save();

            // Set the response message to indicate successful verification and provide tokens
            message = {
                isVerified: true,
                token: token,
                refreshToken: refreshToken,
            };
        } else {
            // If no token exists, create a new one
            const expiresInOneDay = 3600 * 24;
            const token = jwt.sign({ data: data }, jwtSecretKey, {
                expiresIn: expiresInOneDay,
            });

            // Insert the access token into the database
            const userToken = new UserToken({
                userId: data.userId,
                token: token,
                refreshToken: '',
                active: 1,
                expiresIn: expiresInOneDay,
            });
            const savedUserToken = await userToken.save();

            // Generate a refresh token with the inserted ID as part of the data
            const refreshToken = jwt.sign(
                { data: { ...data, id: savedUserToken._id } },
                jwtRefreshKey,
                {
                    expiresIn: expiresInOneDay,
                }
            );

            // Update the database record with the refresh token
            savedUserToken.refreshToken = refreshToken;
            await savedUserToken.save();

            // Set the response message to indicate successful verification and provide tokens
            message = {
                isVerified: true,
                token: token,
                refreshToken: refreshToken,
            };
        }

        return message;
    } catch (error) {
        console.error(error);
        return message; // You should handle the error more appropriately
    }
};



const verifyToken = async (req, res, next) => {
    const bearerHeader = await req.headers["authorization"];
    if (!bearerHeader) {
        return { message: "Token is missing", isVerified: false };
    }
    let token = bearerHeader.split(" ")[1];
    if (typeof bearerHeader !== "undefined" && token) {
        let matchToken = await UserToken.findOne({ token: token });
        try {
            if (matchToken && matchToken.active === 1) {
                const decode = await jwt.verify(token, jwtSecretKey);
                return {
                    message: "Success",
                    isVerified: true,
                    data: decode,
                    token: token,
                };
            } else {
                return {
                    message: "Token Expired !!",
                    isVerified: false,
                    data: "",
                };
            }
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return {
                    message: "Token Expired",
                    isVerified: false,
                    data: "",
                };
            } else {
                console.log(error);
                return {
                    message: "UnAuthorized User !!",
                    isVerified: false,
                    data: "",
                };
            }
        }
    } else {
        res.status(400).send({ status: false, message: "Invalid token" });
    }
};


module.exports = { createToken, verifyToken }