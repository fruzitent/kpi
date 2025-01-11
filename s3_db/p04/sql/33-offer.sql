select *
from (select distinct o.taker_id, count(*) over (partition by o.taker_id) as offer_count
      from realtor.offer o
               join realtor.stat s using (stat_id)
      where o.offer_status = 'finished'
        and s.updated_at > now() - interval '50y'
      order by offer_count desc) as t
where t.offer_count > 1;
--  taker_id | offer_count
-- ----------+-------------
--         7 |           2
--        11 |           2
--        30 |           2
--        35 |           2
-- (4 rows)
