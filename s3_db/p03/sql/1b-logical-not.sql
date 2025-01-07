select appointment_status, offer_id, scheduled_at
from realtor.appointment
where not appointment_status = 'finished'
  and scheduled_at > now();
--  appointment_status | offer_id |         scheduled_at
-- --------------------+----------+-------------------------------
--  scheduled          |        8 | 2025-01-09 09:40:32.24533+00
--  scheduled          |       11 | 2025-01-13 04:44:05.813269+00
--  cancelled          |       16 | 2025-01-30 19:21:02.790953+00
--  scheduled          |       17 | 2025-02-04 05:27:55.05931+00
--  cancelled          |       28 | 2025-01-29 14:07:08.920469+00
--  scheduled          |       32 | 2025-01-21 09:22:20.118546+00
--  scheduled          |       64 | 2025-01-28 17:32:07.066968+00
--  cancelled          |       68 | 2025-01-11 07:53:41.409327+00
--  cancelled          |       74 | 2025-01-18 23:57:09.231768+00
--  scheduled          |       89 | 2025-01-27 17:58:18.262678+00
-- ...
-- (19 rows)
