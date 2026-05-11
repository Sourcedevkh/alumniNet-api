const generationModel = require("../../models/admin/generation");
const { createGenerationSchema } = require("../../validators/generation");

// ==== get all generation
const getAllGeneration = async () => {
    const result = await generationModel.getAllGenerations();
    return result;
}

// ======== Create
const createGeneration = async (body) => {
    let { name, start_year, end_year, intake_month } = body;

    if (Number(body.start_year) > Number(body.end_year)) {
        const error = new Error("ឆ្នាំចាប់ផ្តើមមិនអាចធំជាងឆ្នាំបញ្ចប់ទេ!");
        error.status = 400;
        throw error;
    }

    const isDuplicate = await generationModel.checkDuplicateName(name);
    if (isDuplicate) {
        const error = new Error("Generation name already exists!");
        error.status = 400;
        throw error;
    }

    if (intake_month !== undefined) {
        const totalMonths = parseInt(intake_month);
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;

        let durationText = "";
        if (years > 0) durationText += `${years} Year${years > 1 ? "s" : ""}`;
        if (months > 0) durationText += `${years > 0 ? " " : ""}${months} Month${months > 1 ? "s" : ""}`;
        if (years === 0 && months === 0) durationText = "0 Month";

        body.intake_month = durationText;

        body.end_year = parseInt(start_year) + years;
    }


    const result = await generationModel.createGeneration(body);
    return result;
};

// ====== find by id
const findGenerationByid = async (id) => {
    const result = await generationModel.findGenerationByid(id);

    if (!result) {
        throw new Error("Generation not found");
    }

    return result;

};

// ========= update
const updateGeneration = async (id, body) => {
    let { intake_month, start_year } = body;

    if (intake_month !== undefined) {
        const years = Math.floor(intake_month / 12);
        const months = intake_month % 12;

        let durationText = "";
        if (years > 0) {
            durationText += `${years} Year${years > 1 ? "s" : ""}`;
        }
        if (months > 0) {
            durationText += `${years > 0 ? " " : ""}${months} Month${months > 1 ? "s" : ""}`;
        }
        if (years === 0 && months === 0) {
            durationText = "0 Month";
        }

        body.intake_month = durationText;

        if (start_year) {
            body.end_year = parseInt(start_year) + years;
        }
    }

    const result = await generationModel.updateGeneration(id, body);

    if (!result) {
        throw new Error("Generation not found");
    }

    return result;
};

// ====== delete
const deleteGeneration = async (id) => {
    const result = await generationModel.deleteGeneration(id);

    if(result.affectedRows === 0) {
        throw new Error("Generation not found or already deleted");
    }

};

module.exports = {
    getAllGeneration,
    createGeneration,
    findGenerationByid,
    updateGeneration,
    deleteGeneration,
};
