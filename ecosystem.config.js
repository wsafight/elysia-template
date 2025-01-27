module.exports = {
  apps: [
    {
      name: "server",
      script: "./node-sqlite.mjs",
      watch: false,
      instances: 1,
      autorestart: true,
      max_memory_restart: "3G",
      env: { NODE_ENV: "production" },
    },
  ],
};