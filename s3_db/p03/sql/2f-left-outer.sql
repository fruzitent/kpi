select o.offer_id,
       o.offer_status,
       o.price,
       p.property_id,
       p.property_status,
       p.property_type
from realtor.property p
         left join realtor.offer o using (property_id)
order by p.property_id;
--  offer_id | offer_status | price  | property_id | property_status | property_type
-- ----------+--------------+--------+-------------+-----------------+---------------
--         1 | accepted     |    733 |           1 | good            | apartment
--         2 | rejected     |    258 |           2 | excellent       | apartment
--           |              |        |           3 | average         | apartment
--           |              |        |           4 | excellent       | apartment
--         5 | submitted    |    396 |           5 | good            | house
--         4 | submitted    |    425 |           5 | good            | house
--         6 | submitted    | 528762 |           6 | good            | house
--         8 | rejected     |    197 |           7 | poor            | house
--         7 | rejected     |    206 |           7 | poor            | house
--         9 | accepted     | 369330 |           8 | average         | house
-- ...
-- (201 rows)
