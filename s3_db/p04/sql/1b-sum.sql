select agent_id, sum(price * agent_rate) as sum_gross
from realtor.offer
where offer_status = 'finished'
group by agent_id
order by sum_gross desc;
--  agent_id |  sum_gross
-- ----------+-------------
--        18 | 487063.4600
--       155 | 430547.5000
--        15 | 428889.0600
--         5 | 400388.5000
--        26 | 332676.5000
--        23 | 295995.5000
--        12 | 287020.5000
--         3 | 214928.5000
--         4 | 167270.0000
--       124 | 153966.5000
-- ...
-- (21 rows)
