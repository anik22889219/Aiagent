import sys
import json
import argparse
import time
import uuid

def parse_args():
    parser = argparse.ArgumentParser(description="Credit Recharge Simulation")
    parser.add_argument("--amount", type=float, required=True, help="Amount to recharge")
    parser.add_argument("--payment_method", type=str, required=True, help="Payment method ID or type")
    parser.add_argument("--test", action="store_true", help="Run in test mode")
    return parser.parse_args()

def main():
    args = parse_args()
    
    if int(args.amount) <= 0:
        print(json.dumps({"status": "error", "message": "Amount must be greater than 0"}))
        sys.exit(1)

    if not args.payment_method:
        print(json.dumps({"status": "error", "message": "Payment method is required"}))
        sys.exit(1)

    # Simulating payment gateway confirmation delay
    time.sleep(1)
    
    response = {
        "status": "success",
        "transaction_id": f"txn_{str(uuid.uuid4().hex)[:12]}",
        "recharge_amount": args.amount,
        "bonus_credits": args.amount * 0.1 if args.amount >= 100 else 0, # 10% bonus for >100
        "message": "Payment verified and credits added successfully."
    }
    
    print(json.dumps(response))

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))
        sys.exit(1)
