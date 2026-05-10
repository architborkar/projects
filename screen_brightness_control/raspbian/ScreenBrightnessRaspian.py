import sys
import ctypes
from ctypes.util import find_library
from PyQt5.QtWidgets import QApplication, QWidget, QSlider, QDesktopWidget
from PyQt5.QtGui import QPainter, QColor
from PyQt5.QtCore import Qt, QTimer


class TransparentOverlay(QWidget):
    def __init__(self):
        super().__init__()

        self.opacity_level = 128

        # Set fullscreen excluding the taskbar
        screen = QDesktopWidget().availableGeometry()
        self.setGeometry(screen)

        # Frameless, always on top, splash screen (hides from taskbar)
        self.setWindowFlags(Qt.FramelessWindowHint | Qt.WindowStaysOnTopHint | Qt.SplashScreen)
        self.setAttribute(Qt.WA_TranslucentBackground)

        QTimer.singleShot(0, self.set_click_through)

    def paintEvent(self, event):
        painter = QPainter(self)
        color = QColor(0, 0, 0, self.opacity_level)
        painter.fillRect(self.rect(), color)

    def change_opacity(self, value):
        self.opacity_level = value
        self.update()

    def set_click_through(self):
        xlib = ctypes.cdll.LoadLibrary(find_library('X11'))
        xshapelib = ctypes.cdll.LoadLibrary(find_library('Xext'))

        display = xlib.XOpenDisplay(None)
        if not display:
            print("Failed to open X display")
            return

        window = int(self.winId())
        ShapeInput = 2
        ShapeSet = 0
        Unsorted = 0

        xshapelib.XShapeCombineRectangles.argtypes = [
            ctypes.c_void_p, ctypes.c_ulong, ctypes.c_int,
            ctypes.c_int, ctypes.c_int, ctypes.c_void_p,
            ctypes.c_int, ctypes.c_int, ctypes.c_int
        ]

        xshapelib.XShapeCombineRectangles(
            display,
            window,
            ShapeInput,
            0, 0,
            None,
            0,
            ShapeSet,
            Unsorted
        )

        xlib.XFlush(display)


class BrightnessControl(QWidget):
    def __init__(self):
        super().__init__()

        self.setGeometry(150, 400, 250, 80)
        self.setWindowTitle("Brightness Control")

        # Show overlay (not in taskbar)
        self.overlay = TransparentOverlay()
        self.overlay.show()

        self.slider = QSlider(Qt.Horizontal, self)
        self.slider.setMinimum(10)
        self.slider.setMaximum(255)
        self.slider.setValue(128)
        self.slider.setGeometry(25, 30, 200, 30)
        self.slider.valueChanged.connect(self.overlay.change_opacity)

    def closeEvent(self, event):
        QApplication.quit()


if __name__ == "__main__":
    app = QApplication(sys.argv)

    window = BrightnessControl()
    window.show()

    sys.exit(app.exec_())
