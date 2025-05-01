# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
# Use --no-cache-dir to reduce image size
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container at /app
COPY . .

# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variable (optional, can be set at runtime)
# ENV OPENAI_API_KEY YOUR_API_KEY

# Run app.py when the container launches using uvicorn
# Use --host 0.0.0.0 to ensure it's accessible from outside the container
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "80"] 