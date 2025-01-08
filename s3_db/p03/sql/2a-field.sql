select (select city
        from realtor.location
        where location.location_id = property.location_id) as city,
       property_id,
       property_status
from realtor.property;
--                city               | property_id | property_status
-- ----------------------------------+-------------+-----------------
--  West Lewis Grady shire           |           1 | good
--  Orn fort                         |           2 | excellent
--  East Russ Bernier borough        |           3 | average
--  Port Lucinda Barrows ville       |           4 | excellent
--  Medhurst land                    |           5 | good
--  Abernathy port                   |           6 | good
--  New Jacquelyn Rau haven          |           7 | poor
--  East Daryl Jaskolski berg        |           8 | average
--  Hahn stad                        |           9 | good
--  Hahn shire                       |          10 | fair
-- ...
-- (158 rows)
