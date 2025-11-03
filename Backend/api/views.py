from django.shortcuts import render
from django.http import JsonResponse, StreamingHttpResponse
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
import asyncio
import threading
import queue

from supabase import create_client


load_dotenv()
logger = logging.getLogger(__name__)
logger.setLevel(logging.WARNING)  # Changed from CRITICAL to see cache logs


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


@csrf_exempt
@supabase_auth_required
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
    from django.middleware.csrf import get_token
    from django.core.cache import cache

    """
    API endpoint that accepts search queries via POST request
    """

    try:

        search_query = request.data.get("search_query")

        search_query = search_query.replace(" ", "+").lower() if search_query else None

        if not search_query:
            return Response(
                {"error": "search_query is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cache_key = f"search_{search_query}"

        # Try to get from cache with error handling
        try:
            cached = cache.get(cache_key)
            if cached:
                logger.info(f"Cache hit for query: {search_query}")
                return JsonResponse(cached, status=status.HTTP_200_OK)
        except Exception as cache_error:
            logger.warning(f"Cache retrieval failed: {str(cache_error)}")
            # Continue to scrape if cache fails

        # Scrape the data
        data = async_to_sync(clean_data.scrape_multiple_sites)(
            user_input=search_query,
        )

        # Try to set cache with error handling
        try:
            cache.set(cache_key, data, timeout=600)
            logger.info(f"Cached results for query: {search_query}")
        except Exception as cache_error:
            logger.warning(f"Cache storage failed: {str(cache_error)}")
            # Return data even if caching fails

        return JsonResponse(data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in display_scraped_data: {str(e)}")
        return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)


@csrf_exempt
def stream_scraped_data(request):
    """
    SSE endpoint that streams each site's results as soon as they're ready.
    Usage: GET /search/stream/?q=iphone+15
    """
    from django.core.cache import cache

    try:
        search_query = request.GET.get("q")
        search_query = search_query.replace(" ", "+").lower() if search_query else None

        if not search_query:
            return StreamingHttpResponse(
                iter([b'event: error\ndata: {"error":"q is required"}\n\n']),
                content_type="text/event-stream",
            )

        def sse(data: dict, event: str = "result") -> bytes:
            return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n".encode(
                "utf-8"
            )

        # Check cache first
        cache_key = f"search_{search_query}"
        cached_data = None
        try:
            cached_data = cache.get(cache_key)
            if cached_data:
                logger.warning(f"Stream cache hit for query: {search_query}")
        except Exception as cache_error:
            logger.warning(f"Stream cache retrieval failed: {str(cache_error)}")

        def generator():
            # If we have cached data, stream it immediately
            if cached_data:
                yield b": keep-alive\n\n"
                yield sse({"status": "started", "cached": True}, event="start")
                # Stream each cached site result
                if isinstance(cached_data, list):
                    for site_data in cached_data:
                        yield sse(site_data, event="result")
                else:
                    # Backward compatibility - single result
                    yield sse(cached_data, event="result")
                yield sse({"status": "done", "cached": True}, event="done")
                return

            # Otherwise, scrape and cache
            out: "queue.Queue[dict | None]" = queue.Queue()
            all_results = []  # Collect all site results for caching

            def on_result(payload: dict):
                all_results.append(payload)
                out.put(payload)

            def run():
                try:
                    # Enforce a global timeout so the stream always ends
                    async_to_sync(asyncio.wait_for)(
                        clean_data.scrape_multiple_sites_stream(
                            user_input=search_query,
                            on_result=on_result,
                            total_timeout=90.0,
                        ),
                        timeout=95.0,
                    )
                finally:
                    # Cache ALL results (all e-commerce sites)
                    if all_results:
                        try:
                            cache.set(cache_key, all_results, timeout=600)
                            logger.warning(
                                f"Stream cached {len(all_results)} site results for query: {search_query}"
                            )
                        except Exception as cache_error:
                            logger.warning(
                                f"Stream cache storage failed: {str(cache_error)}"
                            )
                    out.put(None)

            threading.Thread(target=run, daemon=True).start()

            # Initial keep-alive and start event
            yield b": keep-alive\n\n"
            yield sse({"status": "started", "cached": False}, event="start")

            while True:
                item = out.get()
                if item is None:
                    break
                yield sse(item, event="result")

            yield sse({"status": "done", "cached": False}, event="done")

        response = StreamingHttpResponse(generator(), content_type="text/event-stream")
        response["Cache-Control"] = "no-cache"
        response["X-Accel-Buffering"] = "no"  # disable proxy buffering if any
        return response
    except Exception as e:
        logger.error(f"SSE stream error: {str(e)}")
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


@api_view(["GET"])
def scrape_test(request):
    try:
        test_query = "laptop"
        data = async_to_sync(clean_data.scrape_multiple_sites)(
            user_input=test_query,
        )
        return JsonResponse(data, status=status.HTTP_200_OK)
    except Exception as e:
        return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)


@csrf_exempt
@api_view(["GET"])
def check_cache_status(request):
    """
    Debug endpoint to check if a query is cached
    Usage: GET /api/cache-check/?q=iphone+15
    """
    from django.core.cache import cache

    try:
        search_query = request.GET.get("q", "")
        if not search_query:
            return JsonResponse({"error": "q parameter required"}, status=400)

        search_query = search_query.replace(" ", "+").lower()
        cache_key = f"search_{search_query}"

        # Check if cached
        cached_data = cache.get(cache_key)

        if cached_data:
            # Determine data structure and count
            if isinstance(cached_data, list):
                # Streaming format: list of site results
                sites_cached = [item.get("site", "unknown") for item in cached_data]
                total_products = sum(
                    len(item.get("results", [])) for item in cached_data
                )
                data_info = {
                    "format": "streaming",
                    "sites": sites_cached,
                    "site_count": len(cached_data),
                    "total_products": total_products,
                }
            elif isinstance(cached_data, dict):
                # Regular format: dict of {site: results}
                sites_cached = list(cached_data.keys())
                total_products = sum(
                    len(results)
                    for results in cached_data.values()
                    if isinstance(results, list)
                )
                data_info = {
                    "format": "regular",
                    "sites": sites_cached,
                    "site_count": len(sites_cached),
                    "total_products": total_products,
                }
            else:
                data_info = {"format": "unknown", "data": str(type(cached_data))}

            return JsonResponse(
                {
                    "cached": True,
                    "cache_key": cache_key,
                    "query": search_query,
                    "has_data": True,
                    **data_info,
                    "message": f"This query is cached with {data_info.get('site_count', 0)} e-commerce sites",
                }
            )
        else:
            return JsonResponse(
                {
                    "cached": False,
                    "cache_key": cache_key,
                    "query": search_query,
                    "message": "This query is not cached and will require scraping",
                }
            )
    except Exception as e:
        return JsonResponse({"error": f"Error checking cache: {str(e)}"}, status=500)
