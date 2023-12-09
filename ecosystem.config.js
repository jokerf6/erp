module.exports = {
  apps: [
    {
      name: 'erp-backend',
      script: 'dist/main.js', // Adjust the path to your compiled main file
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5001,
      },
    },
  ],
};

