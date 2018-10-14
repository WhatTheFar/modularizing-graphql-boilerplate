if [ "$(docker ps -q)" ]; then
    echo '# stop running container'
    docker stop $(docker ps -q)
fi
if [ "$(docker ps -aq)" ]; then
    echo '# remove exited container'
    docker rm $(docker ps -aq)
fi