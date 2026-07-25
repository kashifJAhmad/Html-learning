const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* ==========================================================
   REGISTER USER
========================================================== */

exports.register = async (req, res) => {

    try {

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

        // ==========================
        // Required Validation
        // ==========================

        if (
            !name ||
            !email ||
            !password ||
            !phone ||
            !role
        ) {

            return res.status(400).json({

                success: false,
                message: "Please fill all required fields."

            });

        }

        // ==========================
        // Email Validation
        // ==========================

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {

            return res.status(400).json({

                success: false,
                message: "Invalid Email"

            });

        }

        // ==========================
        // Password Validation
        // ==========================

        if (password.length < 6) {

            return res.status(400).json({

                success: false,
                message: "Password must contain at least 6 characters."

            });

        }

        // ==========================
        // Phone Validation
        // ==========================

        if (phone.length !== 10) {

            return res.status(400).json({

                success: false,
                message: "Invalid Mobile Number"

            });

        }

        // ==========================
        // Admin Access Code
        // ==========================

        if (role === "admin") {

            if (
                access_code !==
                process.env.ADMIN_ACCESS_CODE
            ) {

                return res.status(401).json({

                    success: false,
                    message: "Invalid Admin Access Code"

                });

            }

        }

        // ==========================
        // Check Existing Email
        // ==========================

        db.query(

            "SELECT id FROM users WHERE email=?",

            [email],

            async (err, result) => {

                if (err) {

                    return res.status(500).json({

                        success: false,
                        message: err.message

                    });

                }

                if (result.length > 0) {

                    return res.status(409).json({

                        success: false,
                        message: "Email already exists."

                    });

                }

                // ==========================
                // Encrypt Password
                // ==========================

                const hashedPassword =
                    await bcrypt.hash(password, 10);

                // ==========================
                // Insert User
                // ==========================

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

                VALUES
                (
                    ?,?,?,?,?,?,?,?,?,?,?,?
                )

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

                    (err, insertResult) => {

                        if (err) {

                            return res.status(500).json({

                                success: false,
                                message: err.message

                            });

                        }

                        return res.status(201).json({

                            success: true,

                            message:
                                "Registration Successful",

                            userId:
                                insertResult.insertId

                        });

                    }

                );

            }

        );

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
/* ==========================================================
   LOGIN USER (Part 1A.2.1)
========================================================== */

exports.login = async (req, res) => {

    try {

        const {

            email,
            password,
            access_code

        } = req.body;

        // ==========================
        // Validation
        // ==========================

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message: "Email and Password are required."

            });

        }

        // ==========================
        // Email Format Validation
        // ==========================

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {

            return res.status(400).json({

                success: false,

                message: "Invalid Email Address."

            });

        }

        // ==========================
        // Find User
        // ==========================

        const sql = `
            SELECT *
            FROM users
            WHERE email = ?
            LIMIT 1
        `;

        db.query(

            sql,

            [email],

            async (err, result) => {

                if (err) {

                    return res.status(500).json({

                        success: false,

                        message: err.message

                    });

                }

                // ==========================
                // User Not Found
                // ==========================

                if (result.length === 0) {

                    return res.status(404).json({

                        success: false,

                        message: "User not found."

                    });

                }

                const user = result[0];

                // ==========================
                // Password Verification
                // ==========================

                const isMatch =
                    await bcrypt.compare(
                        password,
                        user.password
                    );

                if (!isMatch) {

                    return res.status(401).json({

                        success: false,

                        message: "Incorrect password."

                    });

                }

                // ==========================
                // Admin Access Code Check
                // ==========================

                if (user.role === "admin") {

                    if (
                        access_code !==
                        process.env.ADMIN_ACCESS_CODE
                    ) {

                        return res.status(401).json({

                            success: false,

                            message:
                                "Invalid Admin Access Code."

                        });

                    }

                }

                // Continue in Part 1A.2.2
                // ==========================
                // Generate JWT Token
                // ==========================

                const token = jwt.sign(

                    {

                        id: user.id,

                        role: user.role,

                        email: user.email

                    },

                    process.env.JWT_SECRET,

                    {

                        expiresIn: "1d"

                    }

                );

                // ==========================
                // Remove Password
                // ==========================

                const {

                    password: hashedPassword,

                    ...userData

                } = user;

                // ==========================
                // Login Success
                // ==========================

                return res.status(200).json({

                    success: true,

                    message: "Login Successful",

                    token,

                    user: userData

                });

            }

        );

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
/* ==========================================================
   GET PROFILE (Part 1B.1.1)
========================================================== */

exports.getProfile = async (req, res) => {

    try {

        const id = req.params.id;

        // ==========================
        // Validate ID
        // ==========================

        if (!id) {

            return res.status(400).json({

                success: false,

                message: "User ID is required."

            });

        }

        // ==========================
        // Query
        // ==========================

        const sql = `

            SELECT

                id,
                name,
                email,
                phone,
                dob,
                gender,
                role,
                employee_id,
                department,
                qualification,
                year,
                division,
                created_at

            FROM users

            WHERE id = ?

            LIMIT 1

        `;

        db.query(

            sql,

            [id],

            (err, result) => {

                if (err) {

                    return res.status(500).json({

                        success: false,

                        message: err.message

                    });

                }

                // ==========================
                // User Not Found
                // ==========================

                if (result.length === 0) {

                    return res.status(404).json({

                        success: false,

                        message: "User not found."

                    });

                }

                // ==========================
                // Success
                // ==========================

                return res.status(200).json({

                    success: true,

                    message: "Profile fetched successfully.",

                    user: result[0]

                });

            }

        );

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
/* ==========================================================
   UPDATE PROFILE (Part 1B.1.2)
========================================================== */

exports.updateProfile = async (req, res) => {

    try {

        const id = req.params.id;

        const {

            name,
            phone,
            dob,
            gender,
            department,
            qualification,
            year,
            division

        } = req.body;

        // ==========================
        // Validate User ID
        // ==========================

        if (!id) {

            return res.status(400).json({

                success: false,

                message: "User ID is required."

            });

        }

        // ==========================
        // Required Fields
        // ==========================

        if (

            !name ||
            !phone

        ) {

            return res.status(400).json({

                success: false,

                message: "Name and Phone are required."

            });

        }

        // ==========================
        // Phone Validation
        // ==========================

        const phoneRegex = /^[0-9]{10}$/;

        if (!phoneRegex.test(phone)) {

            return res.status(400).json({

                success: false,

                message: "Invalid phone number."

            });

        }

        // ==========================
        // Check User Exists
        // ==========================

        db.query(

            "SELECT id FROM users WHERE id=?",

            [id],

            (err, result) => {

                if (err) {

                    return res.status(500).json({

                        success: false,

                        message: err.message

                    });

                }

                if (result.length === 0) {

                    return res.status(404).json({

                        success: false,

                        message: "User not found."

                    });

                }

                // ==========================
                // Update Query
                // ==========================

                const sql = `

                    UPDATE users

                    SET

                        name=?,
                        phone=?,
                        dob=?,
                        gender=?,
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
                        dob,
                        gender,
                        department,
                        qualification,
                        year,
                        division,
                        id

                    ],

                    (err) => {

                        if (err) {

                            return res.status(500).json({

                                success: false,

                                message: err.message

                            });

                        }

                        // ==========================
                        // Return Updated Profile
                        // ==========================

                        db.query(

                            `

                            SELECT

                                id,
                                name,
                                email,
                                phone,
                                dob,
                                gender,
                                role,
                                employee_id,
                                department,
                                qualification,
                                year,
                                division

                            FROM users

                            WHERE id=?

                            `,

                            [id],

                            (err, updatedUser) => {

                                if (err) {

                                    return res.status(500).json({

                                        success: false,

                                        message: err.message

                                    });

                                }

                                return res.status(200).json({

                                    success: true,

                                    message: "Profile updated successfully.",

                                    user: updatedUser[0]

                                });

                            }

                        );

                    }

                );

            }

        );

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
/* ==========================================================
   CHANGE PASSWORD (Part 1B.2.1)
========================================================== */

exports.changePassword = async (req, res) => {

    try {

        const id = req.params.id;

        const {

            currentPassword,
            newPassword,
            confirmPassword

        } = req.body;

        // ==========================
        // Validation
        // ==========================

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {

            return res.status(400).json({

                success: false,

                message: "All password fields are required."

            });

        }

        if (newPassword.length < 6) {

            return res.status(400).json({

                success: false,

                message: "New password must be at least 6 characters."

            });

        }

        if (newPassword !== confirmPassword) {

            return res.status(400).json({

                success: false,

                message: "Passwords do not match."

            });

        }

        db.query(

            "SELECT password FROM users WHERE id=?",

            [id],

            async (err, result) => {

                if (err) {

                    return res.status(500).json({

                        success: false,

                        message: err.message

                    });

                }

                if (result.length === 0) {

                    return res.status(404).json({

                        success: false,

                        message: "User not found."

                    });

                }

                const isMatch =
                    await bcrypt.compare(

                        currentPassword,

                        result[0].password

                    );

                if (!isMatch) {

                    return res.status(401).json({

                        success: false,

                        message: "Current password is incorrect."

                    });

                }

                const hashedPassword =
                    await bcrypt.hash(

                        newPassword,

                        10

                    );

                db.query(

                    "UPDATE users SET password=? WHERE id=?",

                    [

                        hashedPassword,

                        id

                    ],

                    (err) => {

                        if (err) {

                            return res.status(500).json({

                                success: false,

                                message: err.message

                            });

                        }

                        return res.status(200).json({

                            success: true,

                            message: "Password changed successfully."

                        });

                    }

                );

            }

        );

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
/* ==========================================================
   GET DASHBOARD (Part 1B.2.2)
========================================================== */

exports.getDashboard = async (req, res) => {

    try {

        const id = req.params.id;

        // ==========================
        // Validate User ID
        // ==========================

        if (!id) {

            return res.status(400).json({

                success: false,

                message: "User ID is required."

            });

        }

        // ==========================
        // Get Student Details
        // ==========================

        const sql = `

    SELECT

        id,
        name,
        email,
        phone,
        dob,
        gender,
        role,
        employee_id,
        department,
        qualification,
        year,
        division,
        profile_image,
        created_at

    FROM users

    WHERE id = ?

    LIMIT 1

`;

        db.query(
            sql,
            [id],
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                if (result.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "Student not found."
                    });
                }

                const student = result[0];

                // Fetch dashboard statistics here...

            }
        );

        // ======================================
        // Dashboard Summary
        // (Temporary values until modules exist)
        // ======================================

        const dashboard = {

            student,

            statistics: {

                attendance,

                cgpa,

                pendingAssignments,

                notices,

                issuedBooks,

                pendingFees

            },

            quickLinks: [

                {
                    title: "Profile",
                    url: "/student_profile.html"
                },

                {
                    title: "Attendance",
                    url: "/attendance.html"
                },

                {
                    title: "Assignments",
                    url: "/assignments.html"
                },

                {
                    title: "Timetable",
                    url: "/timetable.html"
                },

                {
                    title: "Results",
                    url: "/results.html"
                },

                {
                    title: "Fees",
                    url: "/fees.html"
                },

                {
                    title: "Library",
                    url: "/library.html"
                }

            ]

        };
        // ============================
        // Return Response
        // ============================

        return res.status(200).json({

            success: true,

            message: "Dashboard Loaded Successfully.",

            data: {

                student,

                statistics: {

                    attendance,

                    cgpa,

                    pendingAssignments,

                    notices,

                    issuedBooks,

                    pendingFees

                },

                timetable,

                noticesList,

                assignments

            }

        }); s
    }
    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
/* ==========================================================
   GET ATTENDANCE
========================================================== */

exports.getAttendance = (req, res) => {

    try {

        const { id } = req.params;

        const sql = `
            SELECT *
            FROM attendance
            WHERE student_id = ?
            ORDER BY subject ASC
        `;

        db.query(sql, [id], (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            return res.status(200).json({

                success: true,
                count: result.length,
                data: result

            });

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


/* ==========================================================
   ADD ATTENDANCE
========================================================== */

exports.addAttendance = (req, res) => {

    try {

        const {

            student_id,
            subject,
            total_classes,
            attended_classes,
            attendance_percentage

        } = req.body;

        const sql = `
        INSERT INTO attendance
        (
            student_id,
            subject,
            total_classes,
            attended_classes,
            attendance_percentage
        )
        VALUES (?, ?, ?, ?, ?)
        `;

        db.query(

            sql,

            [

                student_id,
                subject,
                total_classes,
                attended_classes,
                attendance_percentage

            ],

            (err, result) => {

                if (err) {

                    return res.status(500).json({

                        success: false,
                        message: err.message

                    });

                }

                res.status(201).json({

                    success: true,
                    message: "Attendance Added Successfully"

                });

            }

        );

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


/* ==========================================================
   UPDATE ATTENDANCE
========================================================== */

exports.updateAttendance = (req, res) => {

    try {

        const { id } = req.params;

        const {

            subject,
            total_classes,
            attended_classes,
            attendance_percentage

        } = req.body;

        const sql = `

        UPDATE attendance

        SET

        subject=?,
        total_classes=?,
        attended_classes=?,
        attendance_percentage=?

        WHERE attendance_id=?

        `;

        db.query(

            sql,

            [

                subject,
                total_classes,
                attended_classes,
                attendance_percentage,
                id

            ],

            (err) => {

                if (err) {

                    return res.status(500).json({

                        success: false,
                        message: err.message

                    });

                }

                res.json({

                    success: true,
                    message: "Attendance Updated"

                });

            }

        );

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


/* ==========================================================
   DELETE ATTENDANCE
========================================================== */

exports.deleteAttendance = (req, res) => {

    try {

        const { id } = req.params;

        db.query(

            "DELETE FROM attendance WHERE attendance_id=?",

            [id],

            (err) => {

                if (err) {

                    return res.status(500).json({

                        success: false,
                        message: err.message

                    });

                }

                res.json({

                    success: true,
                    message: "Attendance Deleted"

                });

            }

        );

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

/* ==========================================================
   GET TIMETABLE
========================================================== */

exports.getTimetable = (req, res) => {

    try {

        const { id } = req.params;

        const sql = `

        SELECT *

        FROM timetable

        WHERE student_id=?

        ORDER BY FIELD(day,

        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday')

        `;

        db.query(sql, [id], (err, result) => {

            if (err) {

                return res.status(500).json({

                    success: false,
                    message: err.message

                });

            }

            res.json({

                success: true,
                count: result.length,
                data: result

            });

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


/* ==========================================================
   ADD TIMETABLE
========================================================== */

exports.addTimetable = (req, res) => {

    try {

        const {

            student_id,
            day,
            subject,
            faculty,
            start_time,
            end_time,
            room

        } = req.body;

        const sql = `

        INSERT INTO timetable(

        student_id,
        day,
        subject,
        faculty,
        start_time,
        end_time,
        room

        )

        VALUES(?,?,?,?,?,?,?)

        `;

        db.query(

            sql,

            [

                student_id,
                day,
                subject,
                faculty,
                start_time,
                end_time,
                room

            ],

            (err) => {

                if (err) {

                    return res.status(500).json({

                        success: false,
                        message: err.message

                    });

                }

                res.json({

                    success: true,
                    message: "Timetable Added"

                });

            }

        );

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


/* ==========================================================
   UPDATE TIMETABLE
========================================================== */

exports.updateTimetable = (req, res) => {

    try {

        const { id } = req.params;

        const {

            day,
            subject,
            faculty,
            start_time,
            end_time,
            room

        } = req.body;

        const sql = `

        UPDATE timetable

        SET

        day=?,
        subject=?,
        faculty=?,
        start_time=?,
        end_time=?,
        room=?

        WHERE timetable_id=?

        `;

        db.query(

            sql,

            [

                day,
                subject,
                faculty,
                start_time,
                end_time,
                room,
                id

            ],

            (err) => {

                if (err) {

                    return res.status(500).json({

                        success: false,
                        message: err.message

                    });

                }

                res.json({

                    success: true,
                    message: "Timetable Updated"

                });

            }

        );

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


/* ==========================================================
   DELETE TIMETABLE
========================================================== */

exports.deleteTimetable = (req, res) => {

    try {

        const { id } = req.params;

        db.query(

            "DELETE FROM timetable WHERE timetable_id=?",

            [id],

            (err) => {

                if (err) {

                    return res.status(500).json({

                        success: false,
                        message: err.message

                    });

                }

                res.json({

                    success: true,
                    message: "Timetable Deleted"

                });

            }

        );

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

/* ==========================================================
   GET ASSIGNMENTS
========================================================== */

exports.getAssignments = (req, res) => {

    try {

        const { id } = req.params;

        const sql = `
            SELECT *
            FROM assignments
            WHERE student_id = ?
            ORDER BY due_date ASC
        `;

        db.query(sql, [id], (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                count: result.length,
                data: result
            });

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


/* ==========================================================
   ADD ASSIGNMENT
========================================================== */

exports.addAssignment = (req, res) => {

    try {

        const {
            student_id,
            subject,
            title,
            description,
            due_date,
            status
        } = req.body;

        const sql = `
            INSERT INTO assignments
            (
                student_id,
                subject,
                title,
                description,
                due_date,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                student_id,
                subject,
                title,
                description,
                due_date,
                status
            ],
            (err) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                res.status(201).json({
                    success: true,
                    message: "Assignment Added Successfully"
                });

            }
        );

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


/* ==========================================================
   UPDATE ASSIGNMENT
========================================================== */

exports.updateAssignment = (req, res) => {

    try {

        const { id } = req.params;

        const {
            subject,
            title,
            description,
            due_date,
            status
        } = req.body;

        const sql = `
            UPDATE assignments
            SET
                subject=?,
                title=?,
                description=?,
                due_date=?,
                status=?
            WHERE assignment_id=?
        `;

        db.query(
            sql,
            [
                subject,
                title,
                description,
                due_date,
                status,
                id
            ],
            (err) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                res.json({
                    success: true,
                    message: "Assignment Updated"
                });

            }
        );

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


/* ==========================================================
   DELETE ASSIGNMENT
========================================================== */

exports.deleteAssignment = (req, res) => {

    try {

        const { id } = req.params;

        db.query(
            "DELETE FROM assignments WHERE assignment_id=?",
            [id],
            (err) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                res.json({
                    success: true,
                    message: "Assignment Deleted"
                });

            }
        );

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
/* ==========================================================
   GET NOTICES
========================================================== */

exports.getNotices = (req, res) => {

    try {

        const sql = `
            SELECT *
            FROM notices
            ORDER BY created_at DESC
        `;

        db.query(sql, (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                count: result.length,
                data: result
            });

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


/* ==========================================================
   ADD NOTICE
========================================================== */

exports.addNotice = (req, res) => {

    try {

        const {
            title,
            description,
            audience
        } = req.body;

        const sql = `
            INSERT INTO notices
            (
                title,
                description,
                audience
            )
            VALUES (?, ?, ?)
        `;

        db.query(
            sql,
            [
                title,
                description,
                audience
            ],
            (err) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                res.status(201).json({
                    success: true,
                    message: "Notice Added Successfully"
                });

            }
        );

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


/* ==========================================================
   UPDATE NOTICE
========================================================== */

exports.updateNotice = (req, res) => {

    try {

        const { id } = req.params;

        const {
            title,
            description,
            audience
        } = req.body;

        const sql = `
            UPDATE notices
            SET
                title=?,
                description=?,
                audience=?
            WHERE notice_id=?
        `;

        db.query(
            sql,
            [
                title,
                description,
                audience,
                id
            ],
            (err) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                res.json({
                    success: true,
                    message: "Notice Updated"
                });

            }
        );

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


/* ==========================================================
   DELETE NOTICE
========================================================== */

exports.deleteNotice = (req, res) => {

    try {

        const { id } = req.params;

        db.query(
            "DELETE FROM notices WHERE notice_id=?",
            [id],
            (err) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                res.json({
                    success: true,
                    message: "Notice Deleted"
                });

            }
        );

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
/* ==========================================================
   GET RESULTS
========================================================== */

exports.getResults = (req, res) => {

    try {

        const { id } = req.params;

        const sql = `
            SELECT *
            FROM results
            WHERE student_id = ?
            ORDER BY semester ASC, subject ASC
        `;

        db.query(sql, [id], (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                count: result.length,
                data: result
            });

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


/* ==========================================================
   ADD RESULT
========================================================== */

exports.addResult = (req, res) => {

    try {

        const {

            student_id,
            semester,
            subject,
            internal_marks,
            external_marks,
            total_marks,
            grade,
            cgpa,
            result_status

        } = req.body;

        const sql = `

        INSERT INTO results(

            student_id,
            semester,
            subject,
            internal_marks,
            external_marks,
            total_marks,
            grade,
            cgpa,
            result_status

        )

        VALUES(?,?,?,?,?,?,?,?,?)

        `;

        db.query(

            sql,

            [

                student_id,
                semester,
                subject,
                internal_marks,
                external_marks,
                total_marks,
                grade,
                cgpa,
                result_status

            ],

            (err) => {

                if (err) {

                    return res.status(500).json({

                        success: false,
                        message: err.message

                    });

                }

                res.status(201).json({

                    success: true,
                    message: "Result Added Successfully"

                });

            }

        );

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


/* ==========================================================
   UPDATE RESULT
========================================================== */

exports.updateResult = (req, res) => {

    try {

        const { id } = req.params;

        const {

            semester,
            subject,
            internal_marks,
            external_marks,
            total_marks,
            grade,
            cgpa,
            result_status

        } = req.body;

        const sql = `

        UPDATE results

        SET

            semester=?,
            subject=?,
            internal_marks=?,
            external_marks=?,
            total_marks=?,
            grade=?,
            cgpa=?,
            result_status=?

        WHERE result_id=?

        `;

        db.query(

            sql,

            [

                semester,
                subject,
                internal_marks,
                external_marks,
                total_marks,
                grade,
                cgpa,
                result_status,
                id

            ],

            (err) => {

                if (err) {

                    return res.status(500).json({

                        success: false,
                        message: err.message

                    });

                }

                res.json({

                    success: true,
                    message: "Result Updated Successfully"

                });

            }

        );

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


/* ==========================================================
   DELETE RESULT
========================================================== */

exports.deleteResult = (req, res) => {

    try {

        const { id } = req.params;

        db.query(

            "DELETE FROM results WHERE result_id=?",

            [id],

            (err) => {

                if (err) {

                    return res.status(500).json({

                        success: false,
                        message: err.message

                    });

                }

                res.json({

                    success: true,
                    message: "Result Deleted Successfully"

                });

            }

        );

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};
/* ==========================================================
   GET FEES
========================================================== */

exports.getFees = (req, res) => {

    try {

        const { id } = req.params;

        db.query(

            `SELECT * FROM fees WHERE student_id=?`,

            [id],

            (err, result) => {

                if (err) {

                    return res.status(500).json({

                        success: false,
                        message: err.message

                    });

                }

                res.json({

                    success: true,
                    count: result.length,
                    data: result

                });

            }

        );

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


/* ==========================================================
   ADD FEES
========================================================== */

exports.addFee = (req, res) => {

    try {

        const {

            student_id,
            academic_year,
            total_fee,
            paid_fee,
            pending_fee,
            payment_status,
            payment_date

        } = req.body;

        const sql = `

        INSERT INTO fees(

            student_id,
            academic_year,
            total_fee,
            paid_fee,
            pending_fee,
            payment_status,
            payment_date

        )

        VALUES(?,?,?,?,?,?,?)

        `;

        db.query(

            sql,

            [

                student_id,
                academic_year,
                total_fee,
                paid_fee,
                pending_fee,
                payment_status,
                payment_date

            ],

            (err) => {

                if (err) {

                    return res.status(500).json({

                        success: false,
                        message: err.message

                    });

                }

                res.status(201).json({

                    success: true,
                    message: "Fee Record Added Successfully"

                });

            }

        );

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


/* ==========================================================
   UPDATE FEES
========================================================== */

exports.updateFee = (req, res) => {

    try {

        const { id } = req.params;

        const {

            academic_year,
            total_fee,
            paid_fee,
            pending_fee,
            payment_status,
            payment_date

        } = req.body;

        const sql = `

        UPDATE fees

        SET

            academic_year=?,
            total_fee=?,
            paid_fee=?,
            pending_fee=?,
            payment_status=?,
            payment_date=?

        WHERE fee_id=?

        `;

        db.query(

            sql,

            [

                academic_year,
                total_fee,
                paid_fee,
                pending_fee,
                payment_status,
                payment_date,
                id

            ],

            (err) => {

                if (err) {

                    return res.status(500).json({

                        success: false,
                        message: err.message

                    });

                }

                res.json({

                    success: true,
                    message: "Fee Updated Successfully"

                });

            }

        );

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


/* ==========================================================
   DELETE FEES
========================================================== */

exports.deleteFee = (req, res) => {

    try {

        const { id } = req.params;

        db.query(

            "DELETE FROM fees WHERE fee_id=?",

            [id],

            (err) => {

                if (err) {

                    return res.status(500).json({

                        success: false,
                        message: err.message

                    });

                }

                res.json({

                    success: true,
                    message: "Fee Deleted Successfully"

                });

            }

        );

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};
/* ==========================================================
   GET LIBRARY BOOKS
========================================================== */

exports.getLibrary = (req, res) => {

    try {

        const { id } = req.params;

        db.query(

            `SELECT * FROM library
             WHERE student_id=?
             ORDER BY issue_date DESC`,

            [id],

            (err, result) => {

                if (err) {

                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });

                }

                res.json({

                    success: true,
                    count: result.length,
                    data: result

                });

            }

        );

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


/* ==========================================================
   ADD LIBRARY BOOK
========================================================== */

exports.addLibrary = (req, res) => {

    try {

        const {

            student_id,
            book_name,
            author,
            issue_date,
            return_date,
            status

        } = req.body;

        const sql = `

        INSERT INTO library(

            student_id,
            book_name,
            author,
            issue_date,
            return_date,
            status

        )

        VALUES(?,?,?,?,?,?)

        `;

        db.query(

            sql,

            [

                student_id,
                book_name,
                author,
                issue_date,
                return_date,
                status

            ],

            (err) => {

                if (err) {

                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });

                }

                res.status(201).json({

                    success: true,
                    message: "Book Issued Successfully"

                });

            }

        );

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


/* ==========================================================
   UPDATE LIBRARY BOOK
========================================================== */

exports.updateLibrary = (req, res) => {

    try {

        const { id } = req.params;

        const {

            book_name,
            author,
            issue_date,
            return_date,
            status

        } = req.body;

        const sql = `

        UPDATE library

        SET

            book_name=?,
            author=?,
            issue_date=?,
            return_date=?,
            status=?

        WHERE library_id=?

        `;

        db.query(

            sql,

            [

                book_name,
                author,
                issue_date,
                return_date,
                status,
                id

            ],

            (err) => {

                if (err) {

                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });

                }

                res.json({

                    success: true,
                    message: "Library Record Updated"

                });

            }

        );

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


/* ==========================================================
   DELETE LIBRARY BOOK
========================================================== */

exports.deleteLibrary = (req, res) => {

    try {

        const { id } = req.params;

        db.query(

            "DELETE FROM library WHERE library_id=?",

            [id],

            (err) => {

                if (err) {

                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });

                }

                res.json({

                    success: true,
                    message: "Library Record Deleted"

                });

            }

        );

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};
/* ==========================================================
   GET CERTIFICATES
========================================================== */

exports.getCertificates = (req, res) => {

    try {

        const { id } = req.params;

        db.query(

            `SELECT *
             FROM certificates
             WHERE student_id=?`,

            [id],

            (err, result) => {

                if (err) {

                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });

                }

                res.json({

                    success: true,
                    count: result.length,
                    data: result

                });

            }

        );

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


/* ==========================================================
   ADD CERTIFICATE
========================================================== */

exports.addCertificate = (req, res) => {

    try {

        const {

            student_id,
            certificate_name,
            issued_by,
            issue_date,
            certificate_url

        } = req.body;

        const sql = `

        INSERT INTO certificates(

            student_id,
            certificate_name,
            issued_by,
            issue_date,
            certificate_url

        )

        VALUES(?,?,?,?,?)

        `;

        db.query(

            sql,

            [

                student_id,
                certificate_name,
                issued_by,
                issue_date,
                certificate_url

            ],

            (err) => {

                if (err) {

                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });

                }

                res.status(201).json({

                    success: true,
                    message: "Certificate Added Successfully"

                });

            }

        );

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


/* ==========================================================
   UPDATE CERTIFICATE
========================================================== */

exports.updateCertificate = (req, res) => {

    try {

        const { id } = req.params;

        const {

            certificate_name,
            issued_by,
            issue_date,
            certificate_url

        } = req.body;

        const sql = `

        UPDATE certificates

        SET

            certificate_name=?,
            issued_by=?,
            issue_date=?,
            certificate_url=?

        WHERE certificate_id=?

        `;

        db.query(

            sql,

            [

                certificate_name,
                issued_by,
                issue_date,
                certificate_url,
                id

            ],

            (err) => {

                if (err) {

                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });

                }

                res.json({

                    success: true,
                    message: "Certificate Updated"

                });

            }

        );

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


/* ==========================================================
   DELETE CERTIFICATE
========================================================== */

exports.deleteCertificate = (req, res) => {

    try {

        const { id } = req.params;

        db.query(

            "DELETE FROM certificates WHERE certificate_id=?",

            [id],

            (err) => {

                if (err) {

                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });

                }

                res.json({

                    success: true,
                    message: "Certificate Deleted"

                });

            }

        );

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};
/* ==========================================================
   GET HOSTEL DETAILS
========================================================== */

exports.getHostel = (req, res) => {

    try {

        const { id } = req.params;

        db.query(

            `SELECT * FROM hostel WHERE student_id=?`,

            [id],

            (err, result) => {

                if (err)
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });

                res.json({
                    success: true,
                    count: result.length,
                    data: result
                });

            }

        );

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


/* ==========================================================
   ADD HOSTEL
========================================================== */

exports.addHostel = (req, res) => {

    try {

        const {

            student_id,
            hostel_name,
            room_number,
            floor,
            bed_number,
            check_in,
            check_out,
            status

        } = req.body;

        db.query(

            `INSERT INTO hostel
            (
                student_id,
                hostel_name,
                room_number,
                floor,
                bed_number,
                check_in,
                check_out,
                status
            )
            VALUES(?,?,?,?,?,?,?,?)`,

            [

                student_id,
                hostel_name,
                room_number,
                floor,
                bed_number,
                check_in,
                check_out,
                status

            ],

            (err) => {

                if (err)
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });

                res.status(201).json({
                    success: true,
                    message: "Hostel Allocated Successfully"
                });

            }

        );

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


/* ==========================================================
   UPDATE HOSTEL
========================================================== */

exports.updateHostel = (req, res) => {

    try {

        const { id } = req.params;

        const {

            hostel_name,
            room_number,
            floor,
            bed_number,
            check_in,
            check_out,
            status

        } = req.body;

        db.query(

            `UPDATE hostel
            SET
                hostel_name=?,
                room_number=?,
                floor=?,
                bed_number=?,
                check_in=?,
                check_out=?,
                status=?
            WHERE hostel_id=?`,

            [

                hostel_name,
                room_number,
                floor,
                bed_number,
                check_in,
                check_out,
                status,
                id

            ],

            (err) => {

                if (err)
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });

                res.json({
                    success: true,
                    message: "Hostel Updated Successfully"
                });

            }

        );

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


/* ==========================================================
   DELETE HOSTEL
========================================================== */

exports.deleteHostel = (req, res) => {

    try {

        db.query(

            "DELETE FROM hostel WHERE hostel_id=?",

            [req.params.id],

            (err) => {

                if (err)
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });

                res.json({
                    success: true,
                    message: "Hostel Record Deleted"
                });

            }

        );

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
/* ==========================================================
   GET EVENTS
========================================================== */

exports.getEvents = (req, res) => {

    db.query(

        "SELECT * FROM events ORDER BY event_date ASC",

        (err, result) => {

            if (err)
                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            res.json({
                success: true,
                count: result.length,
                data: result
            });

        }

    );

};


/* ==========================================================
   ADD EVENT
========================================================== */

exports.addEvent = (req, res) => {

    const {

        title,
        description,
        event_date,
        event_time,
        venue,
        organizer

    } = req.body;

    db.query(

        `INSERT INTO events
        (
            title,
            description,
            event_date,
            event_time,
            venue,
            organizer
        )
        VALUES(?,?,?,?,?,?)`,

        [

            title,
            description,
            event_date,
            event_time,
            venue,
            organizer

        ],

        (err) => {

            if (err)
                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            res.status(201).json({
                success: true,
                message: "Event Added Successfully"
            });

        }

    );

};


/* ==========================================================
   UPDATE EVENT
========================================================== */

exports.updateEvent = (req, res) => {

    const { id } = req.params;

    const {

        title,
        description,
        event_date,
        event_time,
        venue,
        organizer

    } = req.body;

    db.query(

        `UPDATE events
        SET
            title=?,
            description=?,
            event_date=?,
            event_time=?,
            venue=?,
            organizer=?
        WHERE event_id=?`,

        [

            title,
            description,
            event_date,
            event_time,
            venue,
            organizer,
            id

        ],

        (err) => {

            if (err)
                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            res.json({
                success: true,
                message: "Event Updated Successfully"
            });

        }

    );

};


/* ==========================================================
   DELETE EVENT
========================================================== */

exports.deleteEvent = (req, res) => {

    db.query(

        "DELETE FROM events WHERE event_id=?",

        [req.params.id],

        (err) => {

            if (err)
                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            res.json({
                success: true,
                message: "Event Deleted Successfully"
            });

        }

    );

};
/* ==========================================================
   GET NOTIFICATIONS
========================================================== */

exports.getNotifications = (req, res) => {

    db.query(

        `SELECT *
         FROM notifications
         WHERE student_id=?
         ORDER BY created_at DESC`,

        [req.params.id],

        (err, result) => {

            if (err)
                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            res.json({
                success: true,
                count: result.length,
                data: result
            });

        }

    );

};


/* ==========================================================
   ADD NOTIFICATION
========================================================== */

exports.addNotification = (req, res) => {

    const {

        student_id,
        title,
        message

    } = req.body;

    db.query(

        `INSERT INTO notifications
        (
            student_id,
            title,
            message
        )
        VALUES(?,?,?)`,

        [

            student_id,
            title,
            message

        ],

        (err) => {

            if (err)
                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            res.status(201).json({
                success: true,
                message: "Notification Added Successfully"
            });

        }

    );

};


/* ==========================================================
   MARK NOTIFICATION AS READ
========================================================== */

exports.markNotificationRead = (req, res) => {

    db.query(

        `UPDATE notifications
         SET is_read=TRUE
         WHERE notification_id=?`,

        [req.params.id],

        (err) => {

            if (err)
                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            res.json({
                success: true,
                message: "Notification Marked as Read"
            });

        }

    );

};


/* ==========================================================
   DELETE NOTIFICATION
========================================================== */

exports.deleteNotification = (req, res) => {

    db.query(

        "DELETE FROM notifications WHERE notification_id=?",

        [req.params.id],

        (err) => {

            if (err)
                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            res.json({
                success: true,
                message: "Notification Deleted Successfully"
            });

        }

    );

};