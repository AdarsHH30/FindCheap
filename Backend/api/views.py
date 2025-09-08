from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
from django.views.decorators.http import require_http_methods
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
from django.middleware.csrf import get_token

from supabase import create_client


load_dotenv()
logger = logging.getLogger(__name__)
logger.setLevel(logging.WARNING)


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


# @ensure_csrf_cookie
# def csrf(request):+
#     return JsonResponse({"detail": "CSRF cookie set"})


@ensure_csrf_cookie
@require_http_methods(["GET"])
def csrf(request):
    """
    Return CSRF token for the client.
    This endpoint ensures the CSRF cookie is set.
    """
    return JsonResponse({"csrfToken": get_token(request), "message": "CSRF cookie set"})


# varify the csrf token
@csrf_protect
@require_http_methods(["POST"])
def secure_post(request):
    return JsonResponse({"message": "POST accepted"})


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


@api_view(["GET", "POST"])
# @supabase_auth_required
def get_recent_searches(request):
    """
    Retrieve recent searches for a specific user.
    """
    try:
        user_id = request.GET.get("user_id")
        if not user_id:
            return Response(
                {"error": "user_id parameter is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        response = (
            supabase.table("recent_searches")
            .select("query", "searched_at", "id")
            .eq("user_id", user_id)
            .order("searched_at", desc=True)
            .execute()
        )
        return Response(
            {
                "searches": response.data,
                "message": "Recent searches fetched successfully",
            },
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        logger.error(f"Error fetching recent searches: {str(e)}")
        return Response(
            {"error": f"Failed to fetch recent searches: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


def varify_access_tocken(request):
    try:
        user = request.user_data
        logger.info(f"User {user['email']} exists in the database.")
        return JsonResponse({"message": f'Hello {user["email"]}'})
    except Exception as e:
        return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)


# TODO: Fix this delete function
@csrf_exempt
@api_view(["DELETE"])
def delete_search(request):
    print("Entered delete_search function")
    """
    API endpoint to delete a user's search query.
    """
    try:
        user_id = request.data.get("user_id")
        print(f"User ID: {user_id}")
        if not user_id:
            return Response(
                {"error": "user_id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        search_id = request.data.get("search_id")
        print(f"Search ID: {search_id}")
        if not search_id:
            return Response(
                {"error": "search_id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            response = (
                supabase.table("recent_searches")
                .delete()
                .eq("id", search_id)
                .eq("user_id", user_id)
                .execute()
            )

            if not response.data:
                return Response(
                    {"error": "No matching search found to delete"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            return JsonResponse({"message": "Search deleted successfully"}, status=200)

        except Exception as supabase_error:
            print(f"Supabase error: {str(supabase_error)}")
            return Response(
                {"error": "Failed to delete search"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    except Exception as e:
        logger.error(f"Error deleting search: {str(e)}")
        return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)


@ensure_csrf_cookie
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
        # with open("scraped_data.json", "w") as f:
        #     json.dump(data, f, indent=4)

        return JsonResponse(data, status=status.HTTP_200_OK)
    except Exception as e:
        return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)


@csrf_exempt
@api_view(["GET"])
def get_auth_status(request):
    """
    API endpoint to get the authentication status of the user.
    Returns authentication status and user data if authenticated.
    """
    try:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            access_token = auth_header.split(" ")[1]
            response = supabase.auth.get_user(access_token)
            user = response.user if hasattr(response, "user") else None

            if user:
                return JsonResponse(
                    {
                        "is_authenticated": True,
                        "user": {
                            "id": user.id,
                            "email": user.email,
                            "user_metadata": user.user_metadata,
                        },
                    },
                    status=200,
                )

        return JsonResponse({"is_authenticated": False}, status=200)
    except Exception as e:
        logger.error(f"Authentication status error: {str(e)}")
        return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)
