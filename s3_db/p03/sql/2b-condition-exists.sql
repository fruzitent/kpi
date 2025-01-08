select agent_id, nar_id
from realtor.agent
where exists (select 1
              from realtor.offer
              where offer.agent_id = agent.agent_id
                and price > 1000);
--  agent_id |  nar_id
-- ----------+-----------
--         3 | 950746072
--         4 | 550279768
--         5 | 446798200
--         6 | 714979383
--         8 | 331371392
--        10 | 853012461
--        12 | 470368219
--        13 | 397579993
--        14 | 486966971
--        15 | 795932539
-- ...
-- (31 rows)
