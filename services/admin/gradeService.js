const gradeModel = require('../../models/admin/grade');

const createGrade = async (body) => {

    let existing = await gradeModel.checkStudentIdExists(body.student_id);
    if(existing.length === 0){
        throw new Error('Student id not found');
    }

    let checkID = await gradeModel.getGradeById(body.student_id);
    if(checkID){
        throw new Error('Grade for this student already exists');
    }

    let result = await gradeModel.createGrade(body);
    return result;


};

const getAllGrades = async () => {
    let result = await gradeModel.getAllGrades();
    
    return result;
}

const updateGrade = async (id, body) => {

    let existing = await gradeModel.checkStudentIdExists(body.student_id);
    if(existing.length === 0){
        throw new Error('Student id not found');
    }

    await gradeModel.updateGrade(id, body);
    return await gradeModel.getGradeById(id);
}

const deleteGrade = async (id) => {
    let existing = await gradeModel.getGradeById(id);
    if(!existing){
        throw new Error('Grade id not found');
    }
    let result = await gradeModel.deleteGrade(id);
    return result[0];
}

const getGradeById = async (id) => {
    let result = await gradeModel.getGradeById(id);
    if(!result){
        throw new Error('Grade id not found');
    }
    return result;
}

module.exports = {
   createGrade,
   getAllGrades,
   updateGrade,
   deleteGrade,
   getGradeById 

};