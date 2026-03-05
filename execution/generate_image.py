import sys
import json
import argparse
import time
import random

def parse_args():
    parser = argparse.ArgumentParser(description="Image Generation Simulation")
    parser.add_argument("--prompt", type=str, required=True, help="Prompt for image generation")
    parser.add_argument("--aspect_ratio", type=str, default="1:1", help="Aspect ratio, e.g., 16:9")
    parser.add_argument("--test", action="store_true", help="Run in test mode")
    return parser.parse_args()

def main():
    args = parse_args()
    
    if not args.prompt:
        print(json.dumps({"status": "error", "message": "Prompt is required"}))
        sys.exit(1)

    # Simulating deterministic execution latency
    time.sleep(2)
    
    # Simulating standard image IDs based on prompt hash for testing
    image_hash = abs(hash(args.prompt)) % 10000
    
    response = {
        "status": "success",
        "image_url": f"https://picsum.photos/seed/{image_hash}/800/800",
        "cost": 1.5,
        "metadata": {
            "prompt": args.prompt,
            "aspect_ratio": args.aspect_ratio
        }
    }
    
    print(json.dumps(response))

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))
        sys.exit(1)
