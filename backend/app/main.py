from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import func
from fastapi.middleware.cors import CORSMiddleware
from app.database import get_db
from app import database, models
from sqlalchemy.orm import Session
from app.auth import get_current_user
from app.schemas import UserCreate, UserOut, Token
from app.auth import (
    hash_password, verify_password, create_access_token,
    SECRET_KEY, ALGORITHM
)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],  # ports possibles de Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app import rewards, feedback
app.include_router(rewards.router)
app.include_router(feedback.router)

@app.on_event("startup")
def on_startup():
    print(">>> Creating tables if not exist...")
    models.Base.metadata.create_all(bind=database.engine)

@app.get("/leaderboard")
def leaderboard(
    db: Session = Depends(database.get_db),
    user: models.User = Depends(lambda: require_role("admin"))
):
    results = (
        db.query(
            models.User.email,
            func.count(models.Victim.id).label("victim_count")
        )
        .join(models.Victim, models.User.id == models.Victim.captured_by, isouter=True)
        .filter(models.User.role == "slave")
        .group_by(models.User.id)
        .order_by(func.count(models.Victim.id).desc())
        .all()
    )
    return [
        {"email": email, "victim_count": victim_count}
        for email, victim_count in results
    ]

@app.get("/")
def read_root():
    return {"message": "Welcome to Juan Sao Ville's system 👹"}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_db():
    return database.get_db()

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(database.get_db)
) -> models.User:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_error
    except JWTError:
        raise credentials_error
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise credentials_error
    return user

def require_role(*allowed_roles: str):
    def checker(user: models.User = Depends(get_current_user)):
        if user.role not in allowed_roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user
    return checker

@app.post("/auth/register", response_model=UserOut)
def register(user_in: UserCreate, db: Session = Depends(database.get_db)):
    if db.query(models.User).filter(models.User.email == user_in.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = models.User(
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        role=user_in.role.lower()
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@app.post("/auth/login", response_model=Token)
def login(
    form: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.email == form.username).first()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

class VictimCreate(BaseModel):
    name: str
    skills: str
    status: str

@app.post("/victims")
def add_victim(
    victim: VictimCreate,
    db: Session = Depends(database.get_db),
    user: models.User = Depends(require_role("slave", "admin"))
):
    db_victim = models.Victim(
        name=victim.name,
        skills=victim.skills,
        status=victim.status,
        captured_by=user.id if user.role == "slave" else None
    )
    db.add(db_victim)
    db.commit()
    db.refresh(db_victim)
    return db_victim

@app.get("/victims")
def list_victims(
    db: Session = Depends(database.get_db),
    user: models.User = Depends(require_role("admin", "slave"))
):
    return db.query(models.Victim).all()

@app.get("/public/resistance")
def resistance_public_page():
    return {"tips": ["Avoid dark meetups", "Use strong passwords", "Report suspicious activity"]}
@app.get("/me")
def read_users_me(
    current_user: models.User = Depends(get_current_user)
):
    return {"id": current_user.id, "email": current_user.email, "role": current_user.role}