const generationModel = require("../../models/admin/generation");
const { createGenerationSchema } = require("../../validators/generation");

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

module.exports = {
    createGeneration,
};
