const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: "Token required" });

    const token = authHeader.split(' ')[1]; // Extract token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });

        req.user = decoded; // Attach decoded user info to request
        next();
    });
};

const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    };
};

module.exports = {
    verifyToken,
    authorizeRole
};