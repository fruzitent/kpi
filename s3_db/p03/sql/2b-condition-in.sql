select maker_id, offer_id, offer_status, offer_type
from realtor.offer
where offer_status in ('draft', 'submitted');
--  maker_id | offer_id | offer_status | offer_type
-- ----------+----------+--------------+------------
--         2 |        4 | submitted    | tenancy
--         1 |        5 | submitted    | tenancy
--         1 |        6 | submitted    | trade
--         1 |       12 | draft        | trade
--        17 |       20 | submitted    | tenancy
--        22 |       26 | submitted    | tenancy
--        17 |       30 | draft        | tenancy
--        11 |       31 | submitted    | trade
--        11 |       33 | submitted    | trade
--        27 |       34 | submitted    | tenancy
-- ...
-- (50 rows)
