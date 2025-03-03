const bcrypt = require('bcryptjs');
import mongodb from "../../lib/mongodb";
import User from "../../models/User";


export default async function handler(req, res) {
    await mongodb();

    if (req.method === "GET") {
        try {
            const users = await User.find({});
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
}


