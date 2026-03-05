import sys
import json
import argparse
import time

def parse_args():
    parser = argparse.ArgumentParser(description="Video Generation Simulation")
    parser.add_argument("--prompt", type=str, required=True, help="Prompt for video generation")
    parser.add_argument("--image_url", type=str, help="Optional starting image URL")
    parser.add_argument("--test", action="store_true", help="Run in test mode")
    return parser.parse_args()

def main():
    args = parse_args()
    
    if not args.prompt:
        print(json.dumps({"status": "error", "message": "Prompt is required"}))
        sys.exit(1)

    # Simulating deterministic longer execution latency for video
    time.sleep(3)
    
    # Simulating standard video IDs based on prompt
    video_hash = abs(hash(args.prompt)) % 100000
    
    response = {
        "status": "success",
        "video_url": f"https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4?hash={video_hash}",
        "cost": 5.0,
        "metadata": {
            "prompt": args.prompt,
            "has_base_image": bool(args.image_url)
        }
    }
    
    print(json.dumps(response))

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))
        sys.exit(1)
