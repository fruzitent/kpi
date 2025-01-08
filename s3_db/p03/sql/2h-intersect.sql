select split_part(file_name, '.', 1) as file_name_wo_ext
from realtor.document
where file_name like '%.tar'
intersect
select split_part(file_name, '.', 1) as file_name_wo_ext
from realtor.document
where file_name like '%.zip';
--  file_name_wo_ext
-- ------------------
--  sophia
--  week
--  logan
--  important
--  noah
--  young
--  company
--  early
--  little
--  harper
-- ...
-- (26 rows)
