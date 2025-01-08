select a.floor, a.rooms, p.location_id
from realtor.apartment a
         join realtor.property p on a.apartment_id = p.property_id;
--  floor | rooms | location_id
-- -------+-------+-------------
--     14 |     1 |           1
--      5 |     2 |           2
--     28 |     6 |           3
--     28 |     3 |           4
--      5 |     4 |          10
--      4 |     2 |          11
--     24 |     7 |          13
--     29 |     5 |          15
--      8 |     5 |          16
--     29 |     6 |          17
-- ...
-- (78 rows)
