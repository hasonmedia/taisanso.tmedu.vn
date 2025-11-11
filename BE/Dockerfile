# Sử dụng Node.js chính thức
FROM node:18-alpine

# Tạo thư mục app trong container
WORKDIR /app

# Copy package.json và package-lock.json trước (tối ưu cache)
COPY package*.json ./

# Cài dependency
RUN npm install --production

# Copy toàn bộ code
COPY . .

# Expose port (ví dụ 3001)
EXPOSE 3001

# Lệnh chạy BE
CMD ["node", "server.js"]
