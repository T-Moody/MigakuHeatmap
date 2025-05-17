# Migaku Custom Heatmap

A Tampermonkey userscript that enhances Migaku Memory with custom heatmap functionality.

## Features

- Automatically processes tooltips and heatmap tiles on the Migaku Memory website.
- Applies a gradient background to heatmap tiles based on review counts.

![Migaku Heatmap Example](https://github.com/user-attachments/assets/ffdf385b-9e37-42d2-ac58-1dc9137f856b)

---

## Installation

### Step 1: Download the Script

1. Go to the [Release Script](https://raw.githubusercontent.com/T-Moody/MigakuHeatmap/release/bundle.js)
2. Download the file or copy the code in bundle.js

### Step 2: Add the Script to the [Tampermonkey](https://www.tampermonkey.net/) extension

1. Open Tampermonkey in your browser.
2. Click on **Create a new script**.
3. Copy the contents of the downloaded `bundle.js` file.
4. Paste it into the Tampermonkey editor.
5. Save the script.

### Step 3: Use the Script

1. Navigate to [Migaku Memory](https://study.migaku.com/statistic).
2. The script will automatically run and enhance the heatmap functionality.
3. Refresh the page the gradients do not appear.

---

## Contributing

### Step 1: Clone the Repository

1. Fork this repository on GitHub.
2. Clone your forked repository to your local machine:
   ```bash
    git clone https://github.com/T-Moody/MigakuHeatmap.git
   ```

### Step 2: Install Dependencies

Run the following command to install the required dependencies:

```bash
npm install
```

### Step 3: Make Changes

After editing the source code in the `src` folder, build the project:

```bash
npm run build
```

### Step 4: Test Your Changes

1. Copy the updated `dist/bundle.js` file.
2. Paste it into Tampermonkey and test it on [Migaku Memory](https://study.migaku.com/).

### Step 5: Submit a Pull Request

1. Push your changes to your forked repository:
   ```bash
   git add .
   git commit -m "Describe your changes"
   git push origin main
   ```
2. Open a pull request on the original repository.

---

## License

This project is licensed under the [GPL-3.0 License](LICENSE).
