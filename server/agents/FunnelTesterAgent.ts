import { Server } from 'socket.io';
import { BaseAgent } from './BaseAgent.js';

export class FunnelTesterAgent extends BaseAgent {
  constructor(io: Server) {
    super('funnel-tester', 'Funnel Tester', io);
  }

  async execute(): Promise<void> {
    this.emit('data', { timestamp: new Date(), funnelData: 'mock' });
  }
}