import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';
import { user } from './auth.schema.js';

/** =========================
 * Product Category Table
 * ========================= */
export const productCategory = sqliteTable('product_category', {
	id: integer().primaryKey({ autoIncrement: true }),
	name: text().notNull().unique(),
	description: text()
});

/** =========================
 * Product Table
 * ========================= */
export const product = sqliteTable('product', {
	id: integer().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	description: text(),
	price: integer().notNull(),
	image: text(),
	quantity: integer().notNull().default(0),
	category: text().notNull(),
	categoryId: integer().references(() => productCategory.id)
});

/** =========================
 * Order Table
 * ========================= */
export const order = sqliteTable('order', {
	id: integer().primaryKey({ autoIncrement: true }),
	userId: integer().notNull().references(() => user.id),
	status: text().notNull().default('pending'),
	total: integer().notNull(),
	createdAt: integer({ mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`)
});

/** =========================
 * Order Detail Table
 * ========================= */
export const orderDetail = sqliteTable('order_detail', {
	id: integer().primaryKey({ autoIncrement: true }),
	orderId: integer().notNull().references(() => order.id),
	productId: integer().notNull().references(() => product.id),
	quantity: integer().notNull().default(1),
	unitPrice: integer().notNull()
});

/** =========================
 * Cart Table
 * ========================= */
export const cart = sqliteTable('cart', {
	id: integer().primaryKey({ autoIncrement: true }),
	userId: integer().notNull().references(() => user.id),
	createdAt: integer({ mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`)
});

/** =========================
 * Cart Item Table
 * ========================= */
export const cartItem = sqliteTable('cart_item', {
	id: integer().primaryKey({ autoIncrement: true }),
	cartId: integer().notNull().references(() => cart.id),
	productId: integer().notNull().references(() => product.id),
	quantity: integer().notNull().default(1)
});

/** =========================
 * Product Review Table
 * ========================= */
export const review = sqliteTable('review', {
	id: integer().primaryKey({ autoIncrement: true }),
	productId: integer().notNull().references(() => product.id),
	userId: integer().notNull().references(() => user.id),
	rating: integer().notNull(),
	comment: text(),
	createdAt: integer({ mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`)
});

/** =========================
 * User Product Interaction
 * ========================= */
export const productInteraction = sqliteTable('product_interaction', {
	id: integer().primaryKey({ autoIncrement: true }),
	userId: integer().notNull().references(() => user.id),
	productId: integer().notNull().references(() => product.id),
	interactionType: text().notNull(),
	createdAt: integer({ mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`)
});

/** =========================
 * Relations
 * ========================= */
export const userRelations = relations(user, ({ many }) => ({ orders: many(order) }));

export const productCategoryRelations = relations(productCategory, ({ many }) => ({
	products: many(product)
}));

export const productRelations = relations(product, ({ many, one }) => ({
	category: one(productCategory, {
		fields: [product.categoryId],
		references: [productCategory.id]
	}),
	orderDetails: many(orderDetail)
}));

export const orderRelations = relations(order, ({ many, one }) => ({
	user: one(user, { fields: [order.userId], references: [user.id] }),
	orderDetails: many(orderDetail)
}));

export const orderDetailRelations = relations(orderDetail, ({ one }) => ({
	product: one(product, { fields: [orderDetail.productId], references: [product.id] }),
	order: one(order, { fields: [orderDetail.orderId], references: [order.id] })
}));

export const cartRelations = relations(cart, ({ many, one }) => ({
	user: one(user, { fields: [cart.userId], references: [user.id] }),
	items: many(cartItem)
}));

export const cartItemRelations = relations(cartItem, ({ one }) => ({
	cart: one(cart, { fields: [cartItem.cartId], references: [cart.id] }),
	product: one(product, { fields: [cartItem.productId], references: [product.id] })
}));

export const reviewRelations = relations(review, ({ one }) => ({
	product: one(product, { fields: [review.productId], references: [product.id] }),
	user: one(user, { fields: [review.userId], references: [user.id] })
}));

export const productInteractionRelations = relations(productInteraction, ({ one }) => ({
	user: one(user, { fields: [productInteraction.userId], references: [user.id] }),
	product: one(product, { fields: [productInteraction.productId], references: [product.id] })
}));

export * from './auth.schema';