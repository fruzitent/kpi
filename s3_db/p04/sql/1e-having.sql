select count(*) as offer_count
from realtor.offer
having count(*) > 100;
--  offer_count
-- -------------
--          149
-- (1 row)
