import json
import pymysql
from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from pymysql.converters import escape_string


allow_profiles: tuple[str] = ('88888888', )


def get_connection():
    return pymysql.connect(
        host='localhost',
        user='HH20241106',
        password='HH20241106',
        database='HH20241106',
    )


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins='*',
    allow_credentials=True,
    allow_methods='*',
    allow_headers='*',
)


@app.post("/added")
async def check(params_json: str = Form(...)):
    params: dict = json.loads(params_json)
    if 'profile' not in params or params['profile'] not in allow_profiles:
        return dict(res=False, msg='No profile!')

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            sql: str = "INSERT INTO main (profile, hh_id) VALUES (%s, %s)"
            cursor.execute(sql, (params['profile'], params['hh_id']))
            conn.commit()
    finally:
        conn.close()

    return dict(res=True, act='added')


@app.post("/check")
async def check(params_json: str = Form(...)):
    params: dict = json.loads(params_json)
    if 'profile' not in params or params['profile'] not in allow_profiles:
        return dict(res=False, msg='No profile!')

    finded_hh_ids: list[str] = []
    conn = get_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            sql_ids: str = "','".join([escape_string(hh_id) for hh_id in params['hh_ids']])
            cursor.execute(f"SELECT hh_id FROM main WHERE hh_id IN ('{sql_ids}')")
            for row in cursor:
                finded_hh_ids.append(row['hh_id'])
    finally:
        conn.close()

    return dict(res=True, act='check', finded_hh_ids=finded_hh_ids)
