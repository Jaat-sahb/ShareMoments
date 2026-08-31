import jwt from "jsonwebtoken"

export function authenticateUserMidelleware(req, res, next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // extrating user id from decoded token and adding it to req object
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
}