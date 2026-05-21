const studentModel = require("../../models/admin/student");
const cloudinary = require("../../config/cloudinary");
const {
  getPaginationOptions,
  getSortOptions,
  getPaginationMeta,
} = require("../../utils/queryHelper");
const {
  responeFullData,
  responeDataAddStudentToClass,
} = require("../../utils/studentResTemplate");

const createStudent = async (body, file) => {
  let imageUrl = null;
  let cloudinaryId = null;
  const { phone, generation_id, scholarship_id, shift_id } = body;

  const checkPhone = await studentModel.checkPhone(phone.trim());
  if (checkPhone.length > 0) {
    const error = new Error("Invalid input value");
    error.statusCode = 409;
    error.data = {
      message: "Phone is exist",
    };
    throw error;
  }
  else if (file) {
    imageUrl = file.path;
    cloudinaryId = file.filename;
  }

  const [genData, shiftData, scholarData] = await Promise.all([
    studentModel.findById(generation_id, "generations"),
    studentModel.findById(shift_id, "shifts"),
    studentModel.findById(scholarship_id, "scholarships"),
  ]);

  const errors = [];

  if (!genData.length || genData.length === 0) errors.push("Invalid Generation ID");
  if (!shiftData.length || shiftData.length === 0) errors.push("Invalid Shift ID");
  if (!scholarData.length || scholarData.length === 0) errors.push("Invalid Scholarship ID");

  if (errors.length > 0) {
    const error = new Error("Invalid input value");
    error.statusCode = 409;
    error.data = { message: errors };
    throw error;
  }

  const insertId = await studentModel.insertStudent(
    body,
    imageUrl,
    cloudinaryId,
  );
  const student = await studentModel.getFullInfoById(insertId);

  return responeFullData(student);
};

const updateStudentInfo = async (id, body) => {
  const { phone, generation_id, scholarship_id, shift_id } = body;

  const existingStudent = await studentModel.getById(id);

  if (!existingStudent || existingStudent.length === 0) {
    const error = new Error("Student record does not exist.");
    error.statusCode = 404;
    error.data = {
      message: "Student not found.",
    };

    throw error;
  }

  const [student] = existingStudent;
  if (phone && phone.trim() !== student.phone) {
    const phoneExists = await studentModel.checkPhone(phone.trim());
    if (phoneExists && phoneExists.length > 0) {
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

  const [genData, shiftData, scholarData] = await Promise.all([
    studentModel.findById(generation_id, "generations"),
    studentModel.findById(shift_id, "shifts"),
    studentModel.findById(scholarship_id, "scholarships"),
  ]);

  const errors = [];

  if (!genData || genData.length === 0) errors.push("Invalid Generation ID");
  if (!shiftData || shiftData.length === 0) errors.push("Invalid Shift ID");
  if (!scholarData || scholarData.length === 0) errors.push("Invalid Scholarship ID");

  if (errors.length > 0) {
    const error = new Error("Invalid input value");

    error.statusCode = 400;

    error.data = {
      message: errors,
    };

    throw error;
  }

  await studentModel.updateStudentInfo(id, body);

  const updatedStudent = await studentModel.getFullInfoById(id);

  return responeFullData(updatedStudent);
};

const updateStudentProfile = async (id, file) => {
  const existingStudent = await studentModel.findById(id, "students");
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
  const updatedStudent = await studentModel.getFullInfoById(id);

  return responeFullData(updatedStudent);
};

const deleteStudent = async (id) => {
  const existingStudent = await studentModel.getById(id);
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

  const allowedColumns = ["id", "fullname", "created_at", "updated_at"];

  const { sortColumn, sortDirection } = getSortOptions(
    sort_col,
    sort_dir,
    allowedColumns,
    "id",
  );

  const [students, totalItems] = await Promise.all([
    studentModel.getAllStudents(itemsPerPage, skip, sortColumn, sortDirection),
    studentModel.countStudents(),
  ]);

  const paginationMeta = getPaginationMeta(
    totalItems,
    currentPage,
    itemsPerPage,
  );

  return {
    items: students.map((student) => responeFullData(student)),
    meta: paginationMeta,
  };
};

const getStudentById = async (id) => {
  const existingStudent = await studentModel.getById(id);
  if (existingStudent.length === 0) {
    const error = new Error("Student record does not exist.");
    error.statusCode = 404;
    error.data = {
      message: "Student not found.",
    };
    throw error;
  }

  const student = await studentModel.getFullInfoById(id);

  return responeFullData(student);
};

// Add student to class
const addStudentToClass = async (body) => {
  const { student_id, class_id } = body;

  const [[studentData], [classData]] = await Promise.all([
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

  const existingEntry = await studentModel.findStudentInClass(
    student_id,
    class_id,
  );

  if (existingEntry.length > 0) {
    const error = new Error(
      "Duplicate entry for key 'class_students.unique_student_class'",
    );
    error.statusCode = 409;
    error.data = {
      message: "Student is already in this class.",
    };
    throw error;
  }

  const insertId = await studentModel.addStudentToClass(
    studentData.id,
    classData.id,
  );
  const result = await studentModel.getInfoStudentIntoClass(insertId);

  return responeDataAddStudentToClass(insertId, result[0]);
};

const removeStudentFromClass = async (classId, studentId) => {
  const existingEntry = await studentModel.findStudentInClass(
    studentId,
    classId,
  );

  if (!existingEntry || existingEntry.length === 0) {
    const error = new Error("Student is not in the specified class.");
    error.statusCode = 404;
    error.data = {
      message: "Student not found in the specified class.",
    };
    throw error;
  }

  await studentModel.removeStudentFromClass(classId, studentId);
};

const getStudentsByClassId = async (classId, query) => {
  const existingClass = await studentModel.findById(classId, "classes");
  if (!existingClass || existingClass.length === 0) {
    const error = new Error("Class record does not exist.");
    error.statusCode = 404;
    error.data = {
      message: "Class not found.",
    };
    throw error;
  }

  const { page, limit, sort_col, sort_dir } = query;

  const { currentPage, itemsPerPage, skip } = getPaginationOptions(page, limit);

  const allowedColumns = ["id", "fullname", "created_at"];

  const { sortColumn, sortDirection } = getSortOptions(
    sort_col,
    sort_dir,
    allowedColumns,
    "id",
  );

  const [students, totalItems] = await Promise.all([
    studentModel.getStudentsByClassId(
      classId,
      itemsPerPage,
      skip,
      sortColumn,
      sortDirection,
    ),
    studentModel.countStudentsByClassId(classId),
  ]);

  const paginationMeta = getPaginationMeta(
    totalItems,
    currentPage,
    itemsPerPage,
  );

  return {
    items: students.map((student) => responeFullData(student)),
    meta: paginationMeta,
  };
};

const getClassesByStudentId = async (studentId, query) => {
  const existingStudent = await studentModel.findById(studentId, "students");
  if (!existingStudent || existingStudent.length === 0) {
    const error = new Error("Student record does not exist.");
    error.statusCode = 404;
    error.data = {
      message: "Student not found.",
    };
    throw error;
  }

  const existingStudentInClass = await studentModel.checkStudentInClass(studentId);
  if (!existingStudentInClass || existingStudentInClass.length === 0) {
    const error = new Error("Student record does not exist.");
    error.statusCode = 404;
    error.data = {
      message: "Student not found in any class.",
    };
    throw error;
  }

  const { page, limit, sort_col, sort_dir } = query;

  const { currentPage, itemsPerPage, skip } = getPaginationOptions(page, limit);

  const allowedColumns = ["id", "name", "created_at"];

  const { sortColumn, sortDirection } = getSortOptions(
    sort_col,
    sort_dir,
    allowedColumns,
    "id",
  );

  const [classes, totalItems] = await Promise.all([
    studentModel.getClassesByStudentId(
      studentId,
      itemsPerPage,
      skip,
      sortColumn,
      sortDirection,
    ),
    studentModel.countClassesByStudentId(studentId),
  ]);

  const paginationMeta = getPaginationMeta(
    totalItems,
    currentPage,
    itemsPerPage,
  );

  return {
    items: classes.map((cls) => responeFullData(cls)),
    meta: paginationMeta,
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
  removeStudentFromClass,
  getStudentsByClassId,
  getClassesByStudentId,
};
