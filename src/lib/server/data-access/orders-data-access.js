import { db } from '../db/index.js';
import { order, orderDetail, product } from '../db/schema.js';
import { eq,sql } from 'drizzle-orm';


export const ordersDataAccess = {
    /** Find an order by its ID */
    async findById(id) {
        const result = await db.select().from(order).where(eq(order.id, id)).limit(1);
        return result[0] ?? null;
    },


    /** Get all orders */

    async findAll() {

        return await db.select().from(order);

    },

    /** Get orders by user ID */
    async findByUserId(userId) {
        return await db.select().from(order).where(eq(order.userId, userId));
    },


    /** Get order details + product info by orderId */

    async findDetailsWithProductsByOrderId(orderId) {

        return await db
            .select({
                id: orderDetail.id,
                orderId: orderDetail.orderId,
                productId: orderDetail.productId,
                quantity: orderDetail.quantity,
                unitPrice: orderDetail.unitPrice,
                productName: product.name
            })
            .from(orderDetail)
            .innerJoin(product, eq(orderDetail.productId, product.id))
            .where(eq(orderDetail.orderId, orderId));

    },


    /** Create a new order (with details) */

    async create(orderData, items) {

        return await db.transaction(async (tx) => {

            const orderResult = await tx.insert(order).values(orderData).returning();

            const newOrder = orderResult[0];


            if (items?.length)

                await tx.insert(orderDetail).values(
                    items.map(i => ({ ...i, orderId: newOrder.id }))
                );


            return newOrder;

        });

    },


    /** Update an existing order */

    async update(id, orderData) {

        const result = await db.update(order).set(orderData).where(eq(order.id, id)).returning();

        console.log("Updated order >>>>>>>", result[0]);

        return result[0];

    },
    
    /** Create order + details + reduce stock (transaction) */
    async createFromCart(orderData, items) {
        return await db.transaction(async (tx) => {

        // 1. Verify stock
        for (const item of items) {
            const result = await tx
            .select()
            .from(product)
            .where(eq(product.id, item.productId))
            .limit(1);

            const dbProduct = result[0];

            if (!dbProduct || dbProduct.quantity < item.quantity) {
            throw new Error(`Not enough stock for ${item.name}`);
            }
        }

        // 2. Reduce stock - sql\`` → tells Drizzle to generate raw SQL - Prevents race conditions inside the transaction
        for (const item of items) {
            await tx
            .update(product)
            .set({ quantity: sql`${product.quantity} - ${item.quantity}` })
            .where(eq(product.id, item.productId));
        }

        // 3. Create order
        const orderResult = await tx
            .insert(order)
            .values(orderData)
            .returning();

        const newOrder = orderResult[0];

        // 4️. Create order details
        await tx.insert(orderDetail).values(
            items.map(i => ({
            orderId: newOrder.id,
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: i.unitPrice
            }))
        );

        return newOrder;
        });
    },


    /** Delete an order */

    async delete(id) {
        const result = await db.delete(order).where(eq(order.id, id));
        return result.rowsAffected > 0;
    }, 

    async findByIdWithDetails(orderId) {
        return db.query.order.findFirst({
            where: (order, { eq }) => eq(order.id, orderId),
            with: {
                items: true,
                user: true
            }
        });
    }
};