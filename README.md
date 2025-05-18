# React Itinerary Planner

A modern, interactive travel itinerary planner built with React, Tailwind CSS, and drag-and-drop support. Plan your trip day-by-day, add activities, view weather, and manage your schedule with a beautiful UI and dark mode support.

---

## ✨ Features

- **Day-by-day itinerary planning**
- **Add, edit, and delete activities** for each day
- **Drag and drop** to reorder days and activities
- **Weather widget** for each day (simulated/demo)
- **Interactive map** for locations
- **Dark mode** and responsive design
- **Export** your itinerary
- **Keyboard shortcuts** for power users
- **LocalStorage** persistence

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/react-itinerary-planner.git
cd react-itinerary-planner
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Project Structure

```
src/
  components/        # Reusable React components
  hooks/             # Custom React hooks
  App.jsx            # Main application component
  index.css          # Tailwind and custom styles
  main.jsx           # Entry point
```

---

## 🖥️ Usage

- **Add a day:** Click the "Add Day" button.
- **Add an activity:** Click "Add Activity" under any day.
- **Edit or delete:** Use the pencil (edit) or trash (delete) icons on activities.
- **Reorder:** Drag and drop days or activities.
- **Switch theme:** Use the dark mode toggle in the header.
- **Export:** Click the "Export" button to download your itinerary.
- **Keyboard shortcuts:** Press `?` for help.

---

## ⚙️ Customization

- **Weather:** The weather widget uses simulated data. Integrate a real API for live weather.
- **Map:** The map is interactive and can be extended with real geolocation features.
- **Styling:** Uses Tailwind CSS for easy customization.

---

## 📦 Build for Production

```bash
npm run build
```

---

## 📝 License

MIT

---

## 🙏 Credits

- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)
- [Lucide Icons](https://lucide.dev/)
- [Vite](https://vitejs.dev/)

---

**Happy planning!**
