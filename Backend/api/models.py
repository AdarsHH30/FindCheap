from django.db import models

# # Create your models here.


class User(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)

    def __str__(self):
        return self.username


class Products(models.Model):
    e_commerce_name = models.CharField(max_length=100, default="Unknown")
    product_name = models.CharField(max_length=255, blank=False, null=False)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    product_url = models.URLField(max_length=200, blank=True, null=True)
    product_image_url = models.URLField(max_length=200, blank=True, null=True)
    review_count = models.PositiveIntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)

    def __str__(self):
        return (
            f"{self.product_name} - {self.e_commerce_name} - ${self.product_price:.2f}"
        )
