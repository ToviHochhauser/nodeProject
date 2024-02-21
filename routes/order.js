import express from 'express';
import {
    addOrder,
    deleteOrder,
    getUserOrders,
    updateOrder,
    updateOrderAfterDispatch
} from "../controller/order.js";
import { auth,authForManager } from '../middleWares/auth.js';
const router = express.Router();

// Route to add a new order
router.post('/',auth, addOrder);

// Route to delete an order by its ID
router.delete('/:orderId',auth, deleteOrder);

// Route to get all orders for a specific user
router.get('/user/:userId',auth, getUserOrders);

// Route to update an existing order by its ID
router.put('/:orderId',auth, updateOrder);
router.put("/:orderId",authForManager,updateOrderAfterDispatch);
export default router;
