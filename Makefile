up:        ; docker compose up --build
test:      ; cd backend && pytest -q
admin:     ; cd backend && python scripts/create_admin.py $(EMAIL) "$(NAME)" $(PASS)
