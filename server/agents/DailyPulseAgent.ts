import { Server } from 'socket.io';
import { BaseAgent } from './BaseAgent.js';

export class DailyPulseAgent extends BaseAgent {
  constructor(io: Server) {
    super('daily-pulse', 'Daily Pulse', io);
  }

  async execute(): Promise<void> {
    this.emit('data', { timestamp: new Date(), pulseData: 'mock' });
  }
}