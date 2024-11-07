# hh.ru chrome ext for find job (wrote on the fly)

```sql
CREATE TABLE `main` (
  `id` int NOT NULL AUTO_INCREMENT,
  `profile` varchar(100) DEFAULT NULL,
  `hh_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `main_profile_IDX` (`profile`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

```js
localStorage.setItem('HH20241106-profile', '88888888')
localStorage.setItem('HH20241106-uvicorn-port', '8888')
```

```bash
uvicorn main:app --port 8888 --host 0.0.0.0 --reload
```

