import requests
from django.http import JsonResponse
from dotenv import load_dotenv
import os
import logging

load_dotenv()
logger = logging.getLogger(__name__)
logger.setLevel(logging.WARNING)


def supabase_auth_required(view_func):
    logger.info("Decorator: supabase_auth_required applied to %s", view_func.__name__)

    def wrapper(request, *args, **kwargs):
        logger.info("Middleware: Processing request to %s", request.path)
        logger.info("Request headers: %s", {k: v for k, v in request.headers.items()})

        auth_header = request.headers.get("Authorization", "")
        logger.info(
            "Auth header: %s", auth_header[:10] + "..." if auth_header else "None"
        )

        if not auth_header.startswith("Bearer "):
            logger.error("Missing Bearer token in Authorization header")
            return JsonResponse({"error": "Missing Bearer token"}, status=401)

        access_token = auth_header.split(" ")[1]
        logger.info("Access token extracted (first 10 chars): %s...", access_token[:10])

        # Verify token with Supabase
        logger.info("Verifying token with Supabase...")
        try:
            resp = requests.get(
                "https://ehizajslccmzzusduasj.supabase.co/auth/v1/user",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "apikey": f"{os.getenv('SUPABASE_ANON_KEY')}",
                },
            )
            logger.info("Supabase response status: %s", resp.status_code)

            if resp.status_code != 200:
                logger.error("Supabase authentication failed: %s", resp.text)
                return JsonResponse({"error": "Unauthorized"}, status=401)

            user_data = resp.json()
            logger.info(
                "Authentication successful for user: %s",
                user_data.get("email", "unknown"),
            )
            request.user_data = user_data  # user info from Supabase

            # Call the original view function
            logger.info("Calling view function: %s", view_func.__name__)
            return view_func(request, *args, **kwargs)
        except Exception as e:
            logger.exception("Exception during authentication: %s", str(e))
            return JsonResponse({"error": "Authentication error"}, status=500)

    return wrapper
