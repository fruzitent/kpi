select country, string_agg(city, ', ') as cities
from realtor.location
group by country;
--               country              |                                    cities
-- -----------------------------------+-------------------------------------------------------------------------------
--  Brunei Darussalam                 | West Abbey Thompson ville, Klein ville
--  Kiribati                          | Prohaska berg
--  Luxembourg                        | Rodriguez haven, Frami ton, West Mertie Prohaska furt, Rath side, Lemke burgh
--  Sweden                            | Douglas burgh
--  Jordan                            | Hoppe bury
--  Syrian Arab Republic              | Stanton furt
--  Saint Helena                      | Abernathy port, Koelpin bury
--  Cambodia                          | Port Lucinda Barrows ville
--  Uzbekistan                        | Koss town
--  Finland                           | Kuvalis borough
-- ...
-- (117 rows)
