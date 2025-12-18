from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

_analyzer = SentimentIntensityAnalyzer()


def analyze_sentiment(text: str) -> str:
    if not text or not text.strip():
        return "neutral"
    scores = _analyzer.polarity_scores(text)
    compound = scores.get('compound', 0.0)
    if compound >= 0.2:
        return "positive"
    elif compound <= -0.2:
        return "negative"
    return "neutral"
