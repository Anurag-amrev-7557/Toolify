### Multi-stage Dockerfile
# Builder installs system and Python build deps and installs Python packages into /install
FROM python:3.12-slim AS builder
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       build-essential \
       gcc \
       ca-certificates \
       libjpeg-dev \
       zlib1g-dev \
       libfreetype6-dev \
       libpng-dev \
       pkg-config \
       libxml2-dev \
       libxslt1-dev \
       libcairo2-dev \
       libpango1.0-dev \
       libgdk-pixbuf2.0-dev \
       poppler-utils \
       tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements for better layer caching
COPY backend/requirements.txt ./requirements.txt

RUN python -m pip install --upgrade pip setuptools wheel \
    && python -m pip install --prefix=/install --no-cache-dir -r requirements.txt

# Final runtime image: smaller, only runtime system deps
FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app

# Install runtime system libraries needed by some packages (cairo/pango, poppler, tesseract, libjpeg)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       ca-certificates \
       libjpeg62-turbo \
       zlib1g \
       libfreetype6 \
       libpng16-16 \
       libcairo2 \
       libpango1.0-0 \
       libgdk-pixbuf2.0-0 \
       poppler-utils \
       tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

# Copy installed Python packages from builder
# /install contains lib/pythonX.Y/site-packages and bin
COPY --from=builder /install /usr/local

# Copy application source
COPY backend/ /app

EXPOSE 5001
CMD ["python", "app.py"]
