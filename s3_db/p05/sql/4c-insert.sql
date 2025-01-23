drop function if exists realtor.is_overlapping cascade;
create function realtor.is_overlapping(
    _t11 timestamp with time zone,
    _t12 timestamp with time zone,
    _t21 timestamp with time zone,
    _t22 timestamp with time zone
) returns boolean as
$$
begin
    if _t11 > _t12 then
        raise exception 't1 ends before t1 starts';
    end if;
    if _t21 > _t22 then
        raise exception 't2 ends before t2 starts';
    end if;
    if _t11 = _t22 or _t21 = _t12 then
        return false;
    else
        return (_t11 >= _t21 and _t11 <= _t22)
            or (_t12 >= _t21 and _t12 <= _t22)
            or (_t21 >= _t11 and _t21 <= _t12)
            or (_t22 >= _t11 and _t22 <= _t12);
    end if;
end
$$ language plpgsql;

drop function if exists realtor.validate_schedule cascade;
create function realtor.validate_schedule() returns trigger as
$$
declare
    _is_overlap boolean;
    _window     interval := interval '1h';
begin
    select realtor.is_overlapping(
                   new.scheduled_at,
                   new.scheduled_at + _window,
                   a.scheduled_at,
                   a.scheduled_at + _window
           )
    from realtor.appointment a
    where a.offer_id = new.offer_id
      and a.appointment_id != new.appointment_id
    into _is_overlap;

    if _is_overlap then
        raise exception 'appointment overlaps with existing one';
    end if;

    return new;
end
$$ language plpgsql;

drop trigger if exists check_appointment_overlap on realtor.appointment cascade;
create trigger check_appointment_overlap
    before insert or update
    on realtor.appointment
    for each row
execute function realtor.validate_schedule();

update realtor.appointment
set scheduled_at = (select scheduled_at
                    from realtor.appointment
                    where appointment_id = 1) + interval '30m'
where appointment_id = 2;
-- ERROR:  appointment time overlaps with an existing appointment.
