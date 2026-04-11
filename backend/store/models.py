from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.IntegerField()
    image = models.CharField(max_length=255)
    description = models.TextField(default="Fresh farm product")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    role = models.CharField(max_length=20)

    def __str__(self):
        return self.email

class Order(models.Model):
    order_id = models.CharField(max_length=100)
    user_email = models.EmailField()
    items = models.TextField()
    total = models.IntegerField()
    date = models.CharField(max_length=100)
    status = models.CharField(max_length=50, default="Order Placed")

    def __str__(self):
        return self.order_id