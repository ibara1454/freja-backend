FROM node:11.9.0-alpine as builder
LABEL maintainer "Ibara Takanashi <ibara1454@gmail.com>"

# Set environment to development
ENV NODE_ENV development

# Add all files in current directory into container
ADD . / workspace/
WORKDIR /workspace

RUN npm install \
    && npm run build

# ===================================

FROM node:11.9.0-alpine

ADD . / workspace/
COPY --from=builder /workspace/dist/ workspace/dist
WORKDIR /workspace

ENV NODE_ENV production
ENV PORT 80
EXPOSE 80

RUN npm install
ENTRYPOINT ["npm", "run", "serve"]
