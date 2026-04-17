from fastapi import APIRouter
from pydantic import BaseModel
from models.predict import predictor

router = APIRouter()

class DensityRequest(BaseModel):
    zone_id: str
    time: str

class WaitTimeRequest(BaseModel):
    stall_id: str
    current_queue_length: int

@router.post("/predict/density")
def get_crowd_density(req: DensityRequest):
    """
    Predicts the crowd density for a given zone at a given time.
    """
    density = predictor.predict_density(req.zone_id, req.time)
    return {"zone_id": req.zone_id, "predicted_density": density}

@router.post("/predict/wait-time")
def get_wait_time(req: WaitTimeRequest):
    """
    Predicts the waiting time for a given stall or gate.
    """
    wait_time = predictor.predict_wait_time(req.stall_id, req.current_queue_length)
    return {"stall_id": req.stall_id, "predicted_wait_time_minutes": wait_time}

@router.get("/optimize/routes")
def get_optimal_routes(start: str, end: str):
    """
    Suggests the optimal route considering current crowd density.
    (Simulated response)
    """
    # In reality, this would use a graph algorithm (like Dijkstra/A*) 
    # where edge weights are dynamically adjusted by predicted density.
    return {
        "start": start,
        "end": end,
        "optimal_route": [start, "Zone_B", "Zone_D", end],
        "estimated_time_minutes": 15
    }
