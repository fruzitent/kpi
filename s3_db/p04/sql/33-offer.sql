select o.taker_id,
       count(*)           as offer_count,
       sum(s.impressions) as sum_impressions
from realtor.offer o
         join realtor.stat s using (stat_id)
where o.offer_status = 'finished'
  and s.updated_at > now() - interval '50y'
group by o.taker_id
having count(*) > 1
order by sum_impressions;
--  taker_id | offer_count | sum_impressions
-- ----------+-------------+-----------------
--        11 |           2 |            3500
--         7 |           2 |           16555
--        30 |           2 |           23521
--        35 |           2 |           56949
-- (4 rows)
