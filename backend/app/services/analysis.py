import re
import json
import os
import requests
from app.config import SENTIMENT_MODEL, HF_API_TOKEN_ENV

try:
    from transformers import pipeline
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False

try:
    import torch  # noqa: F401
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False

sentiment_pipeline = None


def get_remote_inference_token() -> str:
    token = os.environ.get(HF_API_TOKEN_ENV, "")
    if not token:
        raise RuntimeError(
            "Hugging Face API token missing. Set the HUGGING_FACE_API_TOKEN environment variable to enable remote inference."
        )
    return token


def init_pipelines():
    global sentiment_pipeline
    if sentiment_pipeline is None:
        if not TRANSFORMERS_AVAILABLE or not TORCH_AVAILABLE:
            raise RuntimeError("Local sentiment pipeline unavailable because transformers or torch is not installed.")
        sentiment_pipeline = pipeline("sentiment-analysis", model=SENTIMENT_MODEL)
    return sentiment_pipeline


def analyze_sentiment(transcript: str) -> dict:
    if not transcript.strip():
        return {"sentiment": "Neutral", "confidence": 0.0}

    label = "NEUTRAL"
    score = 0.0

    if TRANSFORMERS_AVAILABLE and TORCH_AVAILABLE:
        try:
            pipeline_instance = init_pipelines()
            result = pipeline_instance(transcript[:1200])[0]
            label = result.get("label", "NEUTRAL")
            score = float(result.get("score", 0.0))
        except Exception:
            label = "NEUTRAL"
            score = 0.0
    else:
        try:
            token = get_remote_inference_token()
            url = f"https://api-inference.huggingface.co/models/{SENTIMENT_MODEL}"
            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
            payload = {"inputs": transcript[:1200]}
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            response.raise_for_status()
            data = response.json()
            if isinstance(data, list) and data:
                label = data[0].get("label", "NEUTRAL")
                score = float(data[0].get("score", 0.0))
            elif isinstance(data, dict) and data.get("error"):
                label = "NEUTRAL"
                score = 0.0
            else:
                label = "NEUTRAL"
                score = 0.0
        except Exception:
            label = "NEUTRAL"
            score = 0.0

    if score < 0.65:
        sentiment = "Neutral"
    else:
        sentiment = "Positive" if label.upper() == "POSITIVE" else "Negative"

    return {"sentiment": sentiment, "confidence": round(score, 3)}


def tag_speakers(transcript: str) -> dict:
    lines = [line.strip() for line in re.split(r"[\n\.\?]+", transcript) if line.strip()]
    customer_lines = []
    staff_lines = []

    for index, line in enumerate(lines):
        lower_line = line.lower()
        if any(keyword in lower_line for keyword in ["customer", "client", "buyer", "guest"]):
            customer_lines.append(line)
        elif any(keyword in lower_line for keyword in ["staff", "assistant", "cashier", "associate", "agent"]):
            staff_lines.append(line)
        else:
            if index % 2 == 0:
                customer_lines.append(line)
            else:
                staff_lines.append(line)

    return {
        "customer": " ".join(customer_lines) or transcript,
        "staff": " ".join(staff_lines) or "No staff-specific transcript detected.",
    }


def extract_issues(transcript: str) -> list:
    rules = {
        "Product unavailable": ["unavailable", "can't find", "can't get", "don't have", "out of stock"],
        "Out of stock": ["out of stock", "no stock", "sold out", "stock is gone"],
        "High pricing complaints": ["too expensive", "price is high", "costly", "pricey", "overpriced"],
        "Long waiting time": ["wait", "waiting", "long time", "delay", "slow service"],
        "Staff behavior issues": ["rude", "unhelpful", "bad service", "not friendly", "ignored", "not helpful"],
        "Billing/payment issues": ["bill", "charge", "payment", "checkout", "refund", "invoice"],
        "Delivery issues": ["delivery", "ship", "shipping", "arrive late", "not delivered"],
    }
    found = set()
    text = transcript.lower()

    for issue, patterns in rules.items():
        if any(pattern in text for pattern in patterns):
            found.add(issue)

    if not found:
        if "thank" in text or "good" in text:
            found.add("General customer feedback")
        else:
            found.add("Review conversation for additional issues")

    return sorted(found)


def generate_recommendations(issues: list, sentiment: str) -> list:
    recommendations = []
    mapping = {
        "Product unavailable": "Review inventory levels and restock popular items more frequently.",
        "Out of stock": "Implement automated out-of-stock alerts and improve inventory forecasting.",
        "High pricing complaints": "Evaluate pricing strategy and consider promotional bundles for price-sensitive customers.",
        "Long waiting time": "Increase staffing during peak windows and streamline the checkout process.",
        "Staff behavior issues": "Provide customer service coaching and reinforce service expectations.",
        "Billing/payment issues": "Audit POS and billing workflows to reduce payment friction.",
        "Delivery issues": "Improve delivery tracking and communicate timing clearly to customers.",
        "General customer feedback": "Use feedback to optimize store experience and celebrate strong service moments.",
        "Review conversation for additional issues": "Review transcript detail and escalate persistent service gaps.",
    }

    for issue in issues:
        if issue in mapping:
            recommendations.append(mapping[issue])

    if sentiment == "Negative" and "Improve customer communication" not in recommendations:
        recommendations.append("Improve customer communication and follow up on negative experiences.")
    elif sentiment == "Positive" and "Celebrate strong service" not in recommendations:
        recommendations.append("Capture positive interactions to reinforce strong service habits.")

    if len(recommendations) < 3:
        recommendations.extend([
            "Review inventory management and make adjustments based on customer demand.",
            "Monitor peak traffic periods and schedule staff accordingly.",
        ])

    return recommendations[:5]


def serialize_breakdown(breakdown: dict) -> str:
    return json.dumps(breakdown)


def deserialize_breakdown(value: str) -> dict:
    try:
        return json.loads(value)
    except Exception:
        return {"customer": value, "staff": ""}
