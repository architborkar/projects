from PyQt5 import QtWidgets, QtGui, QtCore
import sys
import ctypes

class TransparentWindow(QtWidgets.QWidget):
    def __init__(self):
        super().__init__()

        self.setWindowFlags(
            QtCore.Qt.FramelessWindowHint |
            QtCore.Qt.WindowStaysOnTopHint |
            QtCore.Qt.Tool
        )
        self.setAttribute(QtCore.Qt.WA_TranslucentBackground)

        self.setGeometry(100, 100, 400, 300)

        QtCore.QTimer.singleShot(0, self.set_x11_input_transparent)

    def set_x11_input_transparent(self):
        # Use X11 shape extension to make window input transparent
        from ctypes.util import find_library
        xlib = ctypes.cdll.LoadLibrary(find_library('X11'))
        xshapelib = ctypes.cdll.LoadLibrary(find_library('Xext'))

        dpy = xlib.XOpenDisplay(None)
        win_id = self.winId().__int__()

        xshapelib.XShapeCombineRectangles(
            dpy,         # Display
            win_id,      # Window
            2,           # ShapeInput
            0, 0,        # x, y
            None,        # rectangles
            0,           # n_rects
            0,           # operation = ShapeSet
            0            # ordering = Unsorted
        )

        xlib.XFlush(dpy)

    def paintEvent(self, event):
        qp = QtGui.QPainter(self)
        qp.setRenderHint(QtGui.QPainter.Antialiasing)
        qp.setBrush(QtCore.Qt.transparent)
        pen = QtGui.QPen(QtCore.Qt.black, 4)
        qp.setPen(pen)
        qp.drawRect(self.rect().adjusted(2, 2, -2, -2))

app = QtWidgets.QApplication(sys.argv)
window = TransparentWindow()
window.show()
sys.exit(app.exec_())

