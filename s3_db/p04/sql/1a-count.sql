select property_type, count(*) as total_properties
from realtor.property
group by property_type
order by total_properties desc;
--  property_type | total_properties
-- ---------------+------------------
--  house         |               80
--  apartment     |               78
-- (2 rows)
