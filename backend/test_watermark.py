from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import io

try:
    packet = io.BytesIO()
    can = canvas.Canvas(packet, pagesize=letter)
    can.setFillAlpha(0.3)
    can.setFillColorRGB(0.5, 0.5, 0.5)
    can.setFont('Helvetica', 50)
    can.rotate(45)
    can.drawString(200, 0, "TEST")
    can.save()
    print("Success!")
except Exception as e:
    print(f"Error: {e}")
