from predictor import predict_fare

def run_test(name, **kwargs):
    price = predict_fare(**kwargs)
    print("\n" + "-" * 60)
    print(name)
    print("-" * 60)
    print(f"Predicted Fare: ₹{price:,.2f}")
    assert price > 0, (
        "Prediction should be greater than zero"
    )
    assert price < 1_000_000, (
        "Prediction is unrealistically high"
    )

def main():
    base_flight = {
        "airline": "Indigo",
        "source": "Delhi",
        "destination": "Mumbai",
        "departure_date": "2026-09-15",
        "departure_time": "10:30 AM",
        "arrival_time": "12:45 PM",
        "duration": "2h 15m",
        "total_stops": 0,
        "distance_km": 1150,
        "travel_class": "Economy",
        "days_before_departure": 30,
        "season": "Monsoon",
        "weekday": "Tuesday",
        "aircraft_type": "Airbus A320",
        "booking_channel": "Website",
        "passenger_count": 1,
    }
    # --------------------------------------------------------
    # Test 1 — Normal economy flight
    # --------------------------------------------------------
    run_test(
        "Test 1 — Economy / Direct",
        **base_flight,
    )
    # --------------------------------------------------------
    # Test 2 — Business class
    # --------------------------------------------------------
    business_flight = base_flight.copy()
    business_flight[
        "travel_class"
    ] = "Business"
    run_test(
        "Test 2 — Business Class",
        **business_flight,
    )
    # --------------------------------------------------------
    # Test 3 — Multiple stops
    # --------------------------------------------------------
    multi_stop_flight = base_flight.copy()
    multi_stop_flight[
        "total_stops"
    ] = 2
    multi_stop_flight[
        "duration"
    ] = "6h 30m"
    run_test(
        "Test 3 — Multiple Stops",
        **multi_stop_flight,
    )
    # --------------------------------------------------------
    # Test 4 — International flight
    # --------------------------------------------------------
    international_flight = {
        **base_flight,
        "airline": "Emirates",
        "source": "Delhi",
        "destination": "Dubai",
        "departure_time": "11:30 PM",
        "arrival_time": "2:00 AM",
        "duration": "3h 30m",
        "distance_km": 2200,
        "travel_class": "Economy",
    }
    run_test(
        "Test 4 — International Flight",
        **international_flight,
    )
    print("\n" + "=" * 60)
    print("ALL PREDICTION TESTS PASSED")
    print("=" * 60)

if __name__ == "__main__":
    main()