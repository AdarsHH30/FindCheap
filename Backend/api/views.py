from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
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
from supabase import create_client


load_dotenv()
logger = logging.getLogger(__name__)
logger.setLevel(logging.WARNING)


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


@ensure_csrf_cookie
def csrf(request):
    return JsonResponse({"detail": "CSRF cookie set"})


def save_recent_search(user_id, search_text):
    data = {"user_id": user_id, "query": search_text}
    supabase.table("recent_searches").insert(data).execute()


@csrf_exempt
@supabase_auth_required
@api_view(["POST", "GET"])
def save_search(request):
    """
    API endpoint to save a user's search query.
    """
    try:
        user = request.user_data
        user_id = user.get("id")
        search_text = request.data.get("search_text")
        print(f"User ID: {user_id}, Search Text: {search_text}")

        if not search_text:
            return Response(
                {"error": "search_text is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        save_recent_search(user_id, search_text)
        logger.info(f"Search saved for user {user['email']}: {search_text}")

        return JsonResponse({"message": "Search saved successfully"}, status=200)
    except Exception as e:
        logger.error(f"Error saving search: {str(e)}")
        return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)


def varify_access_tocken(request):
    try:
        user = request.user_data
        logger.info(f"User {user['email']} exists in the database.")
        return JsonResponse({"message": f'Hello {user["email"]}'})
    except Exception as e:
        return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)


@csrf_exempt
@api_view(["POST"])
def display_scraped_data(request):
    """
    API endpoint that accepts search queries via POST request
    """
    try:

        search_query = request.data.get("search_query")

        search_query = search_query.replace(" ", "+") if search_query else None

        if not search_query:
            return Response(
                {"error": "search_query is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = async_to_sync(clean_data.scrape_multiple_sites)(
            user_input=search_query,
        )

        return JsonResponse(data, status=status.HTTP_200_OK)
    except Exception as e:
        return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)
