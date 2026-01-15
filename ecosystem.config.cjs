module.exports = {
  apps: [
    {
      name: "whatsapp-viber-service",
      script: "dist/index.js",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
      },
      time: true,
    },
  ],
};
