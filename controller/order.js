import orderModel from "../models/order.js";

// הוספת הזמנה
export const addOrder = async (req, res) => {
    const { date, deliveryDate, address, products, dispatched } = req.body;
    let customerCode = req.user._id;
    try {
        let newOrder = new orderModel({
            date,
            deliveryDate,
            address,
            customerCode,
            products,
            dispatched
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// מחיקת הזמנה
export const deleteOrder = async (req, res) => {
    const orderId = req.params.orderId;
    const user = req.user; // Assuming req.user contains the authenticated user information

    try {
        // Check if the order exists
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the order belongs to the authenticated user
        if (order.customerCode !== user._id) {
            return res.status(403).json({ message: 'You are not authorized to delete this order' });
        }

        // Check if the order is not yet dispatched
        if (order.dispatched) {
            return res.status(403).json({ message: 'Cannot delete a dispatched order' });
        }

        // Delete the order
        await orderModel.findByIdAndDelete(orderId);
        res.send("Order deleted successfully");
    } catch (error) {
        res.status(400).send(error.message);
    }
};


// שליפת כל ההזמנות של משתמש מסויים
export const getUserOrders = async (req, res) => {
    const userId = req.params.userId;

    try {
        const userOrders = await orderModel.find({ customerCode: userId });
        res.json(userOrders);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// עדכון הזמנה שבוצעה
export const updateOrder = async (req, res) => {
    const orderId = req.params.orderId;
    const { date, deliveryDate, address, products, dispatched } = req.body;

    try {
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).send("Order not found");
        }

        order.date = date;
        order.deliveryDate = deliveryDate;
        order.address = address;
        order.products = products;
        order.dispatched = dispatched;

        await order.save();
        res.json(order);
    } catch (err) {
        res.status(400).send(err.message);
    }
};
export const updateOrderAfterDispatch = async (req, res) => {
    const orderId = req.params.orderId;
    try {
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).send("Order not found");
        }
        order.dispatched = true;
        await order.save();
        res.json(order);
    } catch (err) {
        res.status(400).send(err.message);
    }
};
