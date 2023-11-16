FROM node:18.17.1

ENV NODE_ENV production


WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install


# 소스 코드 복사
COPY . .

EXPOSE 3500

# 애플리케이션 빌드
CMD ["npm", "start"]