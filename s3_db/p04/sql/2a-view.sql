drop materialized view if exists realtor.offer_suggestion_simple;
create materialized view realtor.offer_suggestion_simple as
select t.city,
       t.country,
       t.offer_id,
       t.price,
       t.property_status,
       t.property_type,
       round(
               t.agent_success_score +
               t.location_demand_score +
               t.price_score +
               t.property_status_score,
               2) as total_score
from (select l.city,
             l.country,
             (select count(*)
              from realtor.offer o
                       join realtor.property p using (property_id)
              where p.location_id = l.location_id
                and o.offer_status = 'accepted') * 0.3 as location_demand_score,
             o.offer_id,
             o.price,
             (case
                  when o.price between 5e5 and 1e6 then 10
                  when o.price between 3e5 and 5e5 then 8
                  when o.price < 3e5 then 5
                  else 1 end * 0.1)                    as price_score,
             p.property_status,
             (case p.property_status
                  when 'excellent' then 5
                  when 'good' then 4
                  when 'average' then 3
                  when 'fair' then 2
                  when 'poor' then 1 end * 0.4)        as property_status_score,
             p.property_type,
             (select count(*)
              from realtor.offer o
              where o.maker_id = o.maker_id
                and o.offer_status = 'finished') * 0.2 as agent_success_score
      from realtor.property p
               join realtor.location l using (location_id)
               join realtor.offer o using (property_id)
      where o.offer_status = 'accepted'
      limit 10) as t
order by total_score desc;

select *
from realtor.offer_suggestion_simple;
--            city            |     country      | offer_id | price  | property_status | property_type | total_score
-- ---------------------------+------------------+----------+--------+-----------------+---------------+-------------
--  Zulauf stad               | Benin            |       29 | 617260 | excellent       | apartment     |        8.10
--  Wolff mouth               | Mongolia         |       48 | 586854 | good            | apartment     |        7.70
--  Donnelly ton              | Albania          |       15 |    780 | excellent       | apartment     |        7.60
--  Hyatt haven               | Pitcairn Islands |       55 | 313506 | good            | apartment     |        7.50
--  Lake Merlin Reinger side  | Christmas Island |       19 | 398134 | good            | apartment     |        7.50
--  Rosalinda side            | Norway           |       54 | 997650 | average         | apartment     |        7.30
--  West Lewis Grady shire    | Guadeloupe       |        1 |    733 | good            | apartment     |        7.20
--  East Daryl Jaskolski berg | Rwanda           |        9 | 369330 | average         | house         |        7.10
--  Dach port                 | Saudi Arabia     |       49 |    942 | average         | house         |        6.80
--  Sydney borough            | Solomon Islands  |       40 | 547334 | poor            | house         |        6.50
-- (10 rows)
