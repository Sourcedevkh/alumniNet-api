const { pool } = require('../../config/db');
const Scholarship = require('../../models/admin/scholarship');

const getScholarships = async () => {
    let rows = await Scholarship.getScholar_types();

    return rows;
}

const createScholarshipType = async (body) => {

    if (!body.name) {
        throw new Error('Name is required');
    }
    let name = body.name.trim();
    let existing = await Scholarship.findScholarshipTypeByName(name);
    if (existing.length > 0) {
        throw new Error('Scholarship type already exists');
    }

    let result = await Scholarship.createScholarshipType({ name });
    return result;
}


const updateScholarshipType = async (id, body) => {
    if (!body.name) {
        throw new Error ('Name is required');
    }
    if (body.name.trim() === '') {
        throw new Error('Name Scholarship not found');
    }
    let name = body.name.trim();
    let existing = await Scholarship.findScholarshipTypeByName(name);
    if (existing.length > 0 && existing[0].id !== parseInt(id)) {
        throw new Error('Scholarship type already exists');
    }
    let result = await Scholarship.updateScholarshipType(id, { name });

    if (result.length === 0) {
        throw new Error('Scholarship type ID not found');
    }
    return result;
}

const deleteScholarshipType = async (id) => {
    let result = await Scholarship.deleteScholarshipType(id);
    if (result.length === 0) {
        throw new Error('Scholarship type ID not found');
    }
    return result[0];
}


const createScholarshipSubject = async (body) => {
    let { name, type_id } = body;
    if (!name || !type_id) {
        throw new Error('Name and type_id are required');
    }

     name = name.trim();
    if (name === '') {
        throw new Error('Scholarship subject name cannot be empty');
    }
    let type = await Scholarship.checkTypeIdExist(type_id);
    if (type.length === 0) {
        throw new Error('Scholarship type ID not found');
    }

    let result = await Scholarship.createScholarshipSubject({name,type_id});
    return {
        id: result.insertId,
        name,
        type_id
    };
};

const getAllScholarshipSubjects = async () => {
    let rows = await Scholarship.getAllScholarshipSubjects();
    
    return rows;
}

const updateScholarshipSubject = async (id, body) => {
    if(!body.name || !body.type_id){
        throw new Error('Name and type_id are required');
    }

    let type = await Scholarship.checkTypeIdExist(body.type_id);
    if(type.length === 0){
        throw new Error('Scholarship type ID not found');
    }

    let result = await Scholarship.updateScholarshipSubject(id, body);
    if(result.length === 0){
        throw new Error('Scholarship subject ID not found');
    }
    return result;
}

const deleteScholarshipSubject = async (id) => {
    if(!id) {
        throw new Error('Scholarship subject ID is required');
    }

    let result = await Scholarship.deleteScholarshipSubject(id)
    if (result.affectedRows === 0) {
        throw new Error('Scholarship subject ID not found');
    }
    return result[0];
}


const createScholarshipTrack = async (body) => {
    if(!body.subtype_id || !body.name){
        throw new Error('subtype_id and name are required');
    }

    let subjectType = await Scholarship.checkTypeIdExist(body.subtype_id);
    if(subjectType.length === 0) {
        throw new Error('Scholarship subject type ID not found');
    }

    let existing = await Scholarship.findScholarshipTrackByName(body.name);
    if(existing.length > 0) {
        throw new Error('Scholarship track name already exists');
    }
    let result = await Scholarship.createScholarshipTrack(body);
    return result;

}
const getAllScholarshipTracks = async () => {
    let rows = await Scholarship.getAllScholarshipTracks();
    return rows;
}

const updateScholarshipTrack = async (id, body) => {
    if(!body.subtype_id || !body.name){
        throw new Error('subtype_id and name are required');
    }

    let subjectType = await Scholarship.checkScholarshipTypeIdExist(body.subtype_id);
    if(subjectType.length === 0) {
        throw new Error('Scholarship subject type ID not found');
    }

    let existing = await Scholarship.findScholarshipTypeByName(body.name);
    if(existing.length > 0) {
        throw new Error('Scholarship track name already exists');
    }

    let result = await Scholarship.updateScholarshipTrack(id, body);
    if(result.length === 0) {
        throw new Error('Scholarship track ID not found');
    }
    return result;
}



const deleteScholarshipTrack = async (id, body) => {
    let result = await Scholarship.deleteScholarshipTrack(id);
    if(result.affectedRows === 0) {
        throw new Error('Scholarship track ID not found');
    }
    return result[0];
}
module.exports = {
    getScholarships,
    createScholarshipType,
    updateScholarshipType,
    deleteScholarshipType,
    createScholarshipSubject,
    getAllScholarshipSubjects,
    updateScholarshipSubject,
    deleteScholarshipSubject,
    createScholarshipTrack,
    getAllScholarshipTracks,
    updateScholarshipTrack,
    deleteScholarshipTrack
}