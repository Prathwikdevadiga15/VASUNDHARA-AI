# VASUNDHARA AI – Security Architecture

**Standard:** Zero-Trust Environmental Data Defense & Access Control  
**Regulatory Compliance:** India Digital Personal Data Protection (DPDP) Act & Wildlife Protection Directives

---

## 1. Authentication & Session Security

1. **Password Hashing:**
   - Evaluated using **Argon2id** (`argon2-cffi`), resisting GPU-accelerated dictionary attacks and side-channel timing analysis.
2. **Session / Token Handling:**
   - Tokens issued as **HS256 JWTs** with cryptographic validation against `JWT_SECRET`.
   - Stored in `HttpOnly`, `SameSite=Lax`, `Secure` cookies preventing Cross-Site Scripting (XSS) credential exfiltration.
   - Authorization headers (`Bearer <token>`) supported for programmatic and sensor API integration.
3. **Role-Based Access Control (RBAC):**
   - Distinct roles enforced at the gateway dependency layer (`require(permission_code)`):
     - `citizen`: Can report incidents, track own complaints, view public intelligence.
     - `officer`: Can verify incidents, update field investigation dossiers, trigger alerts.
     - `researcher`: Accesses raw sensor data, satellite observations, model registries.
     - `ngo`: Manages conservation campaigns, habitat restoration, volunteers.
     - `super_admin`: Full governance, user provisioning, system settings, audit logs.

---

## 2. Wildlife Location Obfuscation (Anti-Poaching)

- **Vulnerability:** Unrestricted publication of exact GPS coordinates of endangered species (e.g., Bengal Tiger, King Cobra, Asian Elephant) could be exploited by poachers.
- **Remediation:**
  - Sensitive species occurrences are automatically flagged via `is_sensitive = TRUE`.
  - Non-officer and public API responses fuzz coordinates to a generalized 10-km bounding grid.
  - Full precision coordinates are restricted exclusively to verified forest conservators and authorized field rangers.

---

## 3. Data Protection & Input Sanitization

- **SQL Injection Prevention:** Strictly parameterized ORM queries via SQLAlchemy 2.0; no raw string concatenation in SQL queries.
- **Cross-Site Request Forgery (CSRF):** SameSite cookie policies combined with CORS origin whitelisting (`ALLOWED_ORIGINS`).
- **Rate Limiting:** Sliding-window rate limiters on computationally intensive endpoints:
  - AI Assistant / RAG: 20 requests/minute.
  - Image / Satellite inference: 15 requests/minute.
  - Authentication: 5 login attempts/minute with exponential backoff.
- **Audit Trails:** Immutable append-only log in `audit_logs` capturing `actor_id`, `action`, `resource_id`, timestamp, and client metadata.

