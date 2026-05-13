const { pool } = require('../../config/db');
const Scholarship = require('../../models/admin/scholarship');
const {
    scholarshipCreateSchema,
    scholarshipUpdateSchema,
} = require('../../validators/scholarship');

const getScholarships = async () => {
    let rows = await Scholarship.getScholar_types();

    return rows;
}

const createScholarshipType = async (body) => {

    let name = body.name.trim();
    let existing = await Scholarship.findScholarshipTypeByName(name);
    if (existing.length > 0) {
        throw new Error('Scholarship type already exists');
    }

    let result = await Scholarship.createScholarshipType({ name });
    return result;
}


const updateScholarshipType = async (id, body) => {
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
    let checkId = await Scholarship.getScholarshipTypeById(id);
    if (checkId.length === 0) {
        throw new Error('Scholarship type ID not found');
    }
    let result = await Scholarship.deleteScholarshipType(id);
    return result[0];
}


const createScholarshipSubject = async (body) => {
    let { name, type_id } = body;
     name = name.trim();
    if (name === '') {
        throw new Error('Scholarship subject name cannot be empty');
    }

    let existing = await Scholarship.findScholarshipSubjectByName(name);
    if (existing.length > 0) {
        throw new Error('Scholarship subject name already exists');
    }

    const existingScholarship = await Scholarship.findScholarshipByName(name);
    if (existingScholarship.length > 0) {
        throw new Error('Scholarship name already exists');
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

    let result = await Scholarship.deleteScholarshipSubject(id)
    if (result.affectedRows === 0) {
        throw new Error('Scholarship subject ID not found');
    }
    return result[0];
}


const createScholarshipTrack = async (body) => {

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

    let subjectType = await Scholarship.checkScholarshipTypeIdExist(body.subtype_id);
    if(subjectType.length === 0) {
        throw new Error('Scholarship subject type ID not found');
    }

    let existing = await Scholarship.findScholarshipByName(body.name);
    if(existing.length > 0) {
        throw new Error('Scholarship track name already exists');
    }

    let result = await Scholarship.updateScholarshipTrack(id, body);
    if(result.length === 0) {
        throw new Error('Scholarship track ID not found');
    }
    return result;
}

const deleteScholarshipTrack = async (id) => {
    let result = await Scholarship.deleteScholarshipTrack(id);
    if(result.affectedRows === 0) {
        throw new Error('Scholarship track ID not found');
    }
    return result[0];
}

const getAllScholarshipsWithSubjects = async () => {
    const scholarships = await Scholarship.getAllScholarships();
    const scholarshipIds = scholarships.map((item) => item.id);

    if (scholarshipIds.length === 0) {
        return [];
    }

    const subjectRows = await Scholarship.getScholarshipSubjectsBatch(scholarshipIds);
    const subjectsByScholarship = {};

    subjectRows.forEach((row) => {
        subjectsByScholarship[row.scholarship_id] = subjectsByScholarship[row.scholarship_id] || [];
        subjectsByScholarship[row.scholarship_id].push({
            subject_id: row.subject_id,
            subject_name: row.subject_name,
        });
    });

    return scholarships.map((scholarship) => ({
        ...scholarship,
        subjects: subjectsByScholarship[scholarship.id] || [],
    }));
};

const getScholarshipDetails = async (id) => {
    const scholarships = await Scholarship.getScholarshipById(id);
    if (scholarships.length === 0) {
        throw new Error('Scholarship ID not found');
    }

    const subjects = await Scholarship.getScholarshipSubjects(id);
    return {
        ...scholarships[0],
        subjects,
    };
};

const createScholarshipWithSubjects = async (body) => {
    const { error, value } = scholarshipCreateSchema.validate(body, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        throw new Error(error.details[0].message);
    }

    body = value;
    const name = body.name.trim();

    const existing = await Scholarship.findScholarshipByName(name);
    if (existing.length > 0) {
        throw new Error('Scholarship name already exists');
    }

    if (body.type_id) {
        const typeExists = await Scholarship.checkTypeIdExist(body.type_id);
        if (typeExists.length === 0) {
            throw new Error('Scholarship type ID not found');
        }
    }

    if (body.subtype_id) {
        const subtypeExists = await Scholarship.checkScholarshipTypeIdExist(body.subtype_id);
        if (subtypeExists.length === 0) {
            throw new Error('Scholarship subtype ID not found');
        }
    }

    if (body.track_id) {
        const trackExists = await Scholarship.checkScholarshipTrackIdExist(body.track_id);
        if (trackExists.length === 0) {
            throw new Error('Scholarship track ID not found');
        }
    }

    const subjectIds = Array.isArray(body.subjectIds) ? [...new Set(body.subjectIds.map(Number))] : [];
    if (subjectIds.length > 0) {
        const existingIds = await Scholarship.checkSubjectIdsExist(subjectIds);
        if (existingIds.length !== subjectIds.length) {
            throw new Error('One or more subject IDs are invalid');
        }
    }

    const scholarshipId = await Scholarship.createScholarship({
        name,
        description: body.description ? body.description.trim() : null,
        type_id: body.type_id || null,
        subtype_id: body.subtype_id || null,
        track_id: body.track_id || null,
    });

    if (subjectIds.length > 0) {
        await Scholarship.addScholarshipSubjects(scholarshipId, subjectIds);
    }

    return getScholarshipDetails(scholarshipId);
};

const updateScholarshipWithSubjects = async (id, body) => {
    const { error, value } = scholarshipUpdateSchema.validate(body, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        throw new Error(error.details[0].message);
    }

    body = value;
    const scholarshipExists = await Scholarship.checkScholarshipIdExist(id);
    if (scholarshipExists.length === 0) {
        throw new Error('Scholarship ID not found');
    }

    if (body.name !== undefined && String(body.name).trim() === '') {
        throw new Error('Name cannot be empty');
    }

    if (body.name !== undefined) {
        const existing = await Scholarship.findScholarshipByName(body.name.trim());
        if (existing.length > 0 && existing[0].id !== parseInt(id)) {
            throw new Error('Scholarship name already exists');
        }
    }

    if (body.type_id !== undefined) {
        const typeExists = await Scholarship.checkTypeIdExist(body.type_id);
        if (typeExists.length === 0) {
            throw new Error('Scholarship type ID not found');
        }
    }

    if (body.subtype_id !== undefined) {
        const subtypeExists = await Scholarship.checkScholarshipTypeIdExist(body.subtype_id);
        if (subtypeExists.length === 0) {
            throw new Error('Scholarship subtype ID not found');
        }
    }

    if (body.track_id !== undefined) {
        const trackExists = await Scholarship.checkScholarshipTrackIdExist(body.track_id);
        if (trackExists.length === 0) {
            throw new Error('Scholarship track ID not found');
        }
    }

    const subjectIds = Array.isArray(body.subjectIds) ? [...new Set(body.subjectIds.map(Number))] : null;
    if (subjectIds !== null) {
        const existingIds = await Scholarship.checkSubjectIdsExist(subjectIds);
        if (existingIds.length !== subjectIds.length) {
            throw new Error('One or more subject IDs are invalid');
        }
    }

    await Scholarship.updateScholarship(id, {
        name: body.name !== undefined ? body.name.trim() : undefined,
        description: body.description !== undefined ? body.description.trim() : undefined,
        type_id: body.type_id !== undefined ? body.type_id : undefined,
        subtype_id: body.subtype_id !== undefined ? body.subtype_id : undefined,
        track_id: body.track_id !== undefined ? body.track_id : undefined,
    });

    if (subjectIds !== null) {
        await Scholarship.deleteScholarshipSubjects(id);
        await Scholarship.addScholarshipSubjects(id, subjectIds);
    }

    return getScholarshipDetails(id);
};

const deleteScholarshipEntry = async (id) => {
    const scholarshipExists = await Scholarship.checkScholarshipIdExist(id);
    if (scholarshipExists.length === 0) {
        throw new Error('Scholarship ID not found');
    }

    await Scholarship.deleteScholarshipSubjects(id);
    const result = await Scholarship.deleteScholarship(id);

    if (result.affectedRows === 0) {
        throw new Error('Scholarship ID not found');
    }

    return { id: Number(id) };
};

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
    deleteScholarshipTrack,
    getAllScholarshipsWithSubjects,
    getScholarshipDetails,
    createScholarshipWithSubjects,
    updateScholarshipWithSubjects,
    deleteScholarshipEntry
}