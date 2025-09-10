from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db
from app.auth import require_role

router = APIRouter(
    prefix="/rewards",
    tags=["Rewards"]
)

@router.post("/", response_model=schemas.RewardOut)
def create_reward(
    reward: schemas.RewardCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_role("admin"))  
):
    slave = db.query(models.User).filter(models.User.id == reward.slave_id).first()
    if not slave or slave.role != "slave":
        raise HTTPException(status_code=400, detail="Invalid slave_id")

    db_reward = models.Reward(**reward.dict())
    db.add(db_reward)
    db.commit()
    db.refresh(db_reward)
    return db_reward


@router.get("/slave/{slave_id}", response_model=list[schemas.RewardOut])
def get_rewards_for_slave(
    slave_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_role("admin", "slave"))  
):
    rewards = db.query(models.Reward).filter(models.Reward.slave_id == slave_id).all()
    return rewards

@router.get("/", response_model=list[schemas.RewardOut])
def get_all_rewards(
    db: Session = Depends(get_db),
    user: models.User = Depends(require_role(["admin"]))
):
    return db.query(models.Reward).all()

