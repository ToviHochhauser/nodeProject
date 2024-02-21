import { generateToken, userModel, validUser, validUserLogIn } from "../models/user.js";
import bcrypt from "bcrypt";


export const getAllUsers = async (req, res) => {
    try {
        let allUsers = await userModel.find({});
        return res.json(allUsers);
    }
    catch (err) {
        res.status(400).json(err)
    }

}

// הוספת משתמש
export const registerUser = async (req, res) => {
       const { userName, password, email } = req.body;

    // בדיקת תקינות
    const { error } = validUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
                let existingUser = await userModel.findOne({ email });
        if (existingUser) return res.status(400).send("User already exists");

        // לעשות סיסמא
        const hashedPassword = await bcrypt.hash(password, 15);

             let newUser = new userModel({
            userName,
            password: hashedPassword,
            email,
        });

        await newUser.save();
        let token = generateToken(newUser.userName,newUser._id,newUser.email,  newUser.role);
        res.status(201).json({ userName: newUser.userName, _id: newUser._id,email:newUser.email, role: newUser.role, token });
    } catch (err) {
        res.status(400).send(err);
    }
};


// Login a user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate user input
    const { error } = validUserLogIn(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) return res.status(400).send("email does not exists");

        // Check if the password is correct
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).send("uncorrect password");
       
        let token = generateToken(user.userName, user._id,user.email, user.role);
        res.status(201).json({ userName: user.userName, _id: user._id,email:user.email, role: user.role, token });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

