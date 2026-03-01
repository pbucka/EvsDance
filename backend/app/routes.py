"""API route handlers."""

from fastapi import APIRouter, HTTPException

from app import claude_service
from app.schemas import ClaudeCompleteRequest, ClaudeCompleteResponse

router = APIRouter(prefix="/api", tags=["api"])


@router.post("/claude/complete", response_model=ClaudeCompleteResponse)
async def claude_complete(body: ClaudeCompleteRequest) -> ClaudeCompleteResponse:
    """Send a prompt to Claude with the selected model. Responses may be cached in Redis."""
    try:
        model_id = claude_service.get_model_id(body.model)
        text = await claude_service.complete(
            prompt=body.prompt,
            model_choice=body.model,
            system_prompt=body.system_prompt,
            use_cache=body.use_cache,
            max_tokens=body.max_tokens,
        )
        return ClaudeCompleteResponse(text=text, model_used=model_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
