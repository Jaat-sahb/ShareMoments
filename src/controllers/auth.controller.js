import userModel from "../modles/user.modle.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export async function registerController(req, res){
    const {username, password, email, bio, profileImage} = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    });

    if(isUserAlreadyExists){
        return res.status(409).json({
            message: `${isUserAlreadyExists.username === username ? "Username already exists" : "Email already exists"}`
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({ username, email, password: hashedPassword, bio });

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET, {expiresIn: "1d"});

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(201).json({
        message: "User created successfully",
        user: {username, email, bio}
    })
}

export async function loginController(req,res){
    const {username, email, password } = req.body;

    const user = await userModel.findOne({
        $or: [
            {username},
            {email}
        ]
    });

    if(!user){
        return res.status(400).json({
            msg: "Invalid credentials"
        })
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if(!isPasswordMatch){
        return res.status(400).json({
            msg: "Invalid credentials"
        })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        msg: "Logged In Successfully"
    })
}