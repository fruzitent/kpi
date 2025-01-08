select u.first_name || ' ' || u.last_name                                                   as full_name,
       count(*)                                                                             as offer_count,
       count(case when o.offer_status = 'finished' then 1 end)                              as abs_offer_finished,
       round(count(case when o.offer_status = 'finished' then 1 end) * 100.0 / count(*), 2) as rel_offer_finished
from realtor.offer o
         join realtor.stat s using (stat_id)
         join realtor.user u on u.user_id = o.agent_id
where o.agent_id is not null
  and o.offer_type = 'tenancy'
  and s.created_at > now() - interval '20y'
group by u.first_name, u.last_name
order by u.last_name;
--      full_name     | offer_count | abs_offer_finished | rel_offer_finished
-- -------------------+-------------+--------------------+--------------------
--  German Bauch      |           1 |                  1 |             100.00
--  Brycen Bergnaum   |           1 |                  0 |               0.00
--  Dylan DuBuque     |           1 |                  0 |               0.00
--  Brice Emmerich    |           1 |                  0 |               0.00
--  Delilah Farrell   |           1 |                  0 |               0.00
--  Alfreda Hills     |           1 |                  1 |             100.00
--  Kaleb Jacobson    |           1 |                  0 |               0.00
--  Amos Mann         |           1 |                  1 |             100.00
--  Jaeden Metz       |           3 |                  1 |              33.33
--  Nickolas Nikolaus |           3 |                  1 |              33.33
--  Tomasa Renner     |           1 |                  0 |               0.00
--  Francis Turner    |           1 |                  0 |               0.00
-- (12 rows)
