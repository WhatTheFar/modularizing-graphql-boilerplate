if [ -e .env ]; then
    docker-compose down --remove-orphans
    sleep 5
    echo '# start everything'
    docker-compose up
else 
    echo "Please set up your .env file before starting your environment."
    exit 1
fi
