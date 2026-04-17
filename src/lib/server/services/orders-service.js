import { ordersDataAccess } from '../data-access/orders-data-access.js';
import { cartDataAccess } from '../data-access/cart-data-access.js';
import { notifyOrderCreated } from '../notifications/order-notifications.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';

import { insertOrderSchema, updateOrderSchema, deleteOrderSchema } from '../db/validation.js';


// The Service Layer performs validation, permission checks,

// and applies domain rules before database operations occur.

export const ordersService = {


    /** Get order by ID */

    async getOrderById(id) {

        const order = await ordersDataAccess.findById(id);

        if (!order) throw new NotFoundError('Order not found');

        return order;

    },
    
    async getOrderDetails(orderId) {

        return await ordersDataAccess.findDetailsWithProductsByOrderId(orderId);

    },

    /** Get all orders */

    async getAllOrders() {

        return await ordersDataAccess.findAll();

    },

    /** Get orders for one user */
    async getOrdersByUserId(userId) {
        return await ordersDataAccess.findByUserId(userId);
    },

    /** Get an order with its details */

    async getOrderWithDetails(id) {

        const order = await ordersDataAccess.findById(id);

        if (!order) throw new NotFoundError('Order not found');

        const details = await ordersDataAccess.findDetailsWithProductsByOrderId(id);

        return { order, details };

    },
    
        /** Create a new order */
    async createOrderFromCart(user) {

        const userId = Number(user.id);
        if (!Number.isInteger(userId) || userId < 1) {
        throw new Error('Invalid user ID');
        }

        // Get the cart and its items
        const cart = await cartDataAccess.getOrCreateCart(userId);
        const items = await cartDataAccess.getCartItems(cart.id);

        // Check to ensure cart is not empty
        if (!items.length) {
        throw new Error('Cart is empty');
        }

        // dynamically create the total for the order
        const total = items.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0);

        const orderData = {userId: userId, status: 'pending', total: total};
        const validatedOrder = insertOrderSchema.parse(orderData);
        const order = await ordersDataAccess.createFromCart(validatedOrder, items);

        await cartDataAccess.clearCart(cart.id);
        // Send email - if it fails to send, the function will continue (non blocking)
            notifyOrderCreated({ order, user }).catch(err => {
                console.error('Order created but email failed', err);
            });
            
            return order;
    },



    /** Update an order */

    async updateOrder(id, orderData) {

        console.log('IN updateOrder >>>>>>');

        const validated = updateOrderSchema.parse(orderData);


        const updatedOrder = await ordersDataAccess.update(id, validated);

        if (!updatedOrder) throw new NotFoundError('Order not found after update');


        return updatedOrder;

    },

    /** Delete an order */

    async deleteOrder(id) {

        console.log('IN deleteOrder >>>>>>', id);

        const validated = deleteOrderSchema.parse({ id });


        const deleted = await ordersDataAccess.delete(validated.id);

        if (!deleted) throw new NotFoundError('Order not found to delete');


        return deleted;

    }

};