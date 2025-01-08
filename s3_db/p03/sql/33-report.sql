select *,
       g.curr_sum_gross - g.prev_sum_gross                                      as abs_diff_sum_gross,
       round((g.curr_sum_gross - g.prev_sum_gross) * 100 / g.prev_sum_gross, 2) as rel_diff_sum_gross
from (select p.property_type,
             t.offer_type,
             round(sum(case when t.period = 'curr' then t.price * t.agent_rate end), 2) as curr_sum_gross,
             round(sum(case when t.period = 'prev' then t.price * t.agent_rate end), 2) as prev_sum_gross
      from (select o.agent_rate,
                   o.offer_type,
                   o.price,
                   o.property_id,
                   case
                       when s.updated_at > now() - 1 * interval '5y' and s.updated_at < now() - 0 * interval '5y'
                           then 'curr'
                       when s.updated_at > now() - 2 * interval '5y' and s.updated_at < now() - 1 * interval '5y'
                           then 'prev'
                       end as period
            from realtor.offer o
                     join realtor.stat s using (stat_id)
            where o.offer_status = 'finished'
              and s.updated_at > now() - 2 * interval '5y'
            order by s.updated_at) as t
               join realtor.property p using (property_id)
      group by p.property_type, t.offer_type
      order by p.property_type, t.offer_type) as g;
--  property_type | offer_type | curr_sum_gross | prev_sum_gross | abs_sum_diff_gross | rel_sum_diff_gross
-- ---------------+------------+----------------+----------------+--------------------+--------------------
--  apartment     | tenancy    |           2.98 |          20.74 |             -17.76 |             -85.63
--  apartment     | trade      |      893813.00 |      487052.50 |          406760.50 |              83.51
--  house         | tenancy    |          28.26 |          32.20 |              -3.94 |             -12.24
--  house         | trade      |      153966.50 |                |                    |
-- (4 rows)
