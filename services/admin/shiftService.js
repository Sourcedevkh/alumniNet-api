const Shift = require('../../models/admin/shift');

const getShift = async () => {
    const result = await  Shift.getShift();
    if(result.length === 0){
        throw new Error('Shift not found');
    }
    return result;
}

const create = async (body) => {
    let {name} = body;
    const allowedShifts = [1, 2, 3];
    if (!allowedShifts.includes(Number(name))) {
        throw new Error('Shift name must be 1, 2, or 3');
    }
    let checkShift = await Shift.getShiftByName(name);
    if(checkShift){
        throw new Error('Shift already exists');
    }
    const result = await Shift.create(body);
    if(!result){
        throw new Error('Failed to create shift');
    }
    return result;
}

const update = async (id, body) => {
    const existingShift = await Shift.getShiftId(id);
    if (!existingShift) {
        throw new Error('Shift not found');
    }

    const { name } = body;
    const allowedShifts = [1, 2, 3];
    if (!allowedShifts.includes(Number(name))) {
        throw new Error('Shift name must be 1, 2, or 3');
    }

    const normalizedName = Number(name);
    if (Number(existingShift.name) !== normalizedName) {
        const duplicateShift = await Shift.getShiftByName(normalizedName);
        if (duplicateShift && Number(duplicateShift.id) !== Number(id)) {
            throw new Error('Shift already exists');
        }
    }

    const result = await Shift.update(id, { name: normalizedName });
    if (!result) {
        throw new Error('Failed to update shift');
    }

    return result;
}

const remove = async (id) => {
    const existingShift = await Shift.getShiftId(id);
    if (!existingShift) {
        throw new Error('Shift not found');
    }

    const result = await Shift.remove(id);
    if (!result) {
        throw new Error('Failed to delete shift');
    }

    return result;
}

module.exports = {
    getShift,
    create,
    update,
    remove
}