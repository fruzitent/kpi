select a.agent_id, c.client_id
from realtor.agent a,
     realtor.client c;
--  agent_id | client_id
-- ----------+-----------
--         3 |         1
--         4 |         1
--         5 |         1
--         6 |         1
--         8 |         1
--        10 |         1
--        12 |         1
--        13 |         1
--        14 |         1
--        15 |         1
-- ...
-- (6160 rows)
