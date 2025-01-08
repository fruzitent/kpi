select location_id, property_id
from realtor.property
where property_type = 'apartment'
   or property_status = 'good';
--  location_id | property_id
-- -------------+-------------
--            1 |           1
--            2 |           2
--            3 |           3
--            4 |           4
--            5 |           5
--            6 |           6
--            9 |           9
--           10 |          10
--           11 |          11
--           13 |          13
-- ...
-- (91 rows)
