const createEmployermodel = require("../models/createEmployer");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
//const { employerSchema } = require("../helpers/validationSchema");

// for create employer
const createEmployer = async (req, res) => {
  try {
    const { name, email, mobileNo, designation, gender, course } = req.body;
    const file = req.file;
    // await employerSchema.validateAsync(req.body);
    // Check if the authorization token is present
    const token = req.headers.authorization;
    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Unauthorized. Token is missing or invalid." });
    }

   
    const tokenString = token.split(' ')[1];

   
    const decodedToken = jwt.verify(tokenString, process.env.JWT_SECRET_REFRESH_TOKEN);
    const employerId = decodedToken._id;

    console.log(employerId);
    // Validation
    if (
      !name ||
      !email ||
      !mobileNo ||
      !designation ||
      !gender ||
      !course ||
      !file
    ) {
      return res
        .status(400)
        .json({
          message:
            "Name, email, mobileNo, designation, gender, course, and file are required",
        });
    } else if (!/^\d{10}$/.test(mobileNo)) {
      return res
        .status(400)
        .json({ message: "Mobile number must be a 10-digit number" });
    }

    // Check if the employer already exists
    const existingUser = await createEmployermodel.findOne({ email });
    if (existingUser) {
      return res.status(200).json({
        success: false,
        message: "This employer already exists",
      });
    }

    // Save the new employer with the provided data
    const newEmployer = new createEmployermodel({
      name,
      email,
      mobileNo,
      designation,
      gender,
      course,
      employerId, // Save the employer's ID
      image: {
        data: file.buffer,
        contentType: file.mimetype,
        imagePath: `uploads/${file.filename}`,
      },
    });
    await newEmployer.save();

    return res
      .status(201)
      .json({
        success: true,
        message: "Employer created successfully",
        newEmployer,
      });
  } catch (error) {
    console.error("Error in creating employer:", error);
    return res.status(500).json({
      success: false,
      message: "Error in creating employer",
      error: error.message,
    });
  }
};

// for geting employer details 
const getEmployerList = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Bad request or Token is missing" });
    }

    const decodedToken = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET_REFRESH_TOKEN
    );

    // Assuming the user ID is stored in decodedToken._id
    const employerId = decodedToken._id;

    // Retrieve employer list based on user ID
    const employerList = await createEmployermodel.find({ employerId }).exec();

    if (!employerList) {
      return res.status(404).json({ message: "Employer list not found" });
    }
    return res.json({
      message: "Employer list retrieved successfully",
      employerList,
    });
  } catch (error) {
    console.error("Error getting employer list:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

//get all employers list
const getAllEmployerList = async (req, res, next) => {
  try {
    // Retrieve employer list 
    const employerList = await createEmployermodel.find({});

    if (!employerList) {
      return res.status(404).json({ message: "Employer list not found" });
    }
    return res.json({
      message: "Employer list retrieved successfully",
      employerList,
    });
  } catch (error) {
    console.error("Error getting employer list:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

// for updating employee
const updateEmployee = async (req, res) => {
  try {
    const { name, email, mobileNo, designation, gender, course } = req.body;
    const { id } = req.params;
    const file = req.file;
    console.log(req.body);
    // Check if the ID is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Employer ID not provided",
      });
    }

    // Find the employer in the database
    const existingEmployee = await createEmployermodel.findById(id);
    console.log(existingEmployee);
    // Check if the employer with the given ID exists
    if (!existingEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employer not found",
      });
    }

    // Update employer fields
    existingEmployee.name = name || existingEmployee.name;
    existingEmployee.mobileNo = mobileNo || existingEmployee.mobileNo;
    existingEmployee.email = email || existingEmployee.email;
    existingEmployee.designation = designation || existingEmployee.designation;
    existingEmployee.course = course || existingEmployee.course;
    existingEmployee.gender = gender || existingEmployee.gender;

    // Check if a new image is provided
    if (file) {
      // Update the image only if a new image is provided
      existingEmployee.image = {
        data: file.buffer,
        contentType: file.mimetype,
        imagePath: `uploads/${file.filename}`,
      };
    }

    // Save the updated employer to the database
    await existingEmployee.save();

    // Include the employer information in the response
    return res.status(200).json({
      success: true,
      message: "Employer data updated successfully",
      existingEmployee,
    });
  } catch (error) {
    console.error("Error while updating employer:", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating employer",
      error: error.message,
    });
  }
};

//get single employee list
const getSingleEmployee = async (req, res) => {
  try {
    //const { name, email, mobileNo, designation, gender, course } = req.body;
    const { id } = req.params;
    //const file = req.file;
    console.log(req.body);
    // Check if the ID is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Employer ID not provided",
      });
    }

    // Find the employer in the database
    const existingEmployee = await createEmployermodel.findById(id);
    console.log(existingEmployee);
    // Check if the employer with the given ID exists
    if (!existingEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employer not found",
      });
    }

    // Include the employer information in the response
    return res.status(200).json({
      success: true,
      message: "Employer data updated successfully",
      existingEmployee,
    });
  } catch (error) {
    console.error("Error while updating employer:", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating employer",
      error: error.message,
    });
  }
};


//for deleting employee
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate if the ID is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "employer ID not provided",
      });
    }

    // Find and remove the product from the database
    const deleteEmployee = await createEmployermodel.findByIdAndDelete(id);

    if (!deleteEmployee) {
      return res.status(404).json({
        success: false,
        message: "employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "employee deleted successfully",
      employee: deleteEmployee,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

module.exports = {
  createEmployer,
  getEmployerList,
  updateEmployee,
  deleteEmployee,
  getAllEmployerList,
  getSingleEmployee,
};


