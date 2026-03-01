# Ev's Dance – Start the app

## Reset and open Ev's Dance

1. **Fix npm cache** (only if you get an `EPERM` / permission error):
   ```bash
   sudo chown -R $(whoami) ~/.npm
   ```

2. **Stop any other dev server**
   In the terminal where another project is running, press **Ctrl+C**.

3. **Start Ev's Dance from this project:**
   ```bash
   cd /Users/buckafamily/evs-dance/frontend
   npm install
   npm run dev
   ```

4. **Open in your browser:**
   **http://localhost:5180**

If you still see a different project, confirm you're in `/Users/buckafamily/evs-dance/frontend` when you run `npm run dev` (check with `pwd`).
