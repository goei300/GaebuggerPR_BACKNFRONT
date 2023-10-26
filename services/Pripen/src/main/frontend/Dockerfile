# 기본 이미지로 Node.js를 사용합니다.
FROM node:14

# 작업 디렉토리를 설정합니다.
WORKDIR /app

# `package.json` 및 `package-lock.json`을 복사합니다.
COPY package*.json ./

# 의존성을 설치합니다.
RUN npm install

# 프로젝트의 모든 파일을 복사합니다.
COPY . .

# 리액트 앱을 빌드합니다.
RUN npm run build

# 3000번 포트를 열어줍니다.
EXPOSE 3000

# 컨테이너가 시작될 때 앱을 실행합니다.
CMD ["npm", "start"]
