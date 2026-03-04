import requests
from execution.logger import logger


def trigger_n8n_webhook(url: str, payload: dict) -> dict:
    """Send a POST to n8n webhook URL with payload, return response JSON.

    Args:
        url: webhook URL
        payload: dictionary to send
    Returns:
        Parsed JSON response or empty dict on failure
    """
    try:
        logger.info(f"Triggering n8n webhook: {url}")
        resp = requests.post(url, json=payload, timeout=10)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        logger.error(f"n8n trigger failed: {e}")
        return {}


if __name__ == "__main__":
    import sys, json
    # simple CLI invocation: python n8n_connector.py <url> '<json payload>'
    if len(sys.argv) < 3:
        print("Usage: python n8n_connector.py <url> '<json payload>'")
        sys.exit(1)
    url = sys.argv[1]
    payload = json.loads(sys.argv[2])
    result = trigger_n8n_webhook(url, payload)
    print(json.dumps(result))
