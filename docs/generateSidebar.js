const fs = require('fs');
const path = require('path');

const sidebarItems = []; // 存储侧边栏项的数组

// 扫描目录并添加侧边栏项
function scanDirectory(directory) {
    const files = fs.readdirSync(directory); // 获取目录下的文件列表
    files.forEach(file => {
        const filePath = path.join(directory, file); // 获取文件的完整路径
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            // 如果是目录，则递归扫描
            scanDirectory(filePath);
        } else if (stats.isFile() && file.endsWith('.md')) {
            // 如果是文件且是 Markdown 文件，则解析文件内容并添加到侧边栏项数组
            const content = fs.readFileSync(filePath, 'utf-8');
            const title = parseTitle(content); // 解析 Markdown 文件中的标题
            const item = { title, path: `/${filePath}` }; // 构造侧边栏项对象
            sidebarItems.push(item); // 添加到侧边栏项数组
        }
    });
}

// 解析 Markdown 文件中的标题
function parseTitle(content) {
    // 此处可以根据需要编写解析标题的逻辑
    // 这里只是简单地查找第一个以 # 开头的行并提取标题
    const match = content.match(/^#\s*(.*)/m);
    return match ? match[1].trim() : 'Untitled'; // 返回标题文本，如果没有找到则返回 'Untitled'
}

// 扫描指定目录下的文件
const directoryToScan = './docs'; // 指定要扫描的目录
scanDirectory(directoryToScan);

// 输出侧边栏项数组
console.log(sidebarItems);

function generateMarkdown(items, depth = 0) {
    let markdown = '';
    items.forEach(item => {
        const indentation = '  '.repeat(depth); // 缩进
        markdown += `${indentation}- [${item.title}](${item.path})\n`;
        if (item.children && item.children.length > 0) {
            markdown += generateMarkdown(item.children, depth + 1); // 递归调用生成子项的 Markdown
        }
    });
    return markdown;
}
// 生成 Markdown 内容并写入到 _sidebar.md 文件中（您可以将此部分代码放到您原来的脚本中）
const sidebarMarkdown = generateMarkdown(sidebarItems);
fs.writeFileSync('_sidebar.md', sidebarMarkdown);