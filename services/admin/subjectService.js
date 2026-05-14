const Subject = require('../../models/admin/subjectModel');
const { createSubjectSchema, updateSubjectSchema } = require('../../validators/subject');

const getAllSubjects = async () => {
  return await Subject.getAllSubjects();
};

const getSubjectById = async (id) => {
  const rows = await Subject.getSubjectById(id);
  if (rows.length === 0) {
    throw new Error('Subject ID not found');
  }
  return rows[0];
};

const createSubject = async (body) => {
  const { error, value } = createSubjectSchema.validate(body, {
    abortEarly: false,
    allowUnknown: true
  });

  if (error) {
    throw new Error(error.details[0].message);
  }

  const name = value.name;
  const existing = await Subject.findSubjectByName(name);
  if (existing.length > 0) {
    throw new Error('Subject already exists');
  }

  const [result] = await Subject.createSubject({
    name,
    description: value.description || null,
  });

  return result;
};

const updateSubject = async (id, body) => {
    body.name = body.name?.trim();

    const subject = await Subject.checkSubjectIdExist(id);
    if (subject.length === 0) {
        throw new Error('Subject ID not found');
    }

    const existing = await Subject.findSubjectByName(body.name);

    if (existing.length > 0 && existing[0].id != id) {
        throw new Error('Subject name already exists');
    }

    const result = await Subject.updateSubject(id, body);

    return result;
};

const deleteSubject = async (id) => {
  const existing = await Subject.checkSubjectIdExist(id);
  if (existing.length === 0) {
    throw new Error('Subject ID not found');
  }

  const result = await Subject.deleteSubject(id);
  if (result.affectedRows === 0) {
    throw new Error('Subject ID not found');
  }

  return result[0];
};

module.exports = {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
};
