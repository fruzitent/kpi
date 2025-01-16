drop materialized view if exists realtor.offer_suggestion_advanced;
create materialized view realtor.offer_suggestion_advanced as
select os.total_score, -- os.*
       l.street_name,
       o.offer_status,
       o.offer_type,
       p.total_depth * p.total_width      as total_area,
       u.first_name || ' ' || u.last_name as full_name
from realtor.offer_suggestion_simple os
         join realtor.offer o using (offer_id)
         join realtor.property p using (property_id)
         join realtor.location l using (location_id)
         join realtor.user u on u.user_id = o.maker_id;

select *
from realtor.offer_suggestion_advanced;
--  total_score |     street_name     | offer_status | offer_type | total_area |    full_name
-- -------------+---------------------+--------------+------------+------------+-----------------
--         8.10 | Jacey Plaza         | accepted     | trade      |      13786 | Amara Hagenes
--         7.70 | Turcotte Throughway | accepted     | trade      |        355 | Trenton Durgan
--         7.60 | Torp Pine           | accepted     | tenancy    |       2300 | Norene Gorczany
--         7.50 | Heidenreich Park    | accepted     | trade      |       2440 | Alverta Rempel
--         7.50 | Gordon Parks        | accepted     | trade      |       5395 | Melody Jenkins
--         7.30 | Huel Glen           | accepted     | trade      |        825 | Bernadette Bode
--         7.20 | Ondricka Flats      | accepted     | tenancy    |       2562 | Rowena Mayer
--         7.10 | Sipes Bridge        | accepted     | trade      |        165 | Norene Gorczany
--         6.80 | Ferry Curve         | accepted     | tenancy    |       6844 | Frances Hudson
--         6.50 | Rowland Hills       | accepted     | trade      |        540 | Mara Larson
-- (10 rows)
