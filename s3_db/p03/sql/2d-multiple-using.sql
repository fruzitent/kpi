select impressions, offer_id, price
from realtor.offer
         join realtor.stat using (stat_id);
--  impressions | offer_id | price
-- -------------+----------+--------
--        26517 |        1 |    733
--        22758 |        2 |    258
--        22758 |        3 | 598542
--         6257 |        4 |    425
--         6257 |        5 |    396
--        24139 |        6 | 528762
--        23655 |        7 |    206
--        23655 |        8 |    197
--        25641 |        9 | 369330
--        25641 |       10 |    313
-- ...
-- (150 rows)
