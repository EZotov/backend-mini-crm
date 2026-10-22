module.exports = {
  apps: [
    {
      name: 'backend',
      script: './dist/main.js',
      instances: 2,
      exec_mode: 'cluster',
    },
  ],
};