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
  '?? ????? ????? ?? ??? ?? ?????? ???? ??????? ??? ????? ????? ?????? ?? ?????? ???????. ????.' ,
  'https://ui-avatars.com/api/?name=I%2BT&background=8b1538&color=ffffff&size=512&bold=true&format=png',
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
