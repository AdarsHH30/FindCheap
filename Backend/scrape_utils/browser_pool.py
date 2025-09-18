import asyncio
import random
import tempfile
import os
import time
from pathlib import Path
from typing import Optional, Set
from contextlib import asynccontextmanager
from crawl4ai import AsyncWebCrawler, BrowserConfig
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.CRITICAL)


class BrowserContextManager:
    """Context manager for safe browser checkout/return"""

    def __init__(self, pool, browser):
        self.pool = pool
        self.browser = browser
        self.checked_out_at = time.time()

    async def __aenter__(self):
        return self.browser

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.pool._return_browser(self.browser, exc_type is not None)


class BrowserPool:
    """Async browser pool for high-performance web scraping"""

    def __init__(self, pool_size: int = 4, max_uses_per_browser: int = 50):
        self.pool_size = pool_size
        self.max_uses_per_browser = max_uses_per_browser

        self.available_browsers = asyncio.Queue()
        self.in_use_browsers: Set = set()
        self.browser_stats = {}

        self.is_initialized = False
        self.is_shutting_down = False

        self.base_session_dir = Path(tempfile.gettempdir()) / "browser_pool_sessions"
        self.base_session_dir.mkdir(exist_ok=True)

    def _get_random_user_agent(self):
        """Get a random user agent"""
        user_agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0",
        ]
        return random.choice(user_agents)

    def _create_browser_session_dir(self) -> str:
        """Create unique session directory for each browser"""
        session_id = f"browser_{random.randint(10000, 99999)}_{int(time.time())}"
        session_dir = self.base_session_dir / session_id
        session_dir.mkdir(exist_ok=True)
        return str(session_dir)

    def _create_browser_config(self) -> BrowserConfig:
        """Create optimized browser configuration"""
        session_dir = self._create_browser_session_dir()

        return BrowserConfig(
            browser_type="chromium",
            headless=True,
            user_data_dir=session_dir,
            extra_args=[
                "--disable-blink-features=AutomationControlled",
                "--disable-popups",
                "--disable-infobars",
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--disable-setuid-sandbox",
                "--disable-web-security",
                "--allow-running-insecure-content",
                "--ignore-certificate-errors",
                "--disable-extensions",
                "--disable-popup-blocking",
                "--disable-background-networking",
                "--disable-sync",
                "--disable-translate",
                f"--user-agent={self._get_random_user_agent()}",
                "--disable-features=VizDisplayCompositor",
                "--disable-ipc-flooding-protection",
                "--window-size=1920,1080",
                "--disable-logging",
                "--disable-dev-tools",
                "--no-first-run",
                "--disable-default-apps",
                "--disable-background-timer-throttling",
                "--disable-renderer-backgrounding",
                "--disable-backgrounding-occluded-windows",
                "--disable-field-trial-config",
            ],
        )

    async def _create_browser(self) -> AsyncWebCrawler:
        """Create and warm up a new browser instance"""
        try:
            config = self._create_browser_config()
            browser = AsyncWebCrawler(config=config)

            # Initialize the browser (this starts the actual browser process)
            await browser.__aenter__()

            # Warm up browser with a simple page
            try:
                await browser.arun(url="https://httpbin.org/get")
                logger.info("Browser warmed up successfully")
            except Exception as e:
                logger.warning(f"Browser warmup failed, but continuing: {e}")

            # Track browser stats
            browser_id = id(browser)
            self.browser_stats[browser_id] = {
                "uses": 0,
                "created_at": time.time(),
                "session_dir": config.user_data_dir,
            }

            return browser

        except Exception as e:
            logger.error(f"Failed to create browser: {e}")
            raise

    async def _is_browser_healthy(self, browser: AsyncWebCrawler) -> bool:
        """Check if browser is still functional"""
        try:
            result = await asyncio.wait_for(
                browser.arun(
                    url="https://httpbin.org/get",
                    config=None,
                ),
                timeout=10.0,
            )
            return result.success
        except (Exception, asyncio.TimeoutError) as e:
            logger.warning(f"Browser health check failed: {e}")
            return False

    async def _cleanup_browser(self, browser: AsyncWebCrawler):
        """Safely cleanup a browser instance"""
        try:
            browser_id = id(browser)

            # Clean up session directory
            if browser_id in self.browser_stats:
                session_dir = self.browser_stats[browser_id]["session_dir"]
                try:
                    import shutil

                    if os.path.exists(session_dir):
                        shutil.rmtree(session_dir)
                except Exception as e:
                    logger.warning(f"Failed to cleanup session dir: {e}")

                # Remove from stats
                del self.browser_stats[browser_id]

            # Close browser
            await browser.__aexit__(None, None, None)
            logger.debug("Browser cleaned up successfully")

        except Exception as e:
            logger.error(f"Error cleaning up browser: {e}")

    async def _force_reinitialize(self):
        """Force reinitialize the browser pool when it's stuck"""
        logger.warning("Force reinitializing browser pool...")

        while not self.available_browsers.empty():
            try:
                browser = self.available_browsers.get_nowait()
                await self._cleanup_browser(browser)
            except asyncio.QueueEmpty:
                break
            except Exception as e:
                logger.error(f"Error cleaning up browser during reinit: {e}")

        # Clear in-use browsers (they're likely stuck)
        for browser in list(self.in_use_browsers):
            try:
                await self._cleanup_browser(browser)
            except Exception as e:
                logger.error(f"Error cleaning up in-use browser: {e}")

        self.in_use_browsers.clear()
        self.browser_stats.clear()

        # Recreate browsers
        for i in range(self.pool_size):
            try:
                browser = await self._create_browser()
                await self.available_browsers.put(browser)
                logger.info(f"Recreated browser {i+1}/{self.pool_size}")
            except Exception as e:
                logger.error(f"Failed to recreate browser {i+1}: {e}")

        logger.info("Browser pool force reinitialization complete")

    async def initialize(self):
        """Initialize the browser pool"""
        if self.is_initialized:
            return

        logger.info(f"Initializing browser pool with {self.pool_size} browsers...")

        # Create initial pool of browsers
        for i in range(self.pool_size):
            try:
                browser = await self._create_browser()
                await self.available_browsers.put(browser)
                logger.info(f"Created browser {i+1}/{self.pool_size}")
            except Exception as e:
                logger.error(f"Failed to create browser {i+1}: {e}")
                # Continue with fewer browsers rather than failing completely

        self.is_initialized = True
        current_size = self.available_browsers.qsize()
        logger.info(f"Browser pool initialized with {current_size} browsers")

    @asynccontextmanager
    async def get_browser(self):
        """Get a browser from the pool (context manager interface)"""
        if not self.is_initialized:
            await self.initialize()

        if self.is_shutting_down:
            raise RuntimeError("Browser pool is shutting down")

        browser = None
        max_retries = 3

        for attempt in range(max_retries):
            try:
                # Get browser from pool with timeout
                browser = await asyncio.wait_for(
                    self.available_browsers.get(), timeout=30.0
                )

                # Quick health check before use
                if not await self._is_browser_healthy(browser):
                    logger.warning(
                        f"Got unhealthy browser, replacing... (attempt {attempt + 1})"
                    )
                    await self._cleanup_browser(browser)

                    try:
                        browser = await self._create_browser()
                        break
                    except Exception as e:
                        logger.error(f"Failed to create replacement browser: {e}")
                        if attempt == max_retries - 1:
                            raise
                        continue
                else:
                    break

            except asyncio.TimeoutError:
                logger.error(f"Timeout waiting for browser (attempt {attempt + 1})")
                if attempt == max_retries - 1:
                    # Force reinitialize the pool
                    logger.warning("Force reinitializing browser pool due to timeout")
                    await self._force_reinitialize()
                    browser = await asyncio.wait_for(
                        self.available_browsers.get(), timeout=10.0
                    )
                    break
                continue
            except Exception as e:
                logger.error(f"Error getting browser (attempt {attempt + 1}): {e}")
                if attempt == max_retries - 1:
                    raise
                continue

        if browser is None:
            raise RuntimeError(
                "Failed to get a healthy browser after multiple attempts"
            )

        self.in_use_browsers.add(browser)
        browser_id = id(browser)
        self.browser_stats[browser_id]["uses"] += 1

        logger.debug(
            f"Checked out browser (uses: {self.browser_stats[browser_id]['uses']})"
        )

        try:
            yield browser
        finally:
            # Always return browser to pool
            await self._return_browser(browser, had_error=False)

    async def _return_browser(self, browser: AsyncWebCrawler, had_error: bool = False):
        """Return browser to pool or replace if needed"""
        self.in_use_browsers.discard(browser)
        browser_id = id(browser)

        try:
            # Check if browser should be retired
            should_retire = (
                had_error
                or self.browser_stats.get(browser_id, {}).get("uses", 0)
                >= self.max_uses_per_browser
                or not await self._is_browser_healthy(browser)
            )

            if should_retire:
                logger.info(
                    f"Retiring browser (uses: {self.browser_stats.get(browser_id, {}).get('uses', 0)})"
                )
                await self._cleanup_browser(browser)

                # Create replacement browser
                try:
                    new_browser = await self._create_browser()
                    await self.available_browsers.put(new_browser)
                    logger.info("Created replacement browser")
                except Exception as e:
                    logger.error(f"Failed to create replacement browser: {e}")
            else:
                # Return healthy browser to pool
                await self.available_browsers.put(browser)
                logger.debug("Returned browser to pool")

        except Exception as e:
            logger.error(f"Error returning browser to pool: {e}")
            # If return fails, try to cleanup the browser
            await self._cleanup_browser(browser)

    async def get_pool_stats(self) -> dict:
        """Get current pool statistics"""
        return {
            "pool_size": self.pool_size,
            "available": self.available_browsers.qsize(),
            "in_use": len(self.in_use_browsers),
            "total_browsers": len(self.browser_stats),
            "browser_stats": {
                bid: {
                    "uses": stats["uses"],
                    "age_seconds": time.time() - stats["created_at"],
                }
                for bid, stats in self.browser_stats.items()
            },
        }

    async def shutdown(self):
        """Shutdown the browser pool and cleanup all resources"""
        logger.info("Shutting down browser pool...")
        self.is_shutting_down = True

        # Wait for in-use browsers to be returned
        max_wait = 30  # seconds
        wait_start = time.time()

        while self.in_use_browsers and (time.time() - wait_start) < max_wait:
            logger.info(
                f"Waiting for {len(self.in_use_browsers)} browsers to be returned..."
            )
            await asyncio.sleep(1)

        # Force cleanup remaining browsers
        all_browsers = []

        # Get all available browsers
        while not self.available_browsers.empty():
            try:
                browser = await asyncio.wait_for(
                    self.available_browsers.get(), timeout=1.0
                )
                all_browsers.append(browser)
            except asyncio.TimeoutError:
                break

        # Add any still in-use browsers
        all_browsers.extend(list(self.in_use_browsers))

        # Cleanup all browsers
        cleanup_tasks = [self._cleanup_browser(browser) for browser in all_browsers]
        if cleanup_tasks:
            await asyncio.gather(*cleanup_tasks, return_exceptions=True)

        # Clean up base session directory
        try:
            import shutil

            if self.base_session_dir.exists():
                shutil.rmtree(self.base_session_dir)
        except Exception as e:
            logger.warning(f"Failed to cleanup base session directory: {e}")

        logger.info("Browser pool shutdown complete")


# Global pool instance
_global_pool: Optional[BrowserPool] = None


async def get_global_browser_pool(pool_size: int = 4) -> BrowserPool:
    """Get or create the global browser pool"""
    global _global_pool

    if _global_pool is None or _global_pool.is_shutting_down:
        logger.info("Creating new global browser pool")
        _global_pool = BrowserPool(pool_size=pool_size)
        await _global_pool.initialize()
    elif not _global_pool.is_initialized:
        logger.info("Reinitializing existing browser pool")
        await _global_pool.initialize()

    return _global_pool


async def reset_global_browser_pool(pool_size: int = 4) -> BrowserPool:
    """Reset the global browser pool (useful for recovery)"""
    global _global_pool

    if _global_pool:
        try:
            await _global_pool.shutdown()
        except Exception as e:
            logger.error(f"Error shutting down old pool: {e}")

    _global_pool = BrowserPool(pool_size=pool_size)
    await _global_pool.initialize()
    logger.info("Global browser pool reset successfully")
    return _global_pool


async def shutdown_global_browser_pool():
    """Shutdown the global browser pool"""
    global _global_pool

    if _global_pool:
        await _global_pool.shutdown()
        _global_pool = None
