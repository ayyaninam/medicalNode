const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { sendAccessCode } = require('../utils/messageHandler');


function checkIfUserRegistered(userRegistrationStatus) {
    return userRegistrationStatus !== "Not registered";
}

const home =  (req, res) => {
    try{

    if (req.cookies && req.cookies.verified) {
        res.send('verified.');
    } else {
        res.send('Not verified.');
    }
}catch(e){
    res.send('Not verified.');
}
};

const register =  (req, res) => {
    const user = {
        uid: uuidv4().replace(/-/g, ''),
        healthCardNumber: req.body.healthCardNumber,
        mobileNumber: req.body.mobileNumber,
        emailAddress: req.body.emailAddress,
        accessCode: [...Array(8)].map(() => Math.random().toString(36)[2].toUpperCase()).join(''),
        clinic: req.body.clinic,
    };
    sendAccessCode(user.mobileNumber, user.accessCode);

    db.run(
        `INSERT INTO profiles (uid, health_card_number, phone_number, email_address, access_code, clinic) VALUES (?, ?, ?, ?, ?, ?)`,
        [user.uid, user.healthCardNumber, user.mobileNumber, user.emailAddress, user.accessCode, user.clinic],
        function (err) {
            if (err) {
                return res.status(500).json({ message: 'Error saving user to database' });
            }
            res.json({
                message: "Got some data!",
                data: {
                    health_care_number: user.healthCardNumber,
                    uid: user.uid,
                    access_code: user.accessCode,
                    is_registered: checkIfUserRegistered(user.clinic),
                }
            });
        }
    );
};

const accesscodeverfication= (req, res) => {
    db.get(`SELECT * FROM profiles WHERE uid = ?`, [req.params.uid], (err, profile) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching user from database' });
        }
        if (profile && profile.access_code === req.body.accessCode) {
            res.status(200).json({
                message: "Correct Access Code!",
                data: {
                    is_registered: checkIfUserRegistered(profile.clinic),
                }
            });
        } else {
            res.status(401).json({ message: "Wrong Access Code!" });
        }
    });
};

const login =  (req, res) => {
    
    db.get(`SELECT * FROM profiles WHERE health_card_number = ?`, [req.body.healthCardNumber], (err, profile) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching user from database' });
        }
        if (profile && profile.access_code === req.body.accessCode) {
            res.status(200).json({
                message: "Correct Credentials!",
                data: {
                    is_registered: checkIfUserRegistered(profile.clinic),
                }
            });
        } else {
            res.status(401).json({ message: "Wrong Credentials" });
        }
    });
};

const forgetpassword =  (req, res) => {
    db.get(`SELECT * FROM profiles WHERE health_card_number = ?`, [req.body.healthCardNumber], (err, profile) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching user from database' });
        }
        if (profile && profile.phone_number === req.body.mobileNumber) {
            profile.access_code = [...Array(8)].map(() => Math.random().toString(36)[2].toUpperCase()).join('');

            sendAccessCode(profile.phone_number, profile.access_code);


            db.run(
                `UPDATE profiles SET access_code = ? WHERE uid = ?`,
                [profile.access_code, profile.uid],
                function (err) {
                    if (err) {
                        return res.status(500).json({ message: 'Error updating user access code' });
                    }
                    res.status(200).json({ message: "Correct Credentials!" });
                }
            );
        } else {
            res.status(401).json({ message: "Wrong Credentials" });
        }
    });
};


module.exports = {home, register, accesscodeverfication, login, forgetpassword}