import { Server } from 'socket.io';
import { BaseAgent } from './BaseAgent.js';

export class AdGeneratorAgent extends BaseAgent {
  constructor(io: Server) {
    super('ad-generator', 'Ad Generator', io);
  }

  async execute(): Promise<void> {
    this.emit('data', { timestamp: new Date(), adData: 'mock' });
  }
}