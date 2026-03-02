import app from './app.js';
import { config } from './config/env.js';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`\n🎮 Warriors Game API`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🔗 API Health: http://localhost:${PORT}/api/health`);
  console.log(`📚 Routes:`);
  console.log(`   POST   /api/auth/register`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   GET    /api/warriors`);
  console.log(`   GET    /api/warriors/:id`);
  console.log(`   POST   /api/matches`);
  console.log(`   POST   /api/matches/:id/selections`);
  console.log(`   POST   /api/matches/:id/battle`);
  console.log(`   GET    /api/ranking`);
  console.log(`   GET    /api/admin/stats`);
  console.log(`\n`);
});
