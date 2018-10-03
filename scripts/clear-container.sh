echo '# stop and remove running container'
docker stop $(docker ps -q)
docker rm $(docker ps -aq)