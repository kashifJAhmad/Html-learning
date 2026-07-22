const db = require("../config/db");
const bcrypt = require("bcrypt");

// Register
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

        if (role === "admin") {
            if (access_code !== process.env.ADMIN_ACCESS_CODE) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid Admin Access Code"
                });
            }
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

        db.query(sql, [
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
        ], (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                success: true,
                message: "Registration Successful",
                id: result.insertId
            });

        });

    } catch (error) {

        res.status(500).json(error);

    }

};

// Login
exports.login = (req, res) => {

    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        async (err, result) => {

            if (err)
                return res.status(500).json(err);

            if (result.length === 0)
                return res.json({
                    success: false,
                    message: "User Not Found"
                });

            const user = result[0];

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.json({
                    success: false,
                    message: "Wrong Password"
                });
            }

            res.json({
                success: true,
                user: {
                    id: user.id,
                    name: user.name,
                    role: user.role,
                    email: user.email
                }
            });

        }
    );

};

// Profile
exports.getProfile = (req, res) => {

    const id = req.params.id;

    db.query(
        "SELECT * FROM users WHERE id=?",
        [id],
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            res.json(result[0]);

        }
    );

};

// Update Profile
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

    db.query(sql,
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

            if (err)
                return res.status(500).json(err);

            res.json({
                success: true,
                message: "Profile Updated Successfully"
            });

        });

};