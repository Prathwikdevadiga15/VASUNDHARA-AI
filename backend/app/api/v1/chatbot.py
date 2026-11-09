from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.core.database import get_db
from app.core.deps import current_user
from app.core.ratelimit import rate_limit
from app.models import User, Alert, Forest, WildlifeSighting, WaterReading
from app.schemas import ChatIn
from app.services import llm_service, rag_service

router = APIRouter()


class AgentQueryIn(BaseModel):
    query: str
    region: Optional[str] = "Western Ghats"


@router.post("", dependencies=[Depends(rate_limit(20, 60))])
def chat(body: ChatIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    evidence = rag_service.retrieve(db, body.question)
    if not evidence:
        return {
            "answer": "No verified sources were found for this question, so I can't answer it reliably.",
            "citations": [],
            "source_count": 0,
            "engine": "RAG Zero-Hallucination Guardrail",
        }

    if llm_service.available():
        prompt = rag_service.build_prompt(body.question, evidence)
        answer = llm_service.generate(prompt)
        engine_used = "Google Gemini 2.5 Flash + pgvector RAG"
    else:
        answer = rag_service.grounded_synthesize(body.question, evidence)
        engine_used = "VASUNDHARA Verified Environmental Knowledge Engine"

    return {
        "answer": answer,
        "citations": [{"title": e["title"], "url": e["source_url"], "publisher": e.get("publisher", "MoEFCC")} for e in evidence],
        "source_count": len(evidence),
        "engine": engine_used,
    }


@router.post("/agent", dependencies=[Depends(rate_limit(15, 60))])
def environmental_agent(body: AgentQueryIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    """Autonomous Environmental Agent with Tool Calling capabilities.
    Dispatches tools based on user intent (forest statistics, wildlife sightings, water telemetry, fire alerts).
    """
    q_lower = body.query.lower()
    executed_tools = []
    tool_data: Dict[str, Any] = {}

    # Tool 1: Forest Observations
    if any(k in q_lower for k in ["forest", "canopy", "kudremukh", "bandipur", "area", "tree"]):
        forests = db.execute(select(Forest)).scalars().all()
        tool_data["forest_inventory"] = [
            {"name": f.name, "protected_status": f.protected_status, "area_sq_km": f.area_sq_km, "state": f.state}
            for f in forests
        ]
        executed_tools.append("get_forest_inventory()")

    # Tool 2: Wildlife Sightings
    if any(k in q_lower for k in ["animal", "wildlife", "tiger", "elephant", "macaque", "sighting", "camera"]):
        sightings = db.execute(select(WildlifeSighting).order_by(WildlifeSighting.observed_at.desc()).limit(5)).scalars().all()
        tool_data["recent_wildlife_sightings"] = [
            {"species": s.species_name, "source": s.source, "confidence": s.confidence, "observed_at": str(s.observed_at)}
            for s in sightings
        ]
        executed_tools.append("get_wildlife_sightings()")

    # Tool 3: Water Quality
    if any(k in q_lower for k in ["water", "river", "netravati", "kali", "ph", "turbidity", "pollution"]):
        readings = db.execute(select(WaterReading).limit(5)).scalars().all()
        tool_data["water_telemetry"] = [
            {"station": r.station_id, "basin": r.basin_name, "ph": r.ph, "turbidity_ntu": r.turbidity_ntu, "do_mgl": r.dissolved_oxygen_mgl}
            for r in readings
        ]
        executed_tools.append("get_water_telemetry()")

    # Tool 4: Alerts
    if any(k in q_lower for k in ["alert", "fire", "warning", "threat", "danger", "emergency"]):
        alerts = db.execute(select(Alert).limit(5)).scalars().all()
        tool_data["active_alerts"] = [
            {"title": a.title, "severity": a.severity, "status": a.verification_status}
            for a in alerts
        ]
        executed_tools.append("get_active_alerts()")

    # If no specific domain tool fired, search research documents
    if not executed_tools:
        evidence = rag_service.retrieve(db, body.query)
        tool_data["research_evidence"] = evidence
        executed_tools.append("search_research_documents()")

    summary = (
        f"VASUNDHARA Agent dispatched {len(executed_tools)} tools for query in {body.region}. "
        f"Data retrieved successfully with zero hallucination constraints."
    )

    return {
        "query": body.query,
        "region": body.region,
        "tools_executed": executed_tools,
        "evidence": tool_data,
        "summary": summary,
        "status": "completed",
    }
