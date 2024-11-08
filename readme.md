# hh.ru chrome ext for find job (wrote on the fly)

```sql
CREATE TABLE `main` (
  `id` int NOT NULL AUTO_INCREMENT,
  `profile` varchar(100) DEFAULT NULL,
  `hh_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `main_profile_IDX` (`profile`) USING BTREE,
  KEY `main_hh_id_IDX` (`hh_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

```js
localStorage.setItem('HH20241106-profile', '8888_8888')
// localStorage.setItem('HH20241106-profile', '88888888')
localStorage.setItem('HH20241106-uvicorn-port', '8888')
```

```bash
cd ~\PycharmProjects\HH20241106 && .venv\Scripts\activate && uvicorn main:app --port 8888 --host 0.0.0.0 --reload
```

