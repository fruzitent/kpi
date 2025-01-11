select property_type, offer_type, count(*) as offer_count
from realtor.offer
         join realtor.property using (property_id)
group by property_type, offer_type
order by property_type, offer_type;
--  property_type | offer_type | offer_count
-- ---------------+------------+-------------
--  apartment     | tenancy    |          32
--  apartment     | trade      |          41
--  house         | tenancy    |          39
--  house         | trade      |          37
-- (4 rows)
