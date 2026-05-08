const Class = require('../../models/admin/classes');

const findById = async (id) => {
    let data = await Class.findById(id);
    if(data.length === 0) throw new Error('Class not found');
    return data[0];
}

const createClasses = async (data) => {
    let existClass = await Class.findByName(data.name);
    if(existClass.length > 0) throw new Error(`Class name ${data.name} already exists`);

    const resultId = await Class.create(data);
    if(!resultId) throw new Error("Failed to create class");
    return resultId;
}

const getClassWithRoster = async (id) => {
    const data = await Class.getClassbyId(id);
    if (!data) throw new Error('Class not found');
    return data;
};

const getAllClasses = async () => {
    const classes = await Class.getAllClasses();

    // Set value of Shift
    const formatShift = (val) => {
        const shifts = { 0: "Morning", 1: "Afternoon", 2: "Evening" };
        return shifts[val] || "Not Set";
    };

    return classes.map(item => ({
        id: item.id,
        name: item.class_name,
        description: item.description,
        studentCount: item.student_count || 0, 
        metadata: {
            generation: item.generation_name,
            shift: formatShift(item.shift_value),
            scholarship: item.scholarship_name
        },
        createdAt: item.created_at
    }));
};


const updateClass = async (id, data) => {
    let existClass = await Class.findById(id);
    if(existClass.length === 0) throw new Error('Class not found');

    if(data.name && data.name !== existClass[0].name) {
        let nameExist = await Class.findByName(data.name);
        if(nameExist.length > 0) throw new Error(`Class name ${data.name} already exists`);
    }
    const isUpdated = await Class.update(id, data);
    if(!isUpdated) throw new Error('Failed to update class');
    return true;
}

module.exports = { 
    findById, 
    createClasses, 
    getClassWithRoster, 
    getAllClasses, 
    updateClass 
};