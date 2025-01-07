select data, file_name, mime_type
from realtor.document
where file_name like 'd%.zip';
-- where file_name ~ '^d(.?)+\.zip$';
--                                 data                                |   file_name   |        mime_type
-- --------------------------------------------------------------------+---------------+--------------------------
--  \x6261656262373936373163663231613938343930393464653063346232623935 | different.zip | application/octet-stream
--  \x6636386163663465383138356534323836383262653533663230393835666233 | day.zip       | application/octet-stream
-- (2 rows)
