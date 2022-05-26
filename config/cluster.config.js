module.exports = {
  apps: [
    {
      name: "Server Cluster",
      script: "server.js",
      args: "-p 8080",
      instances: "max",
      exec_mode: "cluster",
      watch: true,
    },
  ],
};
