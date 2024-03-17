const express = require("express");
const router = express.Router();
const upload = require("../Config/multerConfig");
const path = require("path");
const EmployerDashboard = require("../controllers/employerDashboardController");

// routing for create employer
router.post(
  "/createEmployer",
  upload.single("file"),
  EmployerDashboard.createEmployer
);

// routing for get employer list
router.get("/getEmployerList", EmployerDashboard.getEmployerList);
router.delete("/deleteEmployee/:id", EmployerDashboard.deleteEmployee);
router.put("/updateEmployee/:id", upload.single("file"), EmployerDashboard.updateEmployee);

module.exports = router;
