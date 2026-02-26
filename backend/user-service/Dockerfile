FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install --workspaces --include-workspace-root
RUN npm run build -w shared && npm run build -w user-service
EXPOSE 3002
CMD ["node", "user-service/dist/server.js"]
