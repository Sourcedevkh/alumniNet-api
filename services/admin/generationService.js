const generationModel = require("../../models/admin/generation");
const { createGenerationSchema } = require("../../validators/generation");

// ======== Create
const createGeneration = async (body) => {
    const { error, value } = createGenerationSchema.validate(body, {
        abortEarly: false,
    });
    if (error) {
        const errors = error.details.map((err) => err.message);
        throw new Error(errors.join(", "));
    }

    let { start_year, intake_month } = value;

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

    const calculatedEndYear = start_year + years;

    const finalData = {
        ...value,
        intake_month: durationText,
        end_year: calculatedEndYear,
    };

    const result = await generationModel.createGeneration(finalData);
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
    createGeneration,
    findGenerationByid,
    updateGeneration,
    deleteGeneration,
};
