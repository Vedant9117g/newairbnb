const Joi = require('joi');

module.exports.listingsSchema = Joi.object({
<<<<<<< HEAD
    listing: Joi.object({
=======
        listing: Joi.object({
>>>>>>> a184392624898e4e81bb75463bd15d7e5bf611e1
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object({
            url: Joi.string().uri().optional(),
        }).optional(),
    }).required(),
});
<<<<<<< HEAD



module.exports.reviewsSchema = Joi.object({

    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        content: Joi.string().required(),
    }).required(),

});
=======
>>>>>>> a184392624898e4e81bb75463bd15d7e5bf611e1
