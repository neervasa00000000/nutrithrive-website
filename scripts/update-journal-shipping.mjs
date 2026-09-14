import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const directoryPath = 'storefront/journal';

async function replaceInFile(filePath) {
  try {
    let content = await readFile(filePath, 'utf8');
    const oldString = '$79';
    const newString = '$79';

    if (content.includes(oldString)) {
      content = content.replace(new RegExp(oldString.replace(/\$/g, '\\$'), 'g'), newString);
      await writeFile(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

async function processJournalFiles() {
  try {
    const files = await readdir(directoryPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isDirectory()) {
        const subDirPath = join(directoryPath, file.name);
        const subDirFiles = await readdir(subDirPath, { withFileTypes: true });
        for (const subFile of subDirFiles) {
          if (subFile.isFile() && subFile.name.endsWith('.html')) {
            await replaceInFile(join(subDirPath, subFile.name));
          }
        }
      }
    }
  } catch (error) {
    console.error('Error reading directory:', error);
  }
}

processJournalFiles();
