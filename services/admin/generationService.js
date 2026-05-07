const generationService = require('../../models/admin/generation');


const createGeneration = async (body) =>{
    const result = await generationService.createGeneration(body);
    return result;

}




module.exports = {
    createGeneration

}