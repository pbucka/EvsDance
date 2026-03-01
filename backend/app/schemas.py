"""Pydantic request/response models for the API."""

from pydantic import BaseModel, Field


class ClaudeCompleteRequest(BaseModel):
    prompt: str = Field(..., min_length=1, description="User prompt to send to Claude")
    model: str = Field(
        default="sonnet",
        description="Model choice: 'opus' (most capable), 'sonnet' (balanced), 'haiku' (fast)",
    )
    system_prompt: str | None = Field(default=None, description="Optional system prompt")
    use_cache: bool = Field(default=True, description="Whether to cache the response in Redis")
    max_tokens: int = Field(default=1024, ge=1, le=128_000)


class ClaudeCompleteResponse(BaseModel):
    text: str
    model_used: str
