select *, round(t.total_area / t.price::numeric, 5) as price_per_area
from (select o.property_id, o.price, (p.total_depth * p.total_width) as total_area
      from realtor.property p
               join realtor.offer o using (property_id)
      where property_type = 'apartment') as t
order by price_per_area, t.total_area desc;
--  property_id | price  | total_area | price_per_area
-- -------------+--------+------------+----------------
--           73 | 974105 |        451 |        0.00046
--           44 | 586854 |        355 |        0.00060
--          104 | 625442 |        494 |        0.00079
--          114 | 728633 |        585 |        0.00080
--           57 | 997650 |        825 |        0.00083
--           73 | 520485 |        451 |        0.00087
--          115 | 680342 |        660 |        0.00097
--           89 | 576465 |        711 |        0.00123
--          115 | 526774 |        660 |        0.00125
--           38 | 460309 |        756 |        0.00164
-- ...
-- (73 rows)
