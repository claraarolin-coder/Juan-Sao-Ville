from pydantic import BaseModel, EmailStr
from datetime import datetime
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str  # "admin" | "slave" | "developer"

class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
from pydantic import BaseModel

class RewardBase(BaseModel):
    title: str
    description: str | None = None
    points: int = 0

class RewardCreate(RewardBase):
    slave_id: int

class RewardOut(RewardBase):
    id: int
    slave_id: int

    class Config:
        from_attributes = True
class FeedbackBase(BaseModel):
    message: str
    developer_email: str

class FeedbackCreate(FeedbackBase):
    pass

class FeedbackOut(FeedbackBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True