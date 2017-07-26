#!/bin/bash

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
# Required environment variables
REQUIRED_ENV=(
  "SLACK_TOKEN"
  "CLEVERBOT_USER"
  "CLEVERBOT_KEY"
)

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
# Check missing enviroment variables
check_env_var () {
  for env in "${REQUIRED_ENV[@]}"; do
    if [[ -z "${!env}" ]]; then
      echo "Missing required environment variable $env"
      exit 1
    fi
  done
}

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
# Entrypoint
check_env_var
npm start
