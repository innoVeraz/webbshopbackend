# E-shop Backend API

Detta är backend-delen av e-handelsapplikationen, byggd med Node.js, Express, och MySQL. Projektet använder Docker för enkel installation och körning.

## Förutsättningar

- Docker och Docker Compose
- Node.js (om du vill köra utan Docker)
- Stripe CLI (för webhook-utveckling)

## Installation och körning med Docker

1. Klona projektet
```bash
git clone <repository-url>
cd webbshopbackend/ecommerce-api
```

2. Skapa en .env fil i ecommerce-api mappen med följande innehåll:
```env
DB_HOST=db
DB_USER=root
DB_PASSWORD=example
DB_NAME=ecommerce
PORT=3000
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

3. Starta Docker-containrarna
```bash
docker-compose up --build
```

API:et kommer nu vara tillgängligt på [http://localhost:3000](http://localhost:3000)

## Installation utan Docker

1. Se till att du har en MySQL-server igång
2. Uppdatera .env filen med dina databasuppgifter:
```env
DB_HOST=localhost
DB_USER=din_användare
DB_PASSWORD=ditt_lösenord
DB_NAME=ecommerce
PORT=3000
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

3. Installera dependencies
```bash
npm install
```

4. Kör databasens migrations
```bash
mysql -u root -p ecommerce < ecommerce.sql
```

5. Starta servern
```bash
npm run dev
```

## Stripe Integration

### Konfigurera Stripe

1. Skapa ett Stripe-konto om du inte har ett
2. Gå till Stripe Dashboard och hämta dina API-nycklar
3. Uppdatera .env med dina Stripe-nycklar

### Konfigurera Webhooks

1. Installera Stripe CLI: https://stripe.com/docs/stripe-cli
2. Logga in med Stripe CLI:
```bash
stripe login
```

3. Starta webhook forwarding:
```bash
stripe listen --forward-to localhost:3000/stripe/webhook
```

4. Kopiera webhook-signing secret och lägg till i .env

## API Endpoints

### Products
- GET /products - Hämta alla produkter
- POST /products - Skapa ny produkt
- GET /products/:id - Hämta specifik produkt
- PATCH /products/:id - Uppdatera produkt
- DELETE /products/:id - Ta bort produkt

### Orders
- GET /orders - Hämta alla ordrar
- POST /orders - Skapa ny order
- GET /orders/:id - Hämta specifik order
- PATCH /orders/:id - Uppdatera order
- DELETE /orders/:id - Ta bort order
- GET /orders/payment/:id - Hämta order via payment_id

### Customers
- GET /customers - Hämta alla kunder
- POST /customers - Skapa ny kund
- GET /customers/:id - Hämta specifik kund
- GET /customers/email/:email - Hämta kund via email
- PATCH /customers/:id - Uppdatera kund
- DELETE /customers/:id - Ta bort kund

### Stripe
- POST /stripe/create-checkout - Skapa checkout session
- POST /stripe/webhook - Webhook endpoint

## Docker-kommandon

- Starta containrarna: `docker-compose up`
- Starta i bakgrunden: `docker-compose up -d`
- Stoppa containrarna: `docker-compose down`
- Se loggar: `docker-compose logs -f`
- Rebuilda: `docker-compose up --build`

## Databas

MySQL-databasen körs i en separat container och är konfigurerad med följande:
- Port: 3306 (mapped till host)
- Root lösenord: example (ändra i produktionen!)
- Databas: ecommerce

### Databasstruktur

Databasen initieras automatiskt med tabeller för:
- Products
- Customers
- Orders
- Order_items

Se `ecommerce.sql` för fullständig databasstruktur.

## Utveckling

### Logs
Alla API-anrop och fel loggas i konsolen. I Docker kan du se loggarna med:
```bash
docker-compose logs -f api
```

### Debugging
För att debugga i Docker, exponeras Node debugger på port 9229:
1. Lägg till `debugger` i koden där du vill sätta en breakpoint
2. Anslut din IDE till debug port 9229

## Tester
För att köra tester:
```bash
npm test
```

I Docker:
```bash
docker-compose exec api npm test
