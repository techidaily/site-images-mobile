import { glob } from 'glob';
import { copyFile, unlink, access, constants, readFile, writeFile } from 'fs/promises';
import { basename, dirname, join } from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mdFiles = await glob('./source/images/**/*.md');

let fileCount = 0;

// 使用 for const 处理
for (const file of mdFiles) {
    console.log(file);
    
    // get the file dir name
    const parentDir = dirname(file);

    // check in the dir, has 5 JPEG file. eg: 1.jpg, 2.jpg, 3.jpg, 4.jpg, 5.jpg
    let isSatisfy = true;
    for (let i = 1; i <= 5; i++) {
        const jpgFile = join(__dirname, parentDir, i + '.jpg');

        try {
            await access(jpgFile, constants.R_OK)
        } catch {
            isSatisfy = false;
            break;
        }
    }

    if (!isSatisfy) continue;

    // get the file name
    const fileName = basename(file);

    // read the file content
    const content = await readFile(file, 'utf-8');

    // replace the '{{img-site-assets-images-url}}' with '/images/' of the file content
    const newContent = content.replace(/{{img-site-assets-images-url}}/g, '/images/');

    // write the new content to the file
    await writeFile(file, newContent);

    // copy the file to the _posts dir
    await copyFile(file, './source/_posts/' + fileName);
    await unlink(file);

    fileCount++;
}

console.log('Copied ' + fileCount + ' files')
