select appointment_id, created_at
from realtor.appointment
where created_at between '1970-01-01' and '1980-01-01';
-- where created_at >= '1970-01-01' and created_at <= '1980-01-01';
--  appointment_id |          created_at
-- ----------------+-------------------------------
--              12 | 1977-10-16 02:34:01.547628+00
--              33 | 1972-12-07 20:22:09.238106+00
--              34 | 1972-09-21 16:39:28.374393+00
--              43 | 1977-11-22 10:53:33.426719+00
--              48 | 1975-08-11 17:40:30.396531+00
-- (5 rows)
