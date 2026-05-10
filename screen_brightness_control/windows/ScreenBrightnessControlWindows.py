import tkinter as tk
import ctypes
from ctypes import windll

def close_program():
    root.destroy()
    control_window.destroy()

def update_opacity(value):
    """ Adjusts the black transparency based on slider value. """
    min_opacity = int(255 * 0.9)  # 90% opacity at lowest brightness
    max_opacity = int(255 * 0.0)  # 0% opacity at highest brightness

    brightness = int(value)
    if brightness <= 10:
        opacity = min_opacity  # Keep it at 90% opacity
    else:
        # Scale opacity between 90% (dark) and 0% (fully transparent)
        opacity = int(min_opacity - ((brightness - 10) / 90) * (min_opacity - max_opacity))

    windll.user32.SetLayeredWindowAttributes(hwnd, 0, opacity, 2)

# Create main dimmer window (click-through black overlay)
root = tk.Tk()
root.title("Click-Through Window")  # Important for FindWindowW

# Make window full screen
root.attributes("-fullscreen", True)
root.attributes("-topmost", True)  # Always on top
root.configure(bg="black")  # Set background to black

root.update_idletasks()  # Ensure window is fully created

# Get window handle **correctly**
hwnd = windll.user32.FindWindowW(None, "Click-Through Window")

# Enable full click-through effect
GWL_EXSTYLE = -20
WS_EX_LAYERED = 0x00080000
WS_EX_TRANSPARENT = 0x00000020

style = windll.user32.GetWindowLongW(hwnd, GWL_EXSTYLE)
windll.user32.SetWindowLongW(hwnd, GWL_EXSTYLE, style | WS_EX_LAYERED | WS_EX_TRANSPARENT)
windll.user32.SetLayeredWindowAttributes(hwnd, 0, int(255 * 0.5), 2)  # Default: 50% opacity

# Create control window
control_window = tk.Tk()
control_window.title("Brightness Control")
control_window.geometry("250x100")  # Small control panel size

slider = tk.Scale(control_window, from_=0, to=100, orient="horizontal", label="Brightness", command=update_opacity)
slider.pack(pady=10)
slider.set(50)  # Default to 50% transparency

close_button = tk.Button(control_window, text="Close", command=close_program)
close_button.pack()

# Run both windows
root.bind("<Escape>", lambda event: close_program())
control_window.mainloop()
