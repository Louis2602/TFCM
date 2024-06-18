#!/bin/bash

# Run ngrok to expose port 3000 with the specified domain
ngrok http 3000 --domain safely-brave-lynx.ngrok-free.app &

# Wait for a few seconds to ensure ngrok has started
sleep 5

# Run the npm development server
npm run dev &

sleep 5

npm run studio