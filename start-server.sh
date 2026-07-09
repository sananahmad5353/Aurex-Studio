#!/bin/bash
cd /home/z/my-project/.next/standalone
while true; do
  NODE_OPTIONS="--max-old-space-size=512" NODE_ENV=production node server.js 2>&1
  sleep 2
done