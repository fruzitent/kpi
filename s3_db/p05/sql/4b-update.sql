drop function if exists realtor.validate_property cascade;
create function realtor.validate_property() returns trigger as
$$
declare
    _old_type realtor.property_type;
begin
    select property_type
    from realtor.property p
    where p.property_id = new.property_id
    into _old_type;

    if _old_type != new.property_type then
        raise exception 'property_type cannot be changed';
    end if;

    return new;
end
$$ language plpgsql;

drop trigger if exists check_type_integrity on realtor.property cascade;
create trigger check_type_integrity
    before update
    on realtor.property
    for each row
execute function realtor.validate_property();

update realtor.property
set property_type = 'house'
where property_id = (select property_id
                     from realtor.property
                     where property_type = 'apartment'
                     order by property_id
                     limit 1);
-- ERROR:  property_type cannot be changed
