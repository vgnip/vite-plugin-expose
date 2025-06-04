import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from "url";
import dts from 'vite-plugin-dts'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default defineConfig({
    build: {
        outDir: "lib",
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            fileName: 'index',
            formats: ['es']
        }
    },
    plugins: [
        dts({
            insertTypesEntry: true, // 生成类型声明入口
            include: ['src'],      // 包含的ts文件
            exclude: ['**/__tests__/**'], // 排除测试文件
            beforeWriteFile: (filePath, content) => {
                // 可选：自定义类型文件写入逻辑
                return { filePath, content }
            }
        })
    ]
});