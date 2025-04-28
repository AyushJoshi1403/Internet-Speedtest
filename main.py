from tkinter import *
from tkinter import ttk
import speedtest
import threading

def speedcheck():
    try:
        # Update UI to show testing status
        download_label.config(text="Testing...")
        upload_label.config(text="Testing...")

        # Perform speed test
        tester = speedtest.Speedtest()
        tester.get_servers()
        download_speed = str(round(tester.download() / (10**6), 3)) + " Mbps"
        upload_speed = str(round(tester.upload() / (10**6), 3)) + " Mbps"

        # Update UI with results
        download_label.config(text=download_speed)
        upload_label.config(text=upload_speed)
    except Exception as e:
        # Handle errors and update UI
        download_label.config(text="Error")
        upload_label.config(text="Error")
        print("Error during speed test:", e)

def start_speed_test():
    # Run the speed test in a separate thread
    threading.Thread(target=speedcheck).start()

# Initialize the main window
app = Tk()
app.title("Internet Speed Test")
app.geometry("500x650")
app.config(bg="#f0f0f0")

# Title label
title_label = Label(app, text="Internet Speed Test", font=("Helvetica", 24, "bold"), bg="#4CAF50", fg="white")
title_label.pack(pady=20, fill=X)

# Download speed section
download_frame = Frame(app, bg="white", bd=2, relief=SOLID)
download_frame.pack(pady=20, padx=20, fill=X)

download_text_label = Label(download_frame, text="Download Speed", font=("Helvetica", 18, "bold"), bg="white", fg="#333")
download_text_label.pack(pady=10)

download_label = Label(download_frame, text="0 Mbps", font=("Helvetica", 16), bg="white", fg="#4CAF50")
download_label.pack(pady=10)

# Upload speed section
upload_frame = Frame(app, bg="white", bd=2, relief=SOLID)
upload_frame.pack(pady=20, padx=20, fill=X)

upload_text_label = Label(upload_frame, text="Upload Speed", font=("Helvetica", 18, "bold"), bg="white", fg="#333")
upload_text_label.pack(pady=10)

upload_label = Label(upload_frame, text="0 Mbps", font=("Helvetica", 16), bg="white", fg="#4CAF50")
upload_label.pack(pady=10)

# Check speed button
check_button = ttk.Button(app, text="Check Speed", command=start_speed_test)
check_button.pack(pady=30)

# Run the application
app.mainloop()
