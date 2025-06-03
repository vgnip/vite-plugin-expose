import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default defineConfig({
    build: {
        outDir: "lib",
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'vite-plugin-expose',
            formats: ['es']
        }
    },
});