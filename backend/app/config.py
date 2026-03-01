"""Application configuration loaded from environment variables."""

from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Ev's Dance API"
    debug: bool = False

    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_user: str = "evsdance"
    postgres_password: str = ""
    postgres_db: str = "evsdance"

    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_db: int = 0
    redis_password: str | None = None

    anthropic_api_key: str = ""

    @property
    def database_url(self) -> str:
        return (
            f"postgresql://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    @property
    def redis_url(self) -> str:
        auth = f":{self.redis_password}@" if self.redis_password else ""
        return f"redis://{auth}{self.redis_host}:{self.redis_port}/{self.redis_db}"

    class Config:
        env_file = ".env"
        env_prefix = "EVS_"


@lru_cache
def get_settings() -> Settings:
    return Settings()
