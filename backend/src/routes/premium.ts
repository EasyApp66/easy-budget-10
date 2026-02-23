import type { FastifyRequest, FastifyReply } from 'fastify';
import { eq, and, desc } from 'drizzle-orm';
import * as schema from '../db/schema/schema.js';
import type { App } from '../index.js';

interface PurchaseBody {
  purchaseType: 'lifetime' | 'monthly';
  appleTransactionId?: string;
}

interface VerifyCodeBody {
  code: string;
}

export function registerPremiumRoutes(app: App) {
  const requireAuth = app.requireAuth();

  // POST /api/premium/purchase - Create a premium purchase
  app.fastify.post('/api/premium/purchase', {
    schema: {
      description: 'Create a premium purchase for the authenticated user',
      tags: ['premium'],
      body: {
        type: 'object',
        required: ['purchaseType'],
        properties: {
          purchaseType: { type: 'string', enum: ['lifetime', 'monthly'] },
          appleTransactionId: { type: 'string' },
        },
      },
      response: {
        201: {
          description: 'Premium purchase created successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            purchase: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                purchaseType: { type: 'string' },
                expiryDate: { type: ['string', 'null'], format: 'date-time' },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  }, async (
    request: FastifyRequest<{ Body: PurchaseBody }>,
    reply: FastifyReply
  ): Promise<{ success: boolean; purchase: any }> => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    const { purchaseType, appleTransactionId } = request.body;
    const userId = session.user.id;

    app.logger.info(
      { userId, purchaseType, appleTransactionId },
      'Creating premium purchase'
    );

    try {
      let expiryDate: Date | null = null;
      if (purchaseType === 'monthly') {
        expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
      }

      const purchase = await app.db.insert(schema.premiumPurchases).values({
        userId,
        purchaseType,
        appleTransactionId,
        status: 'active',
        purchaseDate: new Date(),
        expiryDate,
        currency: 'CHF',
      }).returning();

      app.logger.info(
        { purchaseId: purchase[0].id, purchaseType },
        'Premium purchase created successfully'
      );

      reply.status(201);
      return {
        success: true,
        purchase: {
          id: purchase[0].id,
          purchaseType: purchase[0].purchaseType,
          expiryDate: purchase[0].expiryDate,
        },
      };
    } catch (error) {
      app.logger.error(
        { err: error, userId, purchaseType },
        'Failed to create premium purchase'
      );
      throw error;
    }
  });

  // GET /api/premium/status - Get premium status for user
  app.fastify.get('/api/premium/status', {
    schema: {
      description: 'Get current premium status for authenticated user',
      tags: ['premium'],
      response: {
        200: {
          description: 'Premium status retrieved successfully',
          type: 'object',
          properties: {
            isPremium: { type: 'boolean' },
            type: { type: 'string', enum: ['none', 'lifetime', 'monthly'] },
            expiryDate: { type: ['string', 'null'], format: 'date-time' },
          },
        },
        401: {
          description: 'Unauthorized',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  }, async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<{ isPremium: boolean; type: string; expiryDate: string | null }> => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    const userId = session.user.id;
    app.logger.info({ userId }, 'Fetching premium status');

    try {
      const purchases = await app.db
        .select()
        .from(schema.premiumPurchases)
        .where(
          and(
            eq(schema.premiumPurchases.userId, userId),
            eq(schema.premiumPurchases.status, 'active')
          )
        )
        .orderBy(desc(schema.premiumPurchases.createdAt))
        .limit(1);

      if (purchases.length === 0) {
        app.logger.info({ userId }, 'User has no active premium subscription');
        return {
          isPremium: false,
          type: 'none',
          expiryDate: null,
        };
      }

      const purchase = purchases[0];

      // Check if monthly subscription is expired
      if (
        purchase.purchaseType === 'monthly' &&
        purchase.expiryDate &&
        new Date(purchase.expiryDate) < new Date()
      ) {
        app.logger.info({ userId, purchaseId: purchase.id }, 'Monthly premium expired');
        await app.db
          .update(schema.premiumPurchases)
          .set({ status: 'expired' })
          .where(eq(schema.premiumPurchases.id, purchase.id));

        return {
          isPremium: false,
          type: 'none',
          expiryDate: null,
        };
      }

      app.logger.info(
        { userId, purchaseType: purchase.purchaseType },
        'Premium status retrieved successfully'
      );

      return {
        isPremium: true,
        type: purchase.purchaseType,
        expiryDate: purchase.expiryDate ? purchase.expiryDate.toISOString() : null,
      };
    } catch (error) {
      app.logger.error(
        { err: error, userId },
        'Failed to fetch premium status'
      );
      throw error;
    }
  });

  // POST /api/premium/verify-code - Verify premium code
  app.fastify.post('/api/premium/verify-code', {
    schema: {
      description: 'Verify a premium code and create premium purchase',
      tags: ['premium'],
      body: {
        type: 'object',
        required: ['code'],
        properties: {
          code: { type: 'string' },
        },
      },
      response: {
        200: {
          description: 'Premium code verified successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            premiumType: { type: 'string', enum: ['monthly', 'lifetime'] },
            expiryDate: { type: ['string', 'null'], format: 'date-time' },
          },
        },
        400: {
          description: 'Invalid premium code',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
        401: {
          description: 'Unauthorized',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  }, async (
    request: FastifyRequest<{ Body: VerifyCodeBody }>,
    reply: FastifyReply
  ): Promise<{ success: boolean; premiumType: string; expiryDate: string | null }> => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    const { code } = request.body;
    const userId = session.user.id;

    app.logger.info({ userId, code }, 'Verifying premium code');

    try {
      let premiumType: 'lifetime' | 'monthly';

      if (code === 'easy2') {
        premiumType = 'monthly';
      } else if (code === 'easy2033') {
        premiumType = 'lifetime';
      } else {
        app.logger.warn({ userId, code }, 'Invalid premium code provided');
        reply.status(400);
        return {
          success: false,
          premiumType: 'monthly',
          expiryDate: null,
        } as any;
      }

      let expiryDate: Date | null = null;
      if (premiumType === 'monthly') {
        expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
      }

      const purchase = await app.db.insert(schema.premiumPurchases).values({
        userId,
        purchaseType: premiumType,
        status: 'active',
        purchaseDate: new Date(),
        expiryDate,
        currency: 'CHF',
      }).returning();

      app.logger.info(
        { purchaseId: purchase[0].id, premiumType, code },
        'Premium code verified and purchase created'
      );

      return {
        success: true,
        premiumType,
        expiryDate: expiryDate ? expiryDate.toISOString() : null,
      };
    } catch (error) {
      app.logger.error(
        { err: error, userId, code },
        'Failed to verify premium code'
      );
      throw error;
    }
  });

  // DELETE /api/premium/cancel - Cancel active premium subscription
  app.fastify.delete('/api/premium/cancel', {
    schema: {
      description: 'Cancel active premium subscription for authenticated user',
      tags: ['premium'],
      response: {
        200: {
          description: 'Premium subscription cancelled successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
          },
        },
        401: {
          description: 'Unauthorized',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  }, async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<{ success: boolean }> => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    const userId = session.user.id;
    app.logger.info({ userId }, 'Cancelling premium subscription');

    try {
      const activePurchases = await app.db
        .select()
        .from(schema.premiumPurchases)
        .where(
          and(
            eq(schema.premiumPurchases.userId, userId),
            eq(schema.premiumPurchases.status, 'active')
          )
        );

      if (activePurchases.length === 0) {
        app.logger.warn({ userId }, 'No active premium subscription to cancel');
        return { success: true };
      }

      await app.db
        .update(schema.premiumPurchases)
        .set({ status: 'cancelled' })
        .where(
          and(
            eq(schema.premiumPurchases.userId, userId),
            eq(schema.premiumPurchases.status, 'active')
          )
        );

      app.logger.info(
        { userId, purchaseCount: activePurchases.length },
        'Premium subscription cancelled successfully'
      );

      return { success: true };
    } catch (error) {
      app.logger.error(
        { err: error, userId },
        'Failed to cancel premium subscription'
      );
      throw error;
    }
  });
}
