const UserModel = require('../models/user.model');
const UsersRoutes = require('express').Router();

UsersRoutes.post('/register', async (req, res) => {
    try {
        let { email, password, visaDetails, cardNumber, idCard, cardHolderName, expiryDate, cvv  } = req.body;
        let newUser = await UserModel.Register(email, password, visaDetails, cardNumber, idCard, cardHolderName, expiryDate, cvv );
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error });
    }
});

UsersRoutes.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        let result = await UserModel.Login(email, password);
        if (!result) // if(user == null || user == undefined)
            res.status(401).json({ msg: "Incorrect login details" });
        else
            res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error });
    }
});

module.exports = UsersRoutes;