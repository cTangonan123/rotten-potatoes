# ER Diagrams
## Resources
- [drawdb](https://app.drawdb.com/): generates code to create db
- [Link to working drawdb file](https://www.drawdb.app/editor?shareId=ca695bc5e5f8bf70f926066b8ff60f73)

---
## ER Diagram
![img goes here](/docs/img/example-ER-diagram.png)

## SQL for generating tables
- first follow along Lab 5's [instructions on creating a DB in cPanel](https://docs.google.com/document/d/1vygpxkGuA7CecHa55cSbh7_v7Bj9C6dV0IettNYGEkI/edit?tab=t.0)
```sql
CREATE TABLE `user` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`is_admin` BOOLEAN NOT NULL,
	`user_name` VARCHAR(255) NOT NULL,
	`password` VARCHAR(255) NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE TABLE `reviews` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`user_id` INTEGER NOT NULL,
	`movie_id` INTEGER NOT NULL,
	`rating` INTEGER NOT NULL,
	`review` VARCHAR(500),
	PRIMARY KEY(`id`)
);


CREATE TABLE `movie` (
	`id` INTEGER NOT NULL UNIQUE,
	`title` VARCHAR(255) NOT NULL,
	`release_date` DATE NOT NULL,
	`overview` VARCHAR(700) NOT NULL,
	`backdrop_path` VARCHAR(255) NOT NULL,
	`poster_path` VARCHAR(255) NOT NULL,
	`vote_average` FLOAT NOT NULL,
	PRIMARY KEY(`id`)
);


ALTER TABLE `user`
ADD FOREIGN KEY(`id`) REFERENCES `reviews`(`user_id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `movie`
ADD FOREIGN KEY(`id`) REFERENCES `reviews`(`movie_id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
```
---
<sub>\< [Back to Docs](/docs/README.md)</sub>
<sub>\<\< [Back to Main Page](/README.md)</sub>