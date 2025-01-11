select *
from (select distinct o.agent_id,
                      count(*) over (partition by o.agent_id)               as offer_count_agent,
                      round(avg(o.price) over (partition by o.agent_id), 2) as avg_price_agent,
                      round(avg(o.price) over (), 2)                        as avg_price_total
      from realtor.offer o
               join realtor.stat s using (stat_id)
      where o.offer_status = 'finished'
        and s.updated_at > now() - interval '50y') as t
where t.avg_price_agent < t.avg_price_total
order by t.offer_count_agent desc, t.avg_price_agent desc;
--  agent_id | offer_count_agent | avg_price_agent | avg_price_total
-- ----------+-------------------+-----------------+-----------------
--         6 |                 2 |          402.50 |       281191.30
--        64 |                 1 |        64462.00 |       281191.30
--        73 |                 1 |          879.00 |       281191.30
--        10 |                 1 |          805.00 |       281191.30
--        54 |                 1 |          805.00 |       281191.30
--       132 |                 1 |          562.00 |       281191.30
--        92 |                 1 |          475.00 |       281191.30
--        40 |                 1 |          458.00 |       281191.30
--        16 |                 1 |          338.00 |       281191.30
--        25 |                 1 |          149.00 |       281191.30
--        95 |                 1 |           93.00 |       281191.30
-- (11 rows)
