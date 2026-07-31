FROM python:3.12-slim

WORKDIR /app

RUN addgroup --system --gid 1001 ai \
    && adduser --system --uid 1001 ai

COPY pyproject.toml ./
RUN pip install --no-cache-dir .

COPY --chown=ai:ai app ./app
COPY --chown=ai:ai main.py ./
COPY --chown=ai:ai knowledge ./knowledge

USER ai

EXPOSE 8001

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8001/health')"

CMD ["python", "main.py"]
