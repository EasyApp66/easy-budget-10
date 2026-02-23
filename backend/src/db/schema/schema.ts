import { pgTable, uuid, text, timestamp, decimal } from 'drizzle-orm/pg-core';
import { user } from './auth-schema.js';

export const premiumPurchases = pgTable('premium_purchases', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  purchaseType: text('purchase_type').notNull(), // 'lifetime' or 'monthly'
  amount: decimal('amount', { precision: 10, scale: 2 }),
  currency: text('currency').default('CHF').notNull(),
  purchaseDate: timestamp('purchase_date', { withTimezone: true }).defaultNow().notNull(),
  expiryDate: timestamp('expiry_date', { withTimezone: true }),
  appleTransactionId: text('apple_transaction_id').unique(),
  status: text('status').notNull(), // 'active', 'expired', 'cancelled'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
