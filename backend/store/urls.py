from django.urls import path
from .views import (
    products,
    upload_product,
    register_user,
    login_user,
    place_order,
    user_orders,
    all_orders,
    update_order_status
)

urlpatterns = [
    path("products/", products),
    path("upload-product/", upload_product),
    path("register/", register_user),
    path("login/", login_user),
    path("place-order/", place_order),
    path("orders/<str:email>/", user_orders),
    path("all-orders/", all_orders),
    path("update-order/<str:order_id>/", update_order_status),
]