from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from scrape_utils import clean_data
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .middleware import supabase_auth_required

import requests
from asgiref.sync import async_to_sync
from dotenv import load_dotenv
import os
import logging
import json

load_dotenv()
logger = logging.getLogger(__name__)
logger.setLevel(logging.WARNING)


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")


@csrf_exempt
@supabase_auth_required
@api_view(["POST"])
def varify_access_tocken(request):

    try:
        user = request.user_data
        logger.info(
            "User data received: %s",
            {
                k: v
                for k, v in user.items()
                if k not in ["app_metadata", "user_metadata"]
            },
        )

        # Return response
        logger.info("Returning successful response")
        return JsonResponse({"message": f'Hello {user["email"]}'})
    except Exception as e:
        logger.exception("Error in varify_access_tocken: %s", str(e))
        return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)


@csrf_exempt
@api_view(["POST"])
def display_scraped_data(request):
    """
    API endpoint that accepts search queries via POST request
    """
    logger.info("Entered display_scraped_data view function")
    logger.info("Request method: %s", request.method)
    logger.info("Request content type: %s", request.content_type)

    try:
        # Log request data
        logger.info("Request data: %s", request.data)

        search_query = request.data.get("search_query")
        logger.info("Original search query: %s", search_query)

        search_query = search_query.replace(" ", "+") if search_query else None
        logger.info("Processed search query: %s", search_query)

        if not search_query:
            logger.warning("No search query provided")
            return Response(
                {"error": "search_query is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        logger.info("Starting scraping process for: %s", search_query)
        data = async_to_sync(clean_data.scrape_multiple_sites)(
            user_input=search_query,
        )
        logger.info(
            "Scraping completed, data length: %s items",
            len(data) if isinstance(data, list) else "N/A",
        )

        return JsonResponse(data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.exception("Error in display_scraped_data: %s", str(e))
        return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)
