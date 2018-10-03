if [ -e .env ]; then
    source .env
else 
    echo "Please set up your .env file before starting your environment."
    exit 1
fi
export PRISMA_ENDPOINT=http://localhost:4466
echo "# Setting up environment"
docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d prisma
echo "# Running test"
yarn watch-test