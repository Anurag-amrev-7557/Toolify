FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
	PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies required by heavy Python packages used by the
# backend (weasyprint, PyMuPDF, poppler, tesseract, pillow extras, etc.).
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
	   build-essential \
	   gcc \
	   libffi-dev \
	   libssl-dev \
	   pkg-config \
	   ca-certificates \
	   poppler-utils \
	   libpoppler-cpp-dev \
	   libjpeg-dev \
	   zlib1g-dev \
	   libfreetype6-dev \
	   libpng-dev \
	   libcairo2 \
	   libpango-1.0-0 \
	libpangocairo-1.0-0 \
	libgdk-pixbuf-xlib-2.0-0 \
	   tesseract-ocr \
	   fonts-dejavu-core \
	&& rm -rf /var/lib/apt/lists/*

# Copy only requirements first to leverage Docker layer caching
COPY requirements.txt ./requirements.txt

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip setuptools wheel \
	&& pip install --no-cache-dir -r requirements.txt \
	&& pip install --no-cache-dir gunicorn

# Copy application source
COPY . /app

ENV PORT=5001

# Use a shell form so PORT env var substitution works at runtime
CMD ["sh", "-c", "gunicorn app:app --bind 0.0.0.0:${PORT:-5001} --workers 4 --threads 4"]

