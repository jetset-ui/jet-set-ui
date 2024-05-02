const fs = require("fs");
const fsExtra = require("fs-extra");

function compareAndCopyDirectories(sourceDir, destDir) {
  // Read the contents of source directory
  fs.readdir(sourceDir, (err, sourceFiles) => {
    if (err) {
      console.error("Error reading source directory:", err);
      return;
    }

    // Read the contents of destination directory
    fs.readdir(destDir, (err, destFiles) => {
      if (err) {
        console.error("Error reading destination directory:", err);
        return;
      }

      // Find missing directories
      const missingDirs = sourceFiles.filter(
        (item) =>
          fs.statSync(`${sourceDir}/${item}`).isDirectory() &&
          !destFiles.includes(item)
      );

      // Copy missing directories
      missingDirs.forEach((dir) => {
        fsExtra.copy(`${sourceDir}/${dir}`, `${destDir}/${dir}`, (err) => {
          if (err) {
            console.error(`Error copying ${dir}:`, err);
          } else {
            console.log(`Successfully copied ${dir}`);
          }
        });
      });
    });
  });
}

// Example usage
const sourceDirectory = "./playground/react/src/components";
const destinationDirectory = "./jet-set-ui/components";

compareAndCopyDirectories(sourceDirectory, destinationDirectory);
