select (first_name || ' ' || last_name) as full_name, user_id
from realtor.user;
--      full_name      | user_id
-- --------------------+---------
--  Rowena Mayer       |       1
--  Norene Gorczany    |       2
--  Francis Turner     |       3
--  Zakary Stracke     |       4
--  Kylee Harris       |       5
--  Jaeden Metz        |       6
--  Amara Hagenes      |       7
--  Leon Gerlach       |       8
--  Mara Larson        |       9
--  Nickolas Nikolaus  |      10
-- ...
-- (157 rows)
