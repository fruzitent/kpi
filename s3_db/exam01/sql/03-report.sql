-- top-5 /w avg since last 3 years

drop procedure if exists public.foo;
create procedure pubic.foo as
$$
declare
    _cursor cursor for select * from foo;
begin
    open _cursor;

    fetch _cursor into _foo;
    exist when not found;

    close _cursor;
end;
$$ language plpgsql;

call public.foo();
