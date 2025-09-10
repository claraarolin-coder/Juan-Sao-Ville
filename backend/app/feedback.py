from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import schemas, models, database
from app.database import get_db
from app.auth import require_role

router = APIRouter(
    prefix="/feedback",
    tags=["Feedback"]
)

@router.post("/", response_model=schemas.FeedbackOut)
def send_feedback(
    feedback: schemas.FeedbackCreate,
    db: Session = Depends(get_db)
):
    db_feedback = models.Feedback(**feedback.dict())
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback


@router.get("/", response_model=list[schemas.FeedbackOut])
def list_feedbacks(
    db: Session = Depends(get_db),
    user: models.User = Depends(require_role("admin")) 
):
    return db.query(models.Feedback).all()
