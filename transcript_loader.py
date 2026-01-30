import os
from youtube_transcript_api import YouTubeTranscriptApi

def extract_videoid(url):
    """
    Extract the video ID from a YouTube URL.
    """
    if "v=" in url:
        return url.split("v=")[1].split("&")[0]
    elif "youtu.be/" in url:
        return url.split("youtu.be/")[1].split("?")[0]
    else:
        raise ValueError("Invalid YouTube URL")


def transcript_loader(url):
    video_id = extract_videoid(url)
    s=""
    try:
        with open(f"transcripts/{video_id}.txt", "r") as file:
            s=file.read()
    except FileNotFoundError:
        print("Fetching transcript from YouTube...")
        ytt_api = YouTubeTranscriptApi()
        fetched_transcript = ytt_api.fetch(video_id, languages=["en", "hi"])
        # we have to create a text file to store the transcript
        for snippet in fetched_transcript:
            s += snippet.text.strip() + " "
    if not os.path.exists("transcripts"):
        os.makedirs("transcripts")
   
    if not os.path.exists(f"transcripts/{video_id}.txt"):
        with open(f"transcripts/{video_id}.txt", "w", encoding="utf-8") as f:
            f.write(s)
    return s
