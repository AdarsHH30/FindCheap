from django.shortcuts import render
from django.http import JsonResponse
from scrape_utils import clean_data
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


def handle_client_search_request(request):
    """
    Process incoming search data from the client request.
    """
    pass


def process_scraping_request(request):
    """
    Initiate and handle scraping logic based on user input.
    """
    pass


def respond_with_scraped_data(request):
    """
    Prepare and return the scraped data to the requesting client.
    """
    pass


def store_scraped_data(request):
    """
    Save scraped data into the database for future access.
    """
    pass


def retrieve_scraped_data_from_database(request):
    """
    Fetch previously stored scraped data from the database.
    """
    pass


from asgiref.sync import async_to_sync


@api_view(["POST"])
def display_scraped_data(request):
    """
    API endpoint that accepts search queries via POST request
    """
    search_query = request.data.get("search_query")

    if not search_query:
        return Response(
            {"error": "search_query is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    data = async_to_sync(clean_data.scrape_multiple_sites)(
        user_input=search_query,
    )

    return JsonResponse(data, status=status.HTTP_200_OK)
