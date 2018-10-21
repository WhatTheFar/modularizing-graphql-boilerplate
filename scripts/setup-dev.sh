if [ -e .env ]; then
    set -a # automatically export all variables
    source .env
    set +a
else 
    echo "Please set up your .env file before starting your environment."
    exit 1
fi
export PRISMA_ENDPOINT=http://localhost:4466
bash scripts/clear-container.sh
if [ ! "$(docker ps -q -f name=$PRISMA_CONTAINER_NAME)" ]; then
    echo "# Setting up environment"
    # run container
    docker-compose up -d prisma
    echo "# Wating for database"
    sleep 10
    echo "# Deploying prisma service"
    yarn prisma-deploy
fi
echo "# Everything is already up"