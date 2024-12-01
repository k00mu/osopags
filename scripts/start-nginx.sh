#!/bin/bash

# Substitute environment variables in the nginx.conf template
envsubst '$ENGINE_PORT $WEB_PORT' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Start Nginx
nginx -g 'daemon off;'