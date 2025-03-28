# Använd en Node.js-bild
FROM node:18

# Skapa arbetsmapp i containern
WORKDIR /app

# Install tsx globally
RUN npm install -g tsx

# Kopiera package.json och package-lock.json först (för att optimera caching)
COPY package*.json ./

# Installera dependencies med clean install
RUN npm ci

# Kopiera hela projektet (inkl. public-mappen)
COPY . . 

# Kopiera public-mappen separat för säkerhets skull
COPY public /app/public

# Exponera port 3000
EXPOSE 3000

# Starta API:t
CMD ["npm", "run", "dev"]

