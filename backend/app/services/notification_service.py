from sqlalchemy.orm import Session

from app.models.report import Alert


def create_unverified_alert(db: Session, title: str, severity: str, description: str | None = None) -> Alert:
    """Alerts start unverified. A human officer must verify before they are treated as findings."""
    a = Alert(title=title, severity=severity, description=description)
    db.add(a)
    db.commit()
    return a
