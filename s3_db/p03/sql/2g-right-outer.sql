select o.offer_id, u.last_name
from realtor.offer o
         right join realtor.user u on u.user_id = o.maker_id;
--  offer_id |  last_name
-- ----------+--------------
--         1 | Mayer
--         2 | Gorczany
--         4 | Gorczany
--         5 | Mayer
--         6 | Mayer
--         7 | Hagenes
--         8 | Gorczany
--         9 | Gorczany
--        10 | Mayer
--        11 | Hauck
-- ...
-- (250 rows)
