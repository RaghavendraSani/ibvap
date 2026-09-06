from fastapi import FastAPI

from backend.app.database import Base, engine
from backend.app.models import Camera


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="IBVAP Backend",
    version="1.0.0",
)


@app.get("/")
def root():
    return {
        "name": "IBVAP",
        "status": "online",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "database": "connected",
    }