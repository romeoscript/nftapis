// import pkg from 'jsonwebtoken';
// const { Jwt } = pkg;
import jwt from 'jsonwebtoken';


export const authenticateUser = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header is missing.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authentication token is missing.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        console.error("Token verification error:", error.message);
        return res.status(401).json({ error: error.message });
    }
};
