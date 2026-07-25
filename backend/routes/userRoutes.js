const express = require("express");

const router = express.Router();

const {

    // ==========================
    // Authentication
    // ==========================
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,

    // ==========================
    // Dashboard
    // ==========================
    getDashboard,

    // ==========================
    // Attendance
    // ==========================
    getAttendance,
    addAttendance,
    updateAttendance,
    deleteAttendance,

    // ==========================
    // Timetable
    // ==========================
    getTimetable,
    addTimetable,
    updateTimetable,
    deleteTimetable,

    // ==========================
    // Assignments
    // ==========================
    getAssignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,

    // ==========================
    // Notices
    // ==========================
    getNotices,
    addNotice,
    updateNotice,
    deleteNotice,

    // ==========================
    // Results
    // ==========================
    getResults,
    addResult,
    updateResult,
    deleteResult,

    // ==========================
    // Fees
    // ==========================
    getFees,
    addFee,
    updateFee,
    deleteFee,

    // ==========================
    // Library
    // ==========================
    getLibrary,
    addLibrary,
    updateLibrary,
    deleteLibrary,

    // ==========================
    // Certificates
    // ==========================
    getCertificates,
    addCertificate,
    updateCertificate,
    deleteCertificate,

    // ==========================
    // Hostel
    // ==========================
    getHostel,
    addHostel,
    updateHostel,
    deleteHostel,

    // ==========================
    // Events
    // ==========================
    getEvents,
    addEvent,
    updateEvent,
    deleteEvent,

    // ==========================
    // Notifications
    // ==========================
    getNotifications,
    addNotification,
    markNotificationRead,
    deleteNotification

} = require("../controllers/userController");


// ==================================================
// Authentication
// ==================================================

router.post("/register", register);

router.post("/login", login);

router.get("/profile/:id", getProfile);

router.put("/profile/:id", updateProfile);

router.put("/change-password/:id", changePassword);


// ==================================================
// Dashboard
// ==================================================

router.get("/dashboard/:id", getDashboard);


// ==================================================
// Attendance
// ==================================================

router.get("/attendance/:id", getAttendance);

router.post("/attendance", addAttendance);

router.put("/attendance/:id", updateAttendance);

router.delete("/attendance/:id", deleteAttendance);


// ==================================================
// Timetable
// ==================================================

router.get("/timetable/:id", getTimetable);

router.post("/timetable", addTimetable);

router.put("/timetable/:id", updateTimetable);

router.delete("/timetable/:id", deleteTimetable);


// ==================================================
// Assignments
// ==================================================

router.get("/assignments/:id", getAssignments);

router.post("/assignments", addAssignment);

router.put("/assignments/:id", updateAssignment);

router.delete("/assignments/:id", deleteAssignment);


// ==================================================
// Notices
// ==================================================

router.get("/notices", getNotices);

router.post("/notices", addNotice);

router.put("/notices/:id", updateNotice);

router.delete("/notices/:id", deleteNotice);


// ==================================================
// Results
// ==================================================

router.get("/results/:id", getResults);

router.post("/results", addResult);

router.put("/results/:id", updateResult);

router.delete("/results/:id", deleteResult);
// ==================================================
// Fees
// ==================================================

router.get("/fees/:id", getFees);

router.post("/fees", addFee);

router.put("/fees/:id", updateFee);

router.delete("/fees/:id", deleteFee);


// ==================================================
// Library
// ==================================================

router.get("/library/:id", getLibrary);

router.post("/library", addLibrary);

router.put("/library/:id", updateLibrary);

router.delete("/library/:id", deleteLibrary);


// ==================================================
// Certificates
// ==================================================

router.get("/certificates/:id", getCertificates);

router.post("/certificates", addCertificate);

router.put("/certificates/:id", updateCertificate);

router.delete("/certificates/:id", deleteCertificate);


// ==================================================
// Hostel
// ==================================================

router.get("/hostel/:id", getHostel);

router.post("/hostel", addHostel);

router.put("/hostel/:id", updateHostel);

router.delete("/hostel/:id", deleteHostel);


// ==================================================
// Events
// ==================================================

router.get("/events", getEvents);

router.post("/events", addEvent);

router.put("/events/:id", updateEvent);

router.delete("/events/:id", deleteEvent);


// ==================================================
// Notifications
// ==================================================

router.get("/notifications/:id", getNotifications);

router.post("/notifications", addNotification);

router.put("/notifications/read/:id", markNotificationRead);

router.delete("/notifications/:id", deleteNotification);


// ==================================================
// Export Router
// ==================================================

module.exports = router;