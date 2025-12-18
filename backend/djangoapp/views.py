import json
import os
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt

from .services.sentiment import analyze_sentiment
from .services.reviews_client import (
    list_dealers, get_dealer, list_reviews, add_review_to_service
)


@require_http_methods(["GET"])
def get_dealers(request):
    dealers = list_dealers()
    return JsonResponse({"dealers": dealers}, status=200)


@require_http_methods(["GET"])
def get_dealers_by_state(request, state: str):
    dealers = [d for d in list_dealers() if d.get('state', '').lower() == state.lower()]
    return JsonResponse({"dealers": dealers, "state": state}, status=200)


@require_http_methods(["GET"])
def get_dealer_by_id(request, dealer_id: int):
    dealer = get_dealer(dealer_id)
    if not dealer:
        return JsonResponse({"error": "Dealer not found"}, status=404)
    return JsonResponse(dealer, status=200)


@require_http_methods(["GET"])
def get_reviews_by_dealer(request, dealer_id: int):
    reviews = list_reviews(dealer_id)
    return JsonResponse({"dealer_id": dealer_id, "reviews": reviews}, status=200)


@csrf_exempt
@require_http_methods(["POST"])
def add_review(request):
    try:
        payload = json.loads(request.body.decode('utf-8'))
    except Exception:
        return HttpResponseBadRequest("Invalid JSON")

    review_text = payload.get('review') or payload.get('content') or ''
    dealer_id = payload.get('dealer_id')
    car = payload.get('car', {})  # {make, model, year}
    username = request.user.username if request.user and request.user.is_authenticated else payload.get('username', 'anonymous')

    if not dealer_id or not review_text:
        return JsonResponse({"error": "dealer_id dan review wajib diisi"}, status=400)

    sentiment = analyze_sentiment(review_text)

    saved = add_review_to_service({
        "dealer_id": dealer_id,
        "review": review_text,
        "sentiment": sentiment,
        "car": car,
        "username": username,
    })

    return JsonResponse({"result": "ok", "data": saved}, status=201)


@csrf_exempt
@require_http_methods(["POST"])
def login_view(request):
    try:
        payload = json.loads(request.body.decode('utf-8'))
    except Exception:
        return HttpResponseBadRequest("Invalid JSON")

    username = payload.get('username')
    password = payload.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        # kembalikan CSRF token agar frontend bisa kirim request POST berikutnya dengan aman
        csrf = get_token(request)
        return JsonResponse({"result": "ok", "username": username, "csrfToken": csrf}, status=200)
    else:
        return JsonResponse({"error": "Username atau password salah"}, status=401)


@csrf_exempt
@require_http_methods(["POST"])
def logout_view(request):
    logout(request)
    return JsonResponse({"result": "ok"}, status=200)


@csrf_exempt
@require_http_methods(["POST"])
def register_view(request):
    try:
        payload = json.loads(request.body.decode('utf-8'))
    except Exception:
        return HttpResponseBadRequest("Invalid JSON")

    username = payload.get('username')
    first_name = payload.get('first_name')
    last_name = payload.get('last_name')
    email = payload.get('email')
    password = payload.get('password')

    if not all([username, first_name, last_name, email, password]):
        return JsonResponse({"error": "Semua field wajib diisi"}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "Username sudah digunakan"}, status=400)

    user = User.objects.create_user(
        username=username,
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=password,
    )

    return JsonResponse({"result": "ok", "username": user.username}, status=201)
