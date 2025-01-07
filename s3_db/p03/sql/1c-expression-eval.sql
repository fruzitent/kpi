select property_id, property_status, (total_width * total_depth) as total_area
from realtor.property;
--  property_id | property_status | total_area
-- -------------+-----------------+------------
--            1 | good            |       2562
--            2 | excellent       |      13110
--            3 | average         |       9856
--            4 | excellent       |       7410
--            5 | good            |       2726
--            6 | good            |       2268
--            7 | poor            |        438
--            8 | average         |        165
--            9 | good            |       7490
--           10 | fair            |        402
-- ...
-- (158 rows)
