from app.tests.conftest import login, make_user

REPORT = {"category": "illegal_logging", "description": "Trees cut near stream", "latitude": 12.9, "longitude": 75.1}


def test_register_always_citizen(client):
    r = client.post("/api/v1/auth/register", json={"full_name": "Asha", "email": "a@x.in", "password": "longenough123"})
    assert r.status_code == 201 and r.json()["roles"] == ["citizen"]


def test_bad_login(client, db):
    make_user(db, "c@x.in", "citizen")
    assert client.post("/api/v1/auth/login", json={"email": "c@x.in", "password": "wrong-password"}).status_code == 401


def test_requires_auth(client):
    assert client.get("/api/v1/reports").status_code == 401


def test_citizen_cannot_verify_or_admin(client, db):
    make_user(db, "c@x.in", "citizen")
    login(client, "c@x.in")
    rid = client.post("/api/v1/reports", json=REPORT).json()["id"]
    assert client.post(f"/api/v1/reports/{rid}/verify", json={"decision": "verified"}).status_code == 403
    assert client.get("/api/v1/admin/users").status_code == 403


def test_officer_verifies_and_audit_is_written(client, db):
    make_user(db, "c@x.in", "citizen")
    make_user(db, "o@x.in", "officer")
    make_user(db, "root@x.in", "super_admin")
    login(client, "c@x.in")
    rid = client.post("/api/v1/reports", json=REPORT).json()["id"]
    client.cookies.clear()
    login(client, "o@x.in")
    ok = client.post(f"/api/v1/reports/{rid}/verify", json={"decision": "verified"})
    assert ok.status_code == 200 and ok.json()["status"] == "verified"
    assert client.post(f"/api/v1/reports/{rid}/verify", json={"decision": "rejected"}).status_code == 409
    client.cookies.clear()
    login(client, "root@x.in")
    actions = [l["action"] for l in client.get("/api/v1/admin/audit-logs").json()]
    assert "report.verified" in actions and "report.create" in actions


def test_report_validation(client, db):
    make_user(db, "c@x.in", "citizen")
    login(client, "c@x.in")
    assert client.post("/api/v1/reports", json={**REPORT, "latitude": 200}).status_code == 422


def test_citizen_sees_only_own_reports(client, db):
    make_user(db, "a@x.in", "citizen")
    make_user(db, "b@x.in", "citizen")
    login(client, "a@x.in")
    client.post("/api/v1/reports", json=REPORT)
    client.cookies.clear()
    login(client, "b@x.in")
    assert client.get("/api/v1/reports").json() == []
