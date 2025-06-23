from django.db import models

# Create your models here.


class User(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    def __str__(self):
        return self.username


class Product(models.Model):
    product_name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    e-commerce=models.CharField(max_length=100, default='Unknown')
    def __str__(self):
        return self.name
