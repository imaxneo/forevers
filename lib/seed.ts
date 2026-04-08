import { supabaseAdmin } from './supabase';
import { seedSquares } from './constants';

async function seed() {
  if (!supabaseAdmin) {
    console.error('SUPABASE_SERVICE_ROLE_KEY required');
    process.exit(1);
  }

  console.log('Seeding The Love Wall with demo data...');

  // Upsert squares (conflict on grid_position)
  const { data, error } = await supabaseAdmin
    .from('squares')
    .upsert(seedSquares.map(s => ({
      ...s,
      start_date: new Date(s.start_date).toISOString().split('T')[0], // YYYY-MM-DD
      created_at: new Date(s.created_at).toISOString(),
      expires_at: s.expires_at ? new Date(s.expires_at).toISOString() : null,
    })), { onConflict: 'grid_position' });

  if (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }

  console.log('✅ Demo squares seeded successfully!');
}

seed().catch(console.error);
