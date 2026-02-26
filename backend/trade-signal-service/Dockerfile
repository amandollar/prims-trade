FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install --workspaces --include-workspace-root
RUN npm run build -w shared && npm run build -w trade-signal-service
EXPOSE 3003
CMD ["node", "trade-signal-service/dist/server.js"]
