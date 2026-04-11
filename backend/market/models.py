from django.db import models


# =========================
# PRODUCT MODEL
# =========================
class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.IntegerField()
    image = models.CharField(max_length=255)
    description = models.TextField(default="Fresh farm product")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# =========================
# USER MODEL
# =========================
class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    role = models.CharField(max_length=20)

    def __str__(self):
        return self.email


# =========================
# ORDER MODEL
# =========================
class Order(models.Model):
    order_id = models.CharField(max_length=100, unique=True)
    customer_name = models.CharField(max_length=100)
    total_amount = models.IntegerField()
    status = models.CharField(max_length=50, default="Order Placed")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.order_id