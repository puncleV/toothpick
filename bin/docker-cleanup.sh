#!/usr/bin/env bash

sudo docker-compose down
sudo docker rmi toothpick_database toothpick_rest-api
sudo docker volume rm toothpick_db-data
