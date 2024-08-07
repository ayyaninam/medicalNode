const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');

router.post('/home', authController.home);
router.post('/patient-register', authController.register);
router.post('/patient-login', authController.login);
router.post('/access_code_verification_patient/:uid', authController.accesscodeverfication);
router.post('/forgot_password_patient', authController.forgetpassword);

module.exports = router;