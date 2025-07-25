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
from supabase import create_client


load_dotenv()
logger = logging.getLogger(__name__)
logger.setLevel(logging.WARNING)


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def insert_user_data(user_data, user_id):
    """
    Insert user data into the 'users' table in Supabase.
    """
    try:
        response = supabase.table("users").insert(user_data).execute()
        if response.status_code == 201:
            logger.info("User data inserted successfully")
        else:
            logger.error("Failed to insert user data: %s", response.error)
    except Exception as e:
        logger.exception("Error inserting user data: %s", str(e))


def is_user_exists(user_id):
    """
    Check if a user exists in the 'users' table in Supabase.
    """
    try:
        response = supabase.table("users").select("*").eq("user_id", user_id).execute()
        if response.data:
            return True
        else:
            return False
    except Exception as e:
        return False


@csrf_exempt
@supabase_auth_required
@api_view(["POST"])
def varify_access_tocken(request):
    try:
        user = request.user_data
        # is_user_exists(user["user_id"])
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
