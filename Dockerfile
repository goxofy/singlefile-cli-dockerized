FROM zenika/alpine-chrome:with-node

# 安装必要的 npm 包
RUN npm install --omit=dev single-file-cli express

WORKDIR /usr/src/app

COPY webserver.js .

# 修改入口点为 node webserver.js
CMD ["node", "webserver.js"]
