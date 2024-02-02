import { glob } from 'glob';
import { copyFile, unlink } from 'fs/promises';
import { basename } from 'path'

const mdFiles = await glob('./source/images/**/*.md');

let fileCount = 0;

// 使用 for const 处理
for (const file of mdFiles) {
    console.log(file);
    
    // get the file name
    const fileName = basename(file);

    await copyFile(file, './source/_posts/' + fileName);
    await unlink(file);
    fileCount++;
}

console.log('Copied ' + fileCount + ' files')
