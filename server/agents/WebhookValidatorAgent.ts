import { Server } from 'socket.io';
import { BaseAgent } from './BaseAgent.js';

export class WebhookValidatorAgent extends BaseAgent {
  constructor(io: Server) {
    super('webhook-validator', 'Webhook Validator', io);
  }

  async execute(): Promise<void> {
    this.emit('data', { timestamp: new Date(), webhookData: 'mock' });
  }
}