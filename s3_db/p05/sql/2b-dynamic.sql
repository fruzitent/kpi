drop function if exists realtor.offers_from;
create function realtor.offers_from(ts timestamp with time zone) returns setof realtor.offer as
$$
declare
    _sql text := '';
begin
    select concat(_sql,
                  'select o.* ',
                  'from realtor.offer o '
           )
    into _sql;

    if ts is not null then
        select concat(_sql,
                      'join realtor.stat s using (stat_id) ',
                      'where s.created_at >= $1 '
               )
        into _sql;
    end if;

    select concat(_sql, ';')
    into _sql;

    if ts is not null then
        return query execute _sql using ts;
    else
        return query execute _sql;
    end if;
end;
$$ language plpgsql;

select offer_id
from realtor.offers_from(now() - interval '1y');
--  offer_id
-- ----------
--       128
--       129
-- (2 rows)
