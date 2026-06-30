# ---- 构建阶段 ----
FROM node:20-alpine AS builder

WORKDIR /app

# 先拷依赖描述文件，利用层缓存
COPY package.json package-lock.json ./
RUN npm ci

# 再拷源码并构建
COPY . .
RUN npm run build

# ---- 运行阶段 ----
FROM nginx:alpine

# 用自定义 nginx 配置替换默认配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 把构建产物搬到 nginx 静态资源目录
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
