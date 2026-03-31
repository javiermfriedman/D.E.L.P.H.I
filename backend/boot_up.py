"""
This is a script that an be called from my bash shell to boot up the application.
with an alias and play music in the background.
"""
import os
import subprocess
import sys
import time
TRACK_URI = "spotify:track:62BAGsMUAZeBGAlkoUuSAh"
_REPO_ROOT = os.path.dirname(os.path.abspath(__file__))

def set_spotify_volume(volume: int):
    """Set Spotify's volume via AppleScript (macOS only)."""
    subprocess.run([
        "osascript", "-e",
        f'tell application "Spotify" to set sound volume to {volume}'
    ])

def open_spotify():
    if sys.platform == "darwin":  # macOS
        # Open Spotify with the track URI
        subprocess.Popen(["open", TRACK_URI])
        set_spotify_volume(90)

    print("Opening Spotify and playing")


def start_dev_server():
    print("Starting D.E.L.P.H.I backend server in new terminal...")
    subprocess.Popen([
        "osascript", "-e",
        '''tell app "Terminal"
            activate
            do script "cd /Users/javierfriedman/Code/delphi/backend && /Users/javierfriedman/Code/delphi/backend/.venv/bin/uvicorn app.main:app --reload"
        end tell'''
    ])

    subprocess.Popen([
        "osascript", "-e",
        '''tell app "Terminal"
            activate
            do script "cd /Users/javierfriedman/Code/delphi/frontend && npm run dev"
        end tell'''
    ])

    # Poll until both servers are ready
    import urllib.request, urllib.error
    backend_up = False
    frontend_up = False

    for attempt in range(35):
        time.sleep(1)

        if not backend_up:
            try:
                urllib.request.urlopen("http://localhost:8000")
                backend_up = True
            except urllib.error.HTTPError:
                # 404 etc. means the server IS responding — it's up
                backend_up = True
            except Exception as e:
                print(f"  ⏳ Waiting for backend... (attempt {attempt+1}, {e.__class__.__name__})")

        if backend_up and not frontend_up:
            try:
                urllib.request.urlopen("http://localhost:5173/")
                frontend_up = True
            except urllib.error.HTTPError:
                frontend_up = True
            except Exception as e:
                print(f"  ⏳ Waiting for frontend on :5741... (attempt {attempt+1}, {e.__class__.__name__})")

        if backend_up:
            print("✅ Backend ready!")
        if frontend_up:
            print("✅ Frontend ready!")

        if backend_up and frontend_up:
            browser = "Arc"
            subprocess.Popen(["open", "-a", browser, "http://localhost:5173/"])
            break
    else:
        print("❌ Servers never became ready — check the Terminal windows for errors.")
    
if __name__ == "__main__":
    
    open_spotify()
    start_dev_server()  
