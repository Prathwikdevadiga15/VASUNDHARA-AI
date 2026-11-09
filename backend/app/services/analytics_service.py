from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.report import Report


def report_counts(db: Session) -> dict:
    rows = db.execute(select(Report.status, func.count()).group_by(Report.status)).all()
    return {status: n for status, n in rows}
