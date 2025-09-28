# SNK Market Data Research Website

This is a [Next.js](https://nextjs.org) and [FastAPI](https://fastapi.tiangolo.com/) project for SNK Market Data Research (SNK MDR), Malaysia's leading Insurtech provider. The platform delivers digital solutions for motor insurance, including claims processing, vehicle valuation, roadside assistance, and online insurance policy platforms.

## Features

- **Modern Next.js 15 App Router** with TypeScript
- **Custom UI Components**: Hero sections, solution cards, client carousels, FAQ, and more
- **API Integration**: FastAPI backend for vehicle valuation and information
- **End-to-End Digital Claims**: AllClaims system for fast, accurate vehicle claims estimation
- **Road Ranger**: Roadside assistance and accident management
- **Digital Insurance Platform**: Instant policy issuance and management
- **Trusted by Industry Leaders**: Allianz, Etiqa, MSIG, Tokio Marine, and more

## Getting Started

### Installation

1. **Install Node.js dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Set up Python virtual environment:**
   It is recommended to use a virtual environment named `.venv` for Python dependencies:
   ```bash
   python -m venv .venv
   # Activate the virtual environment:
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   source .venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

### Running the App

To start both the Next.js frontend and FastAPI backend in development mode:

```bash
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000/docs](http://localhost:8000/docs) (FastAPI docs)

## Project Structure

- `app/` - Next.js app directory (pages, components, styles)
- `api/` - FastAPI backend (vehicle valuation, information APIs)
- `public/` - Static assets (images, SVGs, client logos)
- `requirements.txt` - Python dependencies
- `package.json` - Node.js dependencies and scripts

## Scripts

- `npm run dev` - Run both Next.js and FastAPI in development
- `npm run next-dev` - Run only Next.js frontend
- `npm run fastapi-dev` - Run only FastAPI backend
- `npm run build` - Build Next.js app
- `npm start` - Start Next.js in production
- `npm run lint` - Lint code with ESLint

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Vercel Deployment](https://vercel.com/docs)

---
