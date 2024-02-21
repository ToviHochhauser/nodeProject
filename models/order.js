import Joi from "joi";
import mongoose from "mongoose";

const minimalProductSchema = mongoose.Schema({
    bookId: mongoose.Schema.Types.ObjectId,
    quantity: Number,
});

const orderSchema = mongoose.Schema({
    date: Date,
    deliveryDate: Date,
    address: String,
    customerCode: String,
    products: [minimalProductSchema],
    dispatched: Boolean,

});

const orderModel = mongoose.model("orders", orderSchema);

export const orderValidation = (order) => {
    const schema = Joi.object({
        deliveryDate: Joi.date().required(),
        address: Joi.string().required(),
        customerCode: Joi.string().required(),
        products: Joi.array().items(Joi.object({
            bookId: Joi.string().required(),
            quantity: Joi.number().integer().min(1).required()
        })).required(),
        dispatched: Joi.boolean().optional().default(false)
    });
    return schema.validate(order);
};

export default orderModel;