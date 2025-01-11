select *, row_number() over (order by t.offer_count desc) as rank
from (select offer_status, count(*) as offer_count
      from realtor.offer
      group by offer_status) as t
order by rank;
--  offer_status | offer_count | rank
-- --------------+-------------+------
--  submitted    |          30 |    1
--  accepted     |          27 |    2
--  cancelled    |          26 |    3
--  finished     |          24 |    4
--  rejected     |          22 |    5
--  draft        |          20 |    6
-- (6 rows)
