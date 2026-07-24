const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ============================
// Register User
// ============================
exports.register = async (req, res) => {

    const {
        name,
        email,
        password,
        phone,
        dob,
        gender,
        role,
        employee_id,
        department,
        qualification,
        year,
        division,
        access_code
    } = req.body;

    try {

        // Admin Access Code Check
        if (role === "admin") {

            if (access_code !== process.env.ADMIN_ACCESS_CODE) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid Admin Access Code"
                });
            }

        }

        // Check Existing Email
        db.query(
            "SELECT * FROM users WHERE email=?",
            [email],
            async (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                if (result.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Email already exists"
                    });
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                const sql = `
                INSERT INTO users
                (
                    name,
                    email,
                    password,
                    phone,
                    dob,
                    gender,
                    role,
                    employee_id,
                    department,
                    qualification,
                    year,
                    division
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                db.query(
                    sql,
                    [
                        name,
                        email,
                        hashedPassword,
                        phone,
                        dob,
                        gender,
                        role,
                        employee_id,
                        department,
                        qualification,
                        year,
                        division
                    ],
                    (err, result) => {

                        if (err) {
                            return res.status(500).json(err);
                        }

                        res.status(201).json({
                            success: true,
                            message: "Registration Successful",
                            id: result.insertId
                        });

                    }
                );

            }
        );

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ============================
// Login User
// ============================
exports.login = (req, res) => {

    const {
        email,
        password,
        access_code
    } = req.body;

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        async (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            const user = result[0];

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid Password"
                });
            }

            // Admin Access Code Validation
            if (user.role === "admin") {

                if (access_code !== process.env.ADMIN_ACCESS_CODE) {

                    return res.status(401).json({
                        success: false,
                        message: "Invalid Admin Access Code"
                    });

                }

            }

            const token = jwt.sign(
                {
                    id: user.id,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );

            res.status(200).json({
                success: true,
                message: "Login Successful",
                token,
                user
            });

        }
    );

};

// ============================
// Get Profile
// ============================
exports.getProfile = (req, res) => {

    const id = req.params.id;

    db.query(
        "SELECT * FROM users WHERE id=?",
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });

            }

            res.status(200).json(result[0]);

        }
    );

};

// ============================
// Update Profile
// ============================
exports.updateProfile = (req, res) => {

    const id = req.params.id;

    const {
        name,
        phone,
        department,
        qualification,
        year,
        division
    } = req.body;

    const sql = `
    UPDATE users
    SET
        name=?,
        phone=?,
        department=?,
        qualification=?,
        year=?,
        division=?
    WHERE id=?
    `;

    db.query(
        sql,
        [
            name,
            phone,
            department,
            qualification,
            year,
            division,
            id
        ],
        (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.status(200).json({
                success: true,
                message: "Profile Updated Successfully"
            });

        }
    );

};