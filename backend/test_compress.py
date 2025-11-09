#!/usr/bin/env python3
from pypdf import PdfReader, PdfWriter
import os

# Create a simple test PDF
writer = PdfWriter()
reader = PdfReader('/Users/anuragverma/Downloads/utility/backend/test.pdf') if os.path.exists('/Users/anuragverma/Downloads/utility/backend/test.pdf') else None

if reader:
    for page in reader.pages:
        writer.add_page(page)
    
    for page in writer.pages:
        try:
            page.compress_content_streams(level=9)
            print("Compression successful")
        except Exception as e:
            print(f"Compression error: {e}")
            # Try without level parameter
            try:
                page.compress_content_streams()
                print("Compression successful without level")
            except Exception as e2:
                print(f"Compression error without level: {e2}")
    
    with open('compressed_test.pdf', 'wb') as f:
        writer.write(f)
    print("PDF written successfully")
else:
    print("No test PDF found")
