import random
from dotenv import load_dotenv
import os


load_dotenv()
PROXY_LIST = os.getenv("PROXY_LIST", "").split(",")


class ProxyManager:
    def __init__(self):
        self.proxy_list = [
            "http://103.180.198.164:3128",
            "http://80.48.119.28:8080",
            "http://190.104.1.19:3128",
            "http://89.208.20.34:8080",
            "http://103.105.212.106:53281",
            "http://186.121.235.66:8080",
            "http://103.216.82.18:6667",
            "http://200.25.254.193:54240",
            "http://177.93.51.153:8080",
            "http://159.192.227.75:8080",
        ]
        self.banned = set()

    def get_proxy(self):
        available = [p for p in self.proxy_list if p not in self.banned]
        if not available:
            self.banned.clear()
            available = self.proxy_list
        return random.choice(available)

    def ban_proxy(self, proxy):
        self.banned.add(proxy)
