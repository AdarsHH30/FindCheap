from django.shortcuts import render
from django.http import JsonResponse
from scrape_utils import clean_data
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from asgiref.sync import async_to_sync


@api_view(["POST"])
def display_scraped_data(request):
    """
    API endpoint that accepts search queries via POST request
    """
    search_query = request.data.get("search_query")
    search_query = search_query.replace(" ", "+") if search_query else None

    if not search_query:
        return Response(
            {"error": "search_query is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    data = async_to_sync(clean_data.scrape_multiple_sites)(
        user_input=search_query,
    )

    return JsonResponse(data, status=status.HTTP_200_OK)
