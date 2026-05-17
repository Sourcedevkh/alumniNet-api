#!/bin/bash

echo "Searching for your local Wi-Fi IPv4 address..."

# Get wifi IPv4
IP=$(ipconfig getifaddr en0)

if [ -z "$IP" ]; then
    # Fallback method if en0 is not the Wi-Fi interface
    IP=$(networksetup -getinfo Wi-Fi | grep "IP address:" | awk '{print $3}')
fi

echo "Your computer's local IP is: $IP"
echo ""