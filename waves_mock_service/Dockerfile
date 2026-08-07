FROM wiremock/wiremock:3.3.1

# Copy mappings and response files
COPY mappings /home/wiremock/mappings
COPY __files /home/wiremock/__files

# Expose ports
EXPOSE 8080 8443

# Enable response templating
ENTRYPOINT ["/docker-entrypoint.sh", "--global-response-templating", "--local-response-templating", "--verbose"]
