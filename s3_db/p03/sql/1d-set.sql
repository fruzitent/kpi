select maker_id, offer_type, offer_status
from realtor.offer
where offer_status in ('cancelled', 'rejected');
--  maker_id | offer_type | offer_status
-- ----------+------------+--------------
--         2 | tenancy    | rejected
--         7 | tenancy    | rejected
--         2 | tenancy    | rejected
--         1 | tenancy    | rejected
--        11 | trade      | cancelled
--         2 | tenancy    | cancelled
--         9 | tenancy    | cancelled
--         7 | trade      | rejected
--        17 | trade      | cancelled
--         9 | tenancy    | cancelled
-- ...
-- (48 rows)
