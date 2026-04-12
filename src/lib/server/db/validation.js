import { z } from 'zod';

// =========================
// User Schemas
// =========================
export const insertUserSchema = z.object({
    username: z.string().min(2, 'Username must be at least 2 characters'),
    passwordHash: z.string().min(1, 'Password is required'),
    firstname: z.string().min(1, 'First name is required'),
    surname: z.string().min(1, 'Surname is required'),
    email: z.string().email('Must be a valid email'),
    dob: z.string().min(1, 'Date of birth is required'),
    role: z.string().default('user')
});

export const updateUserSchema = insertUserSchema.partial();

export const deleteUserSchema = z.object({
    id: z.number().int().positive()
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
    categoryId: z.number().int().min(1, 'Category is required')
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