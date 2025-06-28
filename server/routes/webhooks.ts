import { Router } from 'express';
import { WebhookPayload } from '../../shared/types.js';

export const webhookRoutes = Router();

// Generic webhook receiver
webhookRoutes.post('/:source', (req, res) => {
  try {
    const source = req.params.source;
    const signature = req.headers['x-signature'] as string;
    
    const payload: WebhookPayload = {
      id: `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      source,
      event: req.body.event || 'unknown',
      timestamp: new Date(),
      data: req.body,
      signature
    };

    // Log the webhook
    console.log(`📥 Webhook received from ${source}:`, payload);

    // Here you would typically:
    // 1. Validate the signature
    // 2. Process the webhook based on source
    // 3. Trigger relevant agents
    // 4. Store in database

    res.json({ 
      success: true, 
      message: 'Webhook received successfully',
      webhookId: payload.id,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message, 
      timestamp: new Date().toISOString() 
    });
  }
});

// Get webhook logs
webhookRoutes.get('/logs', (req, res) => {
  try {
    // In a real implementation, this would come from a database
    const logs = [
      {
        id: 'webhook_1',
        source: 'stripe',
        event: 'payment_intent.succeeded',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        status: 'processed'
      },
      {
        id: 'webhook_2',
        source: 'shopify',
        event: 'order.created',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        status: 'processed'
      }
    ];

    res.json({ success: true, data: logs, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message, 
      timestamp: new Date().toISOString() 
    });
  }
});