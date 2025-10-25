import asyncio
from .scheduler import loop_forever
from .logging import setup_logging

if __name__ == "__main__":
    setup_logging()
    asyncio.run(loop_forever())
