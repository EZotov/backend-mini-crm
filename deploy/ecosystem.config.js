export default [
  {
    name: 'backend',
    script: './dist/main.js',
    instances: 1,
    exec_mode: 'cluster',
  },
];