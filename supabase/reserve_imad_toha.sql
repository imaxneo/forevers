-- Reserve a highlighted center star for Imad + Toha
-- Position 5050 is near the visual center of the 10,000-star map.
insert into squares (
  grid_position,
  name1,
  name2,
  start_date,
  message,
  photo_url,
  plan,
  is_active,
  email,
  stripe_session_id,
  expires_at
)
values (
  5050,
  'Imad',
  'Toha',
  '2021-05-04',
  convert_from(decode('d981d98ad983d99020d8b4d98ad8a120d8acd8b9d984d986d98a20d8a3d8b7d985d8a6d98620d8a8d8b7d8b1d98ad982d8a920d984d98520d8a3d8b9d8b1d981d987d8a720d985d98620d982d8a8d984e280a620d988d983d8a3d98620d982d984d8a8d98a20d8a7d8aed8aad8a7d8b1d98320d8afd988d98620d8aad8b1d8afd8af2e0ad8a3d8b1d98ad8afd98320d8a3d986d8aad990d88c20d984d98ad8b320d984d988d982d8aad98d20d985d8a4d982d8aae280a620d8a8d98420d984d8b9d985d8b1d98d20d983d8a7d985d9842e0ad988d8a3d8afd8b9d98820d8a7d984d984d98720d8a8d983d98420d8b5d8afd98220d8a3d98620d8aad983d988d986d98a20d986d8b5d98ad8a8d98a','hex'),'UTF8'),
  '/images/khrf.jpg',
  'featured',
  true,
  null,
  null,
  null
)
on conflict (grid_position)
do update set
  name1 = excluded.name1,
  name2 = excluded.name2,
  start_date = excluded.start_date,
  message = excluded.message,
  photo_url = excluded.photo_url,
  plan = excluded.plan,
  is_active = true,
  email = excluded.email,
  stripe_session_id = null,
  expires_at = null;

