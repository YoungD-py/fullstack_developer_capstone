from django.urls import path
from . import views

urlpatterns = [
    path('get_dealers/', views.get_dealers, name='get_dealers'),
    path('get_dealers/<str:state>/', views.get_dealers_by_state, name='get_dealers_by_state'),
    path('dealer/<int:dealer_id>/', views.get_dealer_by_id, name='get_dealer_by_id'),
    path('reviews/dealer/<int:dealer_id>/', views.get_reviews_by_dealer, name='get_reviews_by_dealer'),
    path('add_review/', views.add_review, name='add_review'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name='register'),  # tambahan agar form Register.jsx berfungsi
]