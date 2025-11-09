Backend deployment options
=========================

This repository contains two suggested deployment paths for the backend portion of the app. The full backend requires native libraries and large Python packages which are not suitable for Vercel's Python serverless size limit. Choose one of the options below:

1) Lightweight serverless on Vercel (fast, limited)
-------------------------------------------------

- Use `requirements-light.txt` which contains a minimal set of packages safe for serverless environments.
- This will support basic PDF and image endpoints implemented with `pypdf` and `Pillow`. Heavy features (OCR, WeasyPrint, PyMuPDF-based rendering, pandas workflows, Adobe SDK conversions) will NOT be available in this mode.
- To deploy to Vercel using the light stack, replace `requirements.txt` with `requirements-light.txt` as part of your CI/deploy step, or update the build process to install from `requirements-light.txt`.

2) Full Docker-based backend (recommended for full features)
-----------------------------------------------------------

- Use the full `requirements.txt`. This requires system libraries (Poppler, Tesseract, Cairo/Pango/GDK-PixBuf) and can exceed serverless limits.
- Build a Docker image that installs those system packages and `requirements.txt`, then deploy the container to a platform that supports larger images (Render, Cloud Run, AWS ECS, Railway, etc.).
- A `Dockerfile` is available (or can be created) to help build a working image.

Notes and recommendations
-------------------------
- If you use third-party APIs for heavy conversions (Adobe PDF Services, ocr.space), prefer using them as hosted services rather than bundling heavy SDKs.
- If you want, I can create a production-ready `Dockerfile` and a `docker-compose.yml` for local testing and produce deployment instructions for Render/Cloud Run.
