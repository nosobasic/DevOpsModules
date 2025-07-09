/**
 * Example Agent Template
 * 
 * This file demonstrates the pattern for creating new agents in the system.
 * All agents should extend BaseAgent and implement the required execute() method.
 * 
 * To use this template:
 * 1. Copy this file to server/agents/
 * 2. Rename the class and file to match your agent's purpose
 * 3. Implement the execute() method with your specific logic
 * 4. Add any custom configuration and methods as needed
 */

// Example agent structure (this is a template, not meant to be compiled)
export class ExampleAgent {
  // Required imports (add these at the top of your actual agent file):
  // import { Server } from 'socket.io';
  // import { BaseAgent } from './BaseAgent.js';
  // import { AgentConfig } from '../../shared/types.js';

  // Constructor pattern:
  // constructor(io: Server, config: AgentConfig = { settings: {} }) {
  //   super('your-agent-id', 'Your Agent Name', io, config);
  // }

  // Required method - implement your agent's main logic here:
  // async execute(): Promise<void> {
  //   try {
  //     console.log('🤖 Your Agent processing task...');
  //     
  //     // Your agent's main logic goes here
  //     const result = await this.performTask();
  //     
  //     // Emit status update to dashboard
  //     this.emit('status', {
  //       message: result.message,
  //       success: result.success,
  //       timestamp: new Date()
  //     });
  //     
  //     console.log(`✅ Your Agent task completed: ${result.message}`);
  //     
  //   } catch (error) {
  //     console.error(`❌ Your Agent execution failed:`, error);
  //     throw error;
  //   }
  // }

  // Example task implementation:
  // private async performTask(): Promise<{ success: boolean; message: string }> {
  //   // Implement your specific task logic here
  //   
  //   // Example: Simulate some work
  //   await new Promise(resolve => setTimeout(resolve, 1000));
  //   
  //   return {
  //     success: true,
  //     message: 'Task completed successfully'
  //   };
  // }

  // Optional: Override methods for custom behavior
  // public start(): void {
  //   console.log('🚀 Starting Your Agent...');
  //   super.start();
  // }

  // public stop(): void {
  //   console.log('🛑 Stopping Your Agent...');
  //   super.stop();
  // }

  // Optional: Add custom configuration methods
  // public setCustomConfig(config: any): void {
  //   this.customConfig = { ...this.customConfig, ...config };
  // }

  // public getCustomConfig(): any {
  //   return this.customConfig;
  // }
} 