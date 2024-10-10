echo "Start server API"
docker compose -f ./server/docker-compose.yml -p text-me up -d

echo "Verify server API is up"
# URL of the API's heartbeat route
HEARTBEAT_URL="http://localhost:3333/"

# Time interval (in seconds) between retry attempts
RETRY_INTERVAL=5

echo "Checking the API heartbeat at $HEARTBEAT_URL..."

# Loop until the API returns a valid response (status code 200)
until curl --silent --fail --connect-timeout 5 "$HEARTBEAT_URL"; do
  echo "Waiting for the API to be ready..."
  sleep $RETRY_INTERVAL
done

echo "API is ready! Proceeding to the next command..."


echo "Start OpenAI Microservice"
docker compose -f ./openai-microservice/docker-compose.yml -p text-me up -d

echo "Start Client"
docker compose -f ./client/docker-compose.yml -p text-me up -d