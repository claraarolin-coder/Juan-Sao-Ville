
import pytest
from app.auth import hash_password, verify_password, create_access_token
from datetime import datetime, timedelta
from jose import jwt
from app.config import settings  
def test_password_hashing():
    password = "admin1"
    hashed = hash_password(password)

    assert verify_password(password, hashed) is True
    assert verify_password("wrongpassword", hashed) is False


def test_create_access_token():
    data = {"sub": "admin@example.com"}
    token = create_access_token(data)

   
    decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    assert decoded["sub"] == "admin@example.com"
    assert "exp" in decoded
