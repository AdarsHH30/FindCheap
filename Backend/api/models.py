from django.db import models


class SearchHistory(models.Model):
    search_query = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.search_query} at {self.timestamp}"
