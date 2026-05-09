export const DB = {
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '3306'),
  user:     process.env.DB_USER     || 'bloxel',
  password: process.env.DB_PASSWORD || 'changeme',
  database: process.env.DB_NAME     || 'bloxel',
};

export const SERVER_PORT  = parseInt(process.env.PORT    || '3000');
export const WS_PROXY_PORT = parseInt(process.env.WS_PORT || '8888');

// WebSocket UDP proxy targets: [virtualIP, realIP, realPort]
export const DIRECT_PROXY = [
  ['192.168.0.1', '127.0.0.1', 30000],
];
