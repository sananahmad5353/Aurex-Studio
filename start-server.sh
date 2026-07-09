#!/bin/bash
cd /home/z/my-project/.next/standalone
exec > /tmp/aurex-server.log 2>&1
while true; do
  NODE_ENV=production node server.js
  echo "[$(date)] Server exited, restarting in 2s..."
  sleep 2
done
