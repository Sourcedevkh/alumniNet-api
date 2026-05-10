const studentModel = require("../../models/admin/student");
const cloudinary = require("../../config/cloudinary");
const { getPaginationOptions, getSortOptions, getPaginationMeta } = require('../../utils/queryHelper');

const createStudent = async (req) => {
  let body = await req.validateBody;
  let imageUrl = null;
  let cloudinaryId = null;
  const { phone, generation_id, scholarship_id, class_id, shift_id } = body;
  const file = req.file;

  if (file) {
    imageUrl = file.path;
    cloudinaryId = file.filename;
  }

  const [checkPhone] = await studentModel.checkPhone(phone);
  if (checkPhone.length > 0) {
    const error = new Error("Invalid input value");
    error.statusCode = 409;
    error.data = {
      message: "Phone is exist",
    };
    throw error;
  }

  const [genData, classData, shiftData, scholarData] = await Promise.all([
    studentModel.findById(generation_id, "generations"),
    studentModel.findById(class_id, "classes"),
    studentModel.findById(shift_id, "shifts"),
    studentModel.findById(scholarship_id, "scholarships"),
  ]);

  const errors = [];

  if (!genData) errors.push("Invalid Generation ID");
  if (!classData) errors.push("Invalid Class ID");
  if (!shiftData) errors.push("Invalid Shift ID");
  if (!scholarData) errors.push("Invalid Scholarship ID");

  if (errors.length > 0) {
    const error = new Error("Invalid input value");
    error.statusCode = 409;
    error.data = { message: errors };
    // message: errors.join(" | "),
    throw error;
  }

  const insertId = await studentModel.insertStudent(
    body,
    imageUrl,
    cloudinaryId,
  );
  const row = await studentModel.getById(insertId);

  return row;
};

const updateStudentInfo = async (id, body) => {
  const { phone, generation_id, scholarship_id, class_id, shift_id } = body;

  const [existingStudent] = await studentModel.getById(id);
  if (existingStudent.length === 0) {
    const error = new Error("Student record does not exist.");
    error.statusCode = 404;
    error.data = {
      message: "Student not found.",
    };
    throw error;
  }

  if (phone && phone !== existingStudent[0].phone) {
    const phoneExists = await studentModel.checkPhone(phone);
    if (phoneExists) {
      const error = new Error(
        "Duplicate phone number detected during student update.",
      );
      error.statusCode = 409;
      error.data = {
        message: "Phone number is already in use by another student.",
      };
      throw error;
    }
  }

  const [genData, classData, shiftData, scholarData] = await Promise.all([
    studentModel.findById(generation_id, "generations"),
    studentModel.findById(class_id, "classes"),
    studentModel.findById(shift_id, "shifts"),
    studentModel.findById(scholarship_id, "scholarships"),
  ]);

  const errors = [];

  if (!genData) errors.push("Invalid Generation ID");
  if (!classData) errors.push("Invalid Class ID");
  if (!shiftData) errors.push("Invalid Shift ID");
  if (!scholarData) errors.push("Invalid Scholarship ID");

  if (errors.length > 0) {
    const error = new Error("Invalid input value");
    error.statusCode = 409;
    error.data = { message: errors };
    throw error;
  }

  await studentModel.updateStudentInfo(id, body);
  const updatedStudent = await studentModel.getById(id);

  return updatedStudent;
};

const updateStudentProfile = async (id, file) => {
  const existingStudent = await studentModel.getById(id);
  if (existingStudent.length === 0) {
    const error = new Error("Student record does not exist.");
    error.statusCode = 404;
    error.data = {
      message: "Student not found.",
    };
    throw error;
  }

  let imageUrl = null;
  let cloudinaryId = null;
  if (file) {
    imageUrl = file.path;
    cloudinaryId = file.filename;
  }
  await studentModel.updateStudentProfile(id, imageUrl, cloudinaryId);
  const updatedStudent = await studentModel.getById(id);

  return updatedStudent;
};

const deleteStudent = async (id) => {
  const [existingStudent] = await studentModel.getById(id);
  if (existingStudent.length === 0) {
    const error = new Error("Student record does not exist.");
    error.statusCode = 404;
    error.data = {
      message: "Student not found.",
    };
    throw error;
  }

  if (existingStudent[0].cloudinary_id) {
    await cloudinary.uploader.destroy(existingStudent[0].cloudinary_id);
  }

  await studentModel.deleteStudent(id);
};

const getAllStudents = async (query) => {
  const { page, limit, sort_col, sort_dir } = query;

  const { currentPage, itemsPerPage, skip } = getPaginationOptions(page, limit);

  const allowedColumns = ['id', 'fullname', 'created_at', 'updated_at']; 
  
  const { sortColumn, sortDirection } = getSortOptions(sort_col, sort_dir, allowedColumns, 'id');

  const [students, totalItems] = await Promise.all([
    studentModel.findStudents(itemsPerPage, skip, sortColumn, sortDirection),
    studentModel.countStudents()
  ]);

  const paginationMeta = getPaginationMeta(totalItems, currentPage, itemsPerPage);

  return {
    items: students.map(student => ({
      id: student.student_id,
      fullname: student.fullname,
      profile_url: student.profile_url,
      gender: student.gender,
      phone: student.phone,
      status: student.status,
      generation: {
        id: student.generation_id,
        name: student.generation_name,
        description: student.generation_desc,
      },
      scholarship: {
        id: student.scholarship_id,
        name: student.scholarship_name,
        description: student.scholarship_desc,
      },
      shift: {
        id: student.shift_id,
        name: student.shift_name,
      },
      class: {
        id: student.class_id,
        name: student.class_name,
        description: student.class_desc,
      },
      
      created_at: student.created_at,
      updated_at: student.updated_at,
    })),
    meta: paginationMeta
  };
};

const getStudentById = async (id) => {
  const [existingStudent] = await studentModel.getById(id);
  if (existingStudent.length === 0) {
    const error = new Error("Student record does not exist.");
    error.statusCode = 404;
    error.data = {
      message: "Student not found.",
    };
    throw error;
  }

  const student = await studentModel.getFullInfoById(id);
  
  return {
    id: student.student_id,
    fullname: student.fullname,
    profile_url: student.profile_url,
    gender: student.gender,
    phone: student.phone,
    status: student.status,
    generation: {
      id: student.generation_id,
      name: student.generation_name,
      description: student.generation_desc,
    },
    scholarship: {
      id: student.scholarship_id,
      name: student.scholarship_name,
      description: student.scholarship_desc,
    },
    shift: {
      id: student.shift_id,
      name: student.shift_name,
    },
    class: {
      id: student.class_id,
      name: student.class_name,
      description: student.class_desc,
    },
    created_at: student.created_at,
    updated_at: student.updated_at,
  };
};

const addStudentToClass = async (body) => {
  const { student_id, class_id } = body;

  const [studentData, classData] = await Promise.all([
    studentModel.findById(student_id, "students"),
    studentModel.findById(class_id, "classes"),
  ]);

  if (!studentData) {
    const error = new Error("Student record does not exist.");
    error.statusCode = 404;
    error.data = {
      message: "Student not found.",
    };
    throw error;
  }

  if (!classData) {
    const error = new Error("Class record does not exist.");
    error.statusCode = 404;
    error.data = {
      message: "Class not found.",
    };
    throw error;
  }

  const existingEntry = await studentModel.findStudentInClass(student_id, class_id);
  if (existingEntry) {
    const error = new Error("Duplicate entry for key 'class_students.unique_student_class'");
    error.statusCode = 409;
    error.data = {
      message: "Student is already in this class.",
    };
    throw error;
  }

  const insertId = await studentModel.addStudentToClass(studentData.id, classData.id);
  const result = await studentModel.getInfoStudentIntoClass(insertId);

  return {
    id: insertId,
    student:{
      id: result[0].student_id,
      fullname: result[0].fullname,
      profile_url: result[0].profile_url,
      phone: result[0].phone,
      gender: result[0].gender,
    },
    class: {
      id: result[0].class_id,
      name: result[0].name,
      description: result[0].description,
    },
    createt_at: result[0].created_at,
  };
};

module.exports = {
  createStudent,
  updateStudentInfo,
  updateStudentProfile,
  deleteStudent,
  getAllStudents,
  getStudentById,
  addStudentToClass,
};
