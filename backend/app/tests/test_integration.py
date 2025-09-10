
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_login_ok():
    res = client.post(
        "/auth/login",
        data={"username": "admin@example.com", "password": "admin1"}
    )
    assert res.status_code == 200
    body = res.json()
    assert "access_token" in body


def test_login_fail():
    res = client.post(
        "/auth/login",
        data={"username": "wrong@example.com", "password": "bad"}
    )
    assert res.status_code == 401  


def test_protected_me():

    login_res = client.post(
        "/auth/login",
        data={"username": "admin@example.com", "password": "admin1"}
    )
    token = login_res.json()["access_token"]


    res = client.get("/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    user = res.json()
    assert "role" in user
    assert user["email"] == "admin@example.com"


def test_create_and_list_victims():
    
    login_res = client.post(
        "/auth/login",
        data={"username": "admin@example.com", "password": "admin1"}
    )
    token = login_res.json()["access_token"]

    new_victim = {"name": "Test Victim", "skills": "Python", "status": "captured"}
    res = client.post(
        "/victims",
        json=new_victim,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200
    victim_created = res.json()
    assert victim_created["name"] == "Test Victim"

    
    res = client.get("/victims", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    victims = res.json()
    assert any(v["name"] == "Test Victim" for v in victims)


def test_create_and_list_rewards():
    
    login_res = client.post(
        "/auth/login",
        data={"username": "admin@example.com", "password": "admin1"}
    )
    token = login_res.json()["access_token"]

    new_reward = {"title": "Bonus Test", "description": "Pour test", "points": 10, "slave_id": 1}
    res = client.post(
        "/rewards",
        json=new_reward,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200
    reward = res.json()
    assert reward["title"] == "Bonus Test"


    res = client.get("/rewards", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    rewards = res.json()
    assert any(r["title"] == "Bonus Test" for r in rewards)
