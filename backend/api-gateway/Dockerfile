FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install --workspaces --include-workspace-root
RUN npm run build -w shared && npm run build -w api-gateway
EXPOSE 3000
CMD ["node", "api-gateway/dist/server.js"]
