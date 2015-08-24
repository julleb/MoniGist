/*
* How to use for windows : 
* \i C:/Users/jb/Desktop/NODE/intnet-proj/gist/database.sql
*
*/
\c jb;
drop database gist;
create database gist;

\c gist;

create table users (
uid int PRIMARY KEY, 
username varchar(255),
avatar_url varchar(255),
profile_url varchar(255)
);

create table gists(
id SERIAL PRIMARY KEY,
url varchar(255),
text TEXT,
date timestamp,
public boolean
);

create table owns(
uid int REFERENCES users (uid),
id int REFERENCES Gists (id),
PRIMARY KEY (uid,id)
);

create table compilations(
cid SERIAL PRIMARY KEY,
output TEXT,
compiled boolean
);

create table has(
cid int REFERENCES compilations(cid),
id int REFERENCES gists(id),
PRIMARY KEY (id, cid)
);


--Hårdkodad anonym användare!
insert into users values(-1, 'ANONYMOUS', 'www.github.com', 'www.github.com');

/*
insert into users values(1, 'julle', 'www.github.com', 'www.github.com');
insert into users values(2, 'anders', 'www.github.com', 'www.github.com');

insert into gists(url, text, date, public) values('www.fragbite.se', 'TUDILU', current_date, true);
insert into gists(url, text, date, public) values('www.aftonbladet.se', 'NANANAN DANDAD', current_date, true);
insert into gists(url, text, date, public) values('www.julle.se', 'FUCKME', current_date, true);

insert into owns values (1, 1);
insert into owns values(1,2);
insert into owns values(2,3);
*/

/* select all gists from a user
select * from gists natural join owns where uid = 'gitid'
*/

/* select all public gists from a user
select * from gists natural join owns where uid = 'gitid' and public=false;
*/

/* get the 5 recent gists 
select * from gists order by id desc limit 5;
*/

/* get all the gists from a user where username is = something
select * from gists natural join owns natural join users where username='namn';
*/


