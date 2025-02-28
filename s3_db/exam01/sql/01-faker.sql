alter database example set session_preload_libraries = 'anon';
create extension if not exists anon;
select anon.init();
