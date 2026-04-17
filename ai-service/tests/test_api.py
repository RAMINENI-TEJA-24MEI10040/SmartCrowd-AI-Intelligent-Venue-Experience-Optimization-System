from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_predict_density():
    payload = {
        "zone_id": "zone_A",
        "time": "2024-01-01T12:00:00Z"
    }
    response = client.post("/predict/density", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "predicted_density" in data
    assert 0.0 <= data["predicted_density"] <= 1.0
    assert data["zone_id"] == "zone_A"

def test_predict_wait_time():
    payload = {
        "stall_id": "food_1",
        "current_queue_length": 10
    }
    response = client.post("/predict/wait-time", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "predicted_wait_time_minutes" in data
    assert data["predicted_wait_time_minutes"] >= 1
    assert data["stall_id"] == "food_1"

def test_optimize_routes():
    response = client.get("/optimize/routes?start=Gate_A&end=Seat_100")
    assert response.status_code == 200
    data = response.json()
    assert data["start"] == "Gate_A"
    assert data["end"] == "Seat_100"
    assert "optimal_route" in data
