const studentModel = require("../../models/admin/student");

const createStudent = async (req) => {
  let body = await req.validateBody;
  let imageUrl = null;
  let cloudinaryId = null;
  const {
    phone,
    generation_id,
    scholarship_id,
    class_id,
    shift_id,
  } = body;
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

module.exports = {
  createStudent,
};
