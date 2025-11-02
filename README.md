# Currency Converter Frontend

This is the frontend dashboard for the Currency Converter application.

backend github:

backend deployed link:https://back-intern-frontend.vercel.app/

frontend deployed link:https://back-intern-backend.vercel.app/

## Quick Start

### Option 1: Open Directly
Simply open `index.html` in your web browser.

### Option 2: Using a Local Server (Recommended)

**Using Node.js:**
```bash
npm start
# or
npx http-server . -p 8080
```

**Using Python:**
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

Then open http://localhost:8080 in your browser.

## Configuration

1. Make sure the backend is running (default: http://localhost:3000)
2. Update the API URL in the frontend if your backend is on a different address
3. Select the currency (ARS or BRL) from the dropdown

## Features

- 📊 Real-time exchange quotes display
- 📈 Average rates calculation
- 📉 Slippage analysis with color-coded indicators
- 🔄 Auto-refresh every 60 seconds
- 🎨 Modern, responsive design
- ⚡ Fast and lightweight

## Deployment

To deploy the frontend:

### Netlify
1. Drag and drop this folder to https://netlify.com
2. Update the API URL in `app.js` to point to your deployed backend

### Vercel
```bash
vercel --prod
```

### GitHub Pages
```bash
git subtree push --prefix frontend origin gh-pages
```

## Customization

- **Styling**: Edit `styles.css`
- **API Integration**: Edit `app.js`
- **Layout**: Edit `index.html`
