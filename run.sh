IMAGE_NAME="marza1996/snes_node"
CONTAINER_NAME="snes_emu"
ARGS="-t -d -it -P"
MOUNT_ARGS="-v /Users/harissikic/Desktop/SNESEmulator:/home/node/SNESEmulator"

docker run --name=$CONTAINER_NAME $ARGS $MOUNT_ARGS $IMAGE_NAME