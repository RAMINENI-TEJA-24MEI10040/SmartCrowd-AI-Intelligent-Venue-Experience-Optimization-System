import numpy as np
from datetime import datetime

class CrowdPredictor:
    def __init__(self):
        # In a real scenario, this would load a pre-trained ML model (e.g., sklearn, TensorFlow)
        pass

    def predict_density(self, zone_id: str, time: str) -> float:
        """
        Simulates crowd density prediction based on zone and time.
        Returns a value between 0.0 (empty) and 1.0 (overcrowded).
        """
        # Simulated logic: higher density near entry gates around start time, etc.
        base_density = 0.3
        
        # Add some random variance
        variance = np.random.uniform(-0.1, 0.4)
        
        density = min(max(base_density + variance, 0.0), 1.0)
        return round(density, 2)

    def predict_wait_time(self, stall_id: str, current_queue_length: int) -> int:
        """
        Predicts wait time in minutes based on current queue length.
        """
        # Simulated logic: ~2 minutes per person in queue
        base_time = current_queue_length * 2
        variance = np.random.randint(-2, 3)
        return max(base_time + variance, 1)

# Singleton instance
predictor = CrowdPredictor()
