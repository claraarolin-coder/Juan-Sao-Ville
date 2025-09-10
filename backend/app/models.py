from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)

    victims = relationship("Victim", back_populates="captured_by_user")
    rewards = relationship("Reward", back_populates="slave")

class Victim(Base):
    __tablename__ = "victims"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    skills = Column(String, nullable=False)
    status = Column(String, nullable=False)

    captured_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    captured_by_user = relationship("User", back_populates="victims")
class Reward(Base):
    __tablename__ = "rewards"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)  
    description = Column(String, nullable=True)
    points = Column(Integer, default=0)

    slave_id = Column(Integer, ForeignKey("users.id"))
    slave = relationship("User", back_populates="rewards")

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    message = Column(String, nullable=False)
    developer_email = Column(String, nullable=False)  
    created_at = Column(DateTime, default=datetime.utcnow)
