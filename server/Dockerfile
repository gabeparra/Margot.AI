ARG PYTHON_VERSION=3.12.0

# Get the base python image from Docker Hub

FROM python:${PYTHON_VERSION}-bullseye AS python-deps

WORKDIR /app

# Install runtime dependencies
RUN apt-get install gcc git -y

# Install python dependencies in /.venv
COPY requirements.txt ./

RUN --mount=type=cache,target=/root/.cache pip install --upgrade pip && \
    pip install --disable-pip-version-check  -r requirements.txt && \
    rm -rf requirements.txt

RUN pip list
# Remove ssh key for runtime
RUN rm -rf /root/.ssh/
RUN apt-get -y remove gcc git && \
    apt-get -y autoremove && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install application into container
COPY . .

FROM python-deps as runtime

WORKDIR /app

CMD ["python", "src/base.py"]