from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import Product, User, Order
import json


# =========================
# GET ALL PRODUCTS
# =========================
def products(request):
    all_products = Product.objects.all().values()
    return JsonResponse(list(all_products), safe=False)


# =========================
# REGISTER USER
# =========================
@csrf_exempt
def register_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            if User.objects.filter(email=data["email"]).exists():
                return JsonResponse({
                    "message": "Email already registered"
                }, status=400)

            user = User.objects.create(
                name=data["name"],
                email=data["email"],
                password=data["password"],
                phone=data["phone"],
                role=data["role"]
            )

            return JsonResponse({
                "message": "Registered successfully",
                "role": user.role
            })

        except Exception as e:
            return JsonResponse({
                "message": str(e)
            }, status=500)


# =========================
# LOGIN USER
# =========================
@csrf_exempt
def login_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            user = User.objects.get(
                email=data["email"],
                password=data["password"]
            )

            return JsonResponse({
                "message": "Login success",
                "role": user.role,
                "name": user.name,
                "email": user.email
            })

        except User.DoesNotExist:
            return JsonResponse({
                "message": "Invalid login"
            }, status=400)

        except Exception as e:
            return JsonResponse({
                "message": str(e)
            }, status=500)


# =========================
# UPLOAD PRODUCT
# =========================
@csrf_exempt
def upload_product(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            Product.objects.create(
                name=data["name"],
                price=data["price"],
                image=data["image"],
                description="Fresh farm product"
            )

            return JsonResponse({
                "message": "Product uploaded successfully"
            })

        except Exception as e:
            return JsonResponse({
                "message": str(e)
            }, status=500)


# =========================
# PLACE ORDER
# =========================
@csrf_exempt
def place_order(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            order = Order.objects.create(
                order_id=data["order_id"],
                user_email=data["user_email"],
                items=json.dumps(data["items"]),
                total=data["total"],
                date=data["date"],
                payment_method=data["payment_method"],
                status="Order Placed"
            )

            return JsonResponse({
                "message": "Order placed successfully",
                "order_id": order.order_id
            })

        except Exception as e:
            return JsonResponse({
                "message": str(e)
            }, status=500)


# =========================
# USER ORDERS
# =========================
def user_orders(request, email):
    orders = Order.objects.filter(user_email=email).values()
    return JsonResponse(list(orders), safe=False)


# =========================
# ALL ORDERS
# =========================
def all_orders(request):
    orders = Order.objects.all().values()
    return JsonResponse(list(orders), safe=False)


# =========================
# UPDATE ORDER STATUS
# =========================
@csrf_exempt
def update_order_status(request, order_id):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            order = Order.objects.get(order_id=order_id)
            order.status = data["status"]
            order.save()

            return JsonResponse({
                "message": "Status updated successfully"
            })

        except Order.DoesNotExist:
            return JsonResponse({
                "message": "Order not found"
            }, status=404)

        except Exception as e:
            return JsonResponse({
                "message": str(e)
            }, status=500)