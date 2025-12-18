import os
from typing import List, Dict, Any
import requests

REVIEWS_BASE = os.environ.get('REVIEWS_API_BASE', 'http://localhost:5001')
DEALERS_BASE = os.environ.get('DEALERS_API_BASE', 'http://localhost:5001')

# Fallback mock data jika service Node/NoSQL belum tersedia
_MOCK_DEALERS = [
    {"id": 1, "full_name": "Best Cars Seattle", "city": "Seattle", "state": "WA"},
    {"id": 2, "full_name": "Sunshine Motors Miami", "city": "Miami", "state": "FL"},
    {"id": 3, "full_name": "Windy City Autos", "city": "Chicago", "state": "IL"},
]

_MOCK_REVIEWS = {
    1: [
        {"id": 101, "dealer_id": 1, "username": "alice", "review": "Great service!", "sentiment": "positive"},
        {"id": 102, "dealer_id": 1, "username": "bob", "review": "Average experience.", "sentiment": "neutral"},
    ],
    2: [
        {"id": 201, "dealer_id": 2, "username": "carol", "review": "Not satisfied", "sentiment": "negative"},
    ],
}


def _safe_get(url: str, default):
    try:
        r = requests.get(url, timeout=5)
        if r.ok:
            return r.json()
    except Exception:
        pass
    return default


def list_dealers() -> List[Dict[str, Any]]:
    url = f"{DEALERS_BASE}/dealers"
    data = _safe_get(url, None)
    if isinstance(data, dict) and 'dealers' in data:
        return data['dealers']
    return _MOCK_DEALERS


def get_dealer(dealer_id: int) -> Dict[str, Any] | None:
    url = f"{DEALERS_BASE}/dealers/{dealer_id}"
    data = _safe_get(url, None)
    if isinstance(data, dict) and data:
        return data
    for d in _MOCK_DEALERS:
        if d['id'] == dealer_id:
            return d
    return None


def list_reviews(dealer_id: int) -> List[Dict[str, Any]]:
    url = f"{REVIEWS_BASE}/reviews/dealer/{dealer_id}"
    data = _safe_get(url, None)
    if isinstance(data, dict) and 'reviews' in data:
        return data['reviews']
    return _MOCK_REVIEWS.get(dealer_id, [])


def add_review_to_service(review: Dict[str, Any]) -> Dict[str, Any]:
    url = f"{REVIEWS_BASE}/reviews"
    try:
        r = requests.post(url, json=review, timeout=5)
        if r.ok:
            return r.json()
    except Exception:
        pass
    # fallback mock save
    dealer_id = int(review.get('dealer_id'))
    new_id = max([rv.get('id', 0) for rv in sum(_MOCK_REVIEWS.values(), [])] + [100]) + 1
    saved = {
        "id": new_id,
        **review,
    }
    _MOCK_REVIEWS.setdefault(dealer_id, []).append(saved)
    return saved
