FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install --workspaces --include-workspace-root
RUN npm run build -w shared && npm run build -w auth-service
EXPOSE 3001
CMD ["node", "auth-service/dist/server.js"]
