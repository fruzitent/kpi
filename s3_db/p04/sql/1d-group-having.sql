select agent_id, count(*) as offer_count
from realtor.offer
where offer_status = 'cancelled'
group by agent_id
having count(*) > 2
order by offer_count desc;
--  agent_id | offer_count
-- ----------+-------------
--        10 |           3
--        23 |           3
-- (2 rows)
