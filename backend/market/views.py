from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Product
import json


@csrf_exempt
def upload_product(request):
    if request.method == "POST":
        data = json.loads(request.body)

        product = Product.objects.create(
            name=data["name"],
            price=data["price"],
            image=data["image"],
            description="Fresh farm product"
        )

        return JsonResponse({
            "message": "Product uploaded successfully",
            "id": product.id
        })

def get_products(request):
    products = Product.objects.all()

    data = []
    for product in products:
        data.append({
            "id": product.id,
            "name": product.name,
            "price": product.price,
            "image": product.image,
            "description": product.description
        })

    return JsonResponse(data, safe=False)