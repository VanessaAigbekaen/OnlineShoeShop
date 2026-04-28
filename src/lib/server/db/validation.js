import { z } from 'zod';
import { user, productCategory, product, productReview, order, orderDetail } from './schema';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';

// =========================
// User Schemas
// =========================
export const registerAuthSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Must be a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    dob: z.string().nullable().optional()
});

export const updateProfileSchema = z.object({
    name: z.string().min(2).optional(),
    dob: z.string().nullable().optional(),
    role: z.string().optional(),
    image: z.string().optional()
});

export const idSchema = z.object({
    id: z.number().int().positive()
});

export const deleteUserSchema = z.object({
    id: z.number().int().positive()
});

export const updateUserSchema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
	dob: z.string().optional(),
	role: z.string().optional()
});

// =========================
// Product Category Schemas
// =========================
export const insertCategorySchema = z.object({
    name: z.string().min(2, 'Category name is required'),
    description: z.string().optional()
});

export const updateCategorySchema = insertCategorySchema.partial();

export const deleteCategorySchema = z.object({
    id: z.number().int().positive()
});

// =========================
// Product Schemas
// =========================
export const insertProductSchema = z.object({
    name: z.string().min(2, 'Product name is required'),
    description: z.string().optional(),
    price: z.number().int().min(1, 'Price must be at least 1 cent'),
    image: z.string().optional(),
    quantity: z.number().int().min(0, 'Quantity cannot be negative'),
    categoryId: z.number().nullable().optional()
});

export const updateProductSchema = insertProductSchema.partial();

export const deleteProductSchema = z.object({
    id: z.number().int().positive()
});

// =========================
// Order Schemas
// =========================
export const insertOrderSchema = z.object({
    userId: z.number().int().min(1, 'User ID is required'),
    status: z.string().default('pending'),
    total: z.number().int().min(0, 'Total cannot be negative')
});

export const updateOrderSchema = insertOrderSchema.partial();

export const deleteOrderSchema = z.object({
    id: z.number().int().positive()
});

// =========================
// Order Detail Schemas
// =========================
export const insertOrderDetailSchema = z.object({
    orderId: z.number().int().min(1, 'Order ID is required'),
    productId: z.number().int().min(1, 'Product ID is required'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    unitPrice: z.number().int().min(1, 'Unit price is required')
});

export const updateOrderDetailSchema = insertOrderDetailSchema.partial();

export const deleteOrderDetailSchema = z.object({
    id: z.number().int().positive()
});

// =========================
// Admin Schemas
// =========================

export const adminInsertUserSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Must be a valid email'),
    dob: z.string().nullable().optional(),
    role: z.string().optional()
});

/** =========================
 * Product Review Schemas
 * ========================= */
export const selectProductReviewSchema = createSelectSchema(productReview);

export const insertProductReviewSchema = createInsertSchema(productReview, {
  productId: z.number().int().min(1, 'Product ID is required'),
  userId: z.number().int().min(1, 'User ID is required'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().max(1000, 'Comment must be 1000 characters or less').nullable().optional()
});

export const updateProductReviewSchema = insertProductReviewSchema
  .partial()
  .omit({
    id: true,
    productId: true,
    userId: true,
    createdAt: true
  });

export const deleteProductReviewSchema = z.object({
    id: z.number().int().positive()
});