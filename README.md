# VenturEd Executive Dashboard

This project is a modern, accessible executive dashboard for **VenturEd Solutions**. It is built with the Next.js **App Router**, TypeScript, Tailwind CSS and Radix UI. Data is loaded from two Excel files (`calls.xlsx` and `emails.xlsx`) stored in the `data` directory. An optional AI insights feature is powered by Google Gemini and requires an API key.

## Features

* **Dark, executive‑style design** with teal highlights based off the provided VenturEd logo
* **Responsive layout** with a left sidebar on desktop and a slide‑out drawer on mobile
* **Date‑range filtering** via the URL search parameters
* **Charts and metrics** computed from call and email activity
* **AI insights** endpoint and page that can summarise data using the Gemini model
* **Accessibility focused** design: keyboard navigable, screen‑reader friendly, semantic landmarks, visible focus states and reduced motion support

## Getting started

### Prerequisites

* Node.js ≥ 18
* npm ≥ 9

### Installation

1. Clone this repository and install dependencies:

   ```sh
   git clone <repository-url>
   cd ventured-executive-dashboard
   npm install
   ```

2. Copy `.env.example` to `.env.local` and set your Gemini API key:

   ```env
   GEMINI_API_KEY=sk-your-key-here
   ```

3. Place your Excel files in the `data` directory. Two sample files (`calls.xlsx` and `emails.xlsx`) are provided. The application expects the exact filenames.

### Running locally

Start the development server with:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The application will reload as you edit files.

### Building for production

To create an optimised build, run:

```sh
npm run build
npm run start
```

The app should run on port 3000 by default. When deploying to Vercel, a production build will be created automatically.

### Deploying to Vercel

1. Push your repository to a Git provider (GitHub, GitLab, etc.).
2. Create a new project on Vercel and link it to your repository.
3. In the Vercel dashboard, add an environment variable named `GEMINI_API_KEY` with your Gemini key.
4. Deploy. No additional configuration is required.

### Project structure

```text
ventured-executive-dashboard/
├── app/
│   ├── layout.tsx          # Root layout with sidebar and topbar
│   ├── globals.css         # Global styles and font declarations
│   ├── not-found.tsx       # 404 page
│   ├── error.tsx           # Global error boundary
│   ├── page.tsx            # Redirects to the overview page
│   ├── overview/page.tsx   # Executive overview with KPIs and charts
│   ├── sales/page.tsx      # Sales metrics
│   ├── support/page.tsx    # Support metrics
│   ├── emails/page.tsx     # Email‑centric metrics
│   ├── ai/page.tsx         # AI insights and prompt interface
│   ├── settings/page.tsx   # Placeholder for future settings
│   └── api/
│       └── ai/insights/route.ts  # API route for AI requests
├── components/
│   ├── sidebar.tsx
│   ├── topbar.tsx
│   ├── date-range.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── kpi-card.tsx
│   ├── table.tsx
│   ├── skeleton.tsx
│   └── charts/
│       ├── trend-line.tsx
│       ├── bar-ranked.tsx
│       └── distribution.tsx
├── lib/
│   ├── data/
│   │   └── excel.ts         # Excel parsing and caching
│   ├── metrics.ts           # Computation of metrics for pages
│   ├── ai/
│   │   └── summary.ts       # Builds the structured summary for AI
│   └── utils/
│       ├── date.ts          # Date helpers
│       └── cn.ts            # Conditional class name helper
├── data/
│   ├── calls.xlsx           # Raw call data
│   └── emails.xlsx          # Raw email data
├── public/
│   └── brand/ventured-logo.png
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── tsconfig.json
├── .env.example
├── .eslintrc.json
├── .prettierrc
└── README.md
```

## Notes

* The AI insights endpoint is disabled if no `GEMINI_API_KEY` is supplied.
* Ensure that the Excel files are included in the build output; they reside in the `data` folder.
* This project makes extensive use of server components for data loading and caching. Avoid importing server‑only libraries in client components.

## License

This project is provided without any warranty. VenturEd brand assets belong to VenturEd Solutions.