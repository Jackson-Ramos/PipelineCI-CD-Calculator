# PipelineCI-CD-Calculator

This project is a **basic calculator application** built with **HTML, CSS, and JavaScript**.  
It is part of a Cloud Computing course assignment to demonstrate the setup of a **CI/CD pipeline** using **GitHub Actions**.

---

## 📌 Project Overview
- A simple, responsive, and professional-looking calculator web app.
- Configured with a **CI/CD pipeline** that runs automatically on pushes and pull requests.
- Uses **shared GitHub runners** (`ubuntu-latest`) for execution.
- Ensures that the **build step runs without errors**.

---

## 🚀 Live Demo
After enabling **GitHub Pages** in `Settings → Pages`, the app can be accessed at:  

👉 [PipelineCI-CD-Calculator - GitHub Pages](https://jackson-ramos.github.io/PipelineCI-CD-Calculator/)  

---

## 📂 Project Structure
├── index.html # Main HTML file
├── style.css # Styling
├── script.js # Calculator logic
└── .github/
└── workflows/
└── ci.yml # GitHub Actions workflow


---

## ⚙️ CI/CD Pipeline
The pipeline is defined in `.github/workflows/ci.yml`.

### Trigger Events
- Runs on every **push** and **pull request** to the `master` or `main` branch.

### Jobs
- **Checkout repository** → Clones the repository inside the runner.
- **Sanity check / build** → Verifies the presence of project files (`index.html`, `style.css`, `script.js`) and lists them.

### Example workflow
```yaml
name: CI - Calculator

on:
  pull_request:
    branches: [ master, main ]
  push:
    branches: [ master, main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Sanity check
        run: |
          echo "Listing project files..."
          ls -la
          test -f index.html && test -f style.css && test -f script.js
