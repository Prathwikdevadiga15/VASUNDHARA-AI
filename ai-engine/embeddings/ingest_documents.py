"""Chunk a verified PDF and store embeddings. Usage: python ingest_documents.py file.pdf "Title" "Source URL"
Run from backend/ so app imports resolve. Requires GEMINI_API_KEY and a PostgreSQL DATABASE_URL."""
import sys

from pypdf import PdfReader
from sqlalchemy import text

from app.core.database import SessionLocal
from app.services.llm_service import embed

path, title, url = sys.argv[1:4]
pages = [p.extract_text() or "" for p in PdfReader(path).pages]
full = "\n".join(pages)
chunks = [full[i:i + 1200] for i in range(0, len(full), 1000)]  # 200 char overlap
with SessionLocal() as db:
    doc_id = db.execute(text("INSERT INTO documents(title, source_url) VALUES (:t,:u) RETURNING id"), {"t": title, "u": url}).scalar()
    for i, c in enumerate(chunks):
        db.execute(text("INSERT INTO document_chunks(document_id, chunk_index, chunk_text, embedding) VALUES (:d,:i,:c, CAST(:e AS vector))"),
                   {"d": doc_id, "i": i, "c": c, "e": str(embed(c))})
    db.commit()
print(f"Stored {len(chunks)} chunks.")
