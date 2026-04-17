from fastapi import FastAPI
from routers import api

app = FastAPI(
    title="SmartCrowd AI Service",
    description="AI-powered APIs for crowd density and queue prediction",
    version="1.0.0"
)

app.include_router(api.router)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "SmartCrowd AI Service is running."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
