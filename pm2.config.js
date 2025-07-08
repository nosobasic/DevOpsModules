module.exports = {
  apps: [
    {
      name: 'devops-modules',
      script: 'dist/server/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      kill_timeout: 5000,
      listen_timeout: 3000,
      wait_ready: true,
      autorestart: true,
      watch: false,
      ignore_watch: ['node_modules', 'logs'],
      source_map_support: true,
      instance_var: 'INSTANCE_ID',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      combine_logs: true,
      
      // Health monitoring
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,
      
      // Environment variables
      env_file: '.env.production',
      
      // Advanced PM2 features
      increment_var: 'PORT',
      
      // Graceful shutdown
      kill_retry_time: 100,
      
      // Log rotation
      log_rotation: {
        'max_size': '10M',
        'retain': '5',
        'compress': true,
        'dateFormat': 'YYYY-MM-DD_HH-mm-ss',
        'rotateModule': true,
        'rotateInterval': '0 0 * * *',
        'TZ': 'UTC'
      }
    }
  ],
  
  // Deployment configuration
  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'https://github.com/yourusername/DevOpsModules.git',
      path: '/var/www/devops-modules',
      'post-deploy': 'npm install && npm run build:server && pm2 reload ecosystem.config.js --env production'
    }
  }
};