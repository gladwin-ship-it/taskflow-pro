# ⚡ TaskFlow Pro

A modern, full-featured task manager built with React. Beautiful dark UI with Board, List, and Calendar views.

## ✨ Features

- **3 Views**: Kanban Board, List View, Calendar View
- **Task Management**: Create, edit, delete, pin tasks
- **Priorities**: High / Medium / Low with color coding
- **Subtasks**: Nested subtasks with progress tracking
- **Tags**: Custom color-coded tags per task
- **Categories**: Work, Personal, Shopping, Health, Finance, Learning
- **Filters & Search**: Real-time search, filter by status/priority/category
- **Sort**: By date created, due date, priority, or title
- **Due Dates**: Visual overdue indicators
- **Pinning**: Pin important tasks to top
- **Stats Bar**: Live completion progress tracker
- **Persistence**: All data saved to localStorage
- **Responsive**: Mobile-friendly with collapsible sidebar

## 🚀 Deploy to Vercel (from GitHub)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "feat: initial TaskFlow Pro app"
git remote add origin https://github.com/YOUR_USERNAME/taskflow-pro.git
git push -u origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repo `taskflow-pro`
4. Vercel auto-detects Create React App settings
5. Click **Deploy** — live in ~60 seconds!

### Step 3: Auto-Deploy
Every `git push` to `main` will auto-deploy. No config needed.

## 🛠 Local Development

```bash
npm install
npm start
# Opens at http://localhost:3000
```

## 📦 Build for Production

```bash
npm run build
```

## 🧱 Tech Stack

- **React 18** — UI framework
- **CSS Variables** — Theming system
- **LocalStorage** — Data persistence
- **Google Fonts** — Syne + DM Sans typography
- **Vercel** — Zero-config deployment

## 📁 Project Structure

```
taskflow/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx        # Main app + all components
│   ├── App.css        # Full design system
│   └── index.js       # Entry point
├── vercel.json        # Vercel config
└── package.json
```

---

Built for **Gladwin** · gladwin@mitsumidistribution.com
