# Creator Studio Operating Directive

## Objective

Provide deterministic execution paths for the Creator Studio features:

1. Automated LinkedIn Posting
2. AI Image Generation
3. AI Video Generation
4. Credit Recharge System

## Inputs & Expected Outputs

### 1. LinkedIn Posting (`/execution/linkedin_post.py`)

- **Inputs**: `content` (string), `media_url` (optional string)
- **Outputs**: JSON containing `status` (success/error) and `post_id`.
- **Logic**: Simulates posting to LinkedIn via API.

### 2. Image Generation (`/execution/generate_image.py`)

- **Inputs**: `prompt` (string)
- **Outputs**: JSON containing `status`, `image_url`, and `cost`.
- **Logic**: Simulates calling a deterministic image generation endpoint.

### 3. Video Generation (`/execution/generate_video.py`)

- **Inputs**: `prompt` (string), `image_url` (optional string)
- **Outputs**: JSON containing `status`, `video_url`, and `cost`.
- **Logic**: Simulates calling a deterministic video generation endpoint.

### 4. Recharge Credits (`/execution/recharge_credits.py`)

- **Inputs**: `amount` (float), `payment_method` (string)
- **Outputs**: JSON containing `status`, `transaction_id`, and `new_balance`.
- **Logic**: Simulates verifying payment and adding credits to the user account.

## Error Handling

All scripts must:

- Validate input types and required fields.
- Return structured JSON with `{"status": "error", "message": "..."}` on failure.
- Ensure deterministic output (no LLM hallucination).

## Rate Limits

Currently mocked. In production, respect specific API rate limits for each service.
