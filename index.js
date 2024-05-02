#! /usr/bin/env node

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { exec } = require("child_process");

const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);

// Function to copy React component directory
async function copyComponent(componentName) {
  try {
    const componentDirectory = path.join(
      __dirname,
      "jet-set-ui",
      "components",
      componentName
    );
    const targetDirectory = path.join(
      process.cwd(),
      "src",
      "jet-set-ui",
      "components",
      componentName
    );

    // Check if component directory exists
    const exists = fs.existsSync(componentDirectory);
    if (!exists) {
      console.error(`Component '${componentName}' not found.`);
      process.exit(1);
    }

    // Create target directory
    await mkdir(targetDirectory, { recursive: true });

    // Copy component files
    const files = await readdir(componentDirectory);
    copying(files)
      .then(() => {
        process.exit(1);
      })
      .catch((error) => {
        throw new Error(error);
      });
    // for (const file of files) {
    //   await copyFile(
    //     path.join(componentDirectory, file),
    //     path.join(targetDirectory, file)
    //   ).then(() => {
    //     console.log(
    //       `\nComponent '${componentName}' copied successfully to \u001b[32m'${targetDirectory}'\u001b[32m \n`
    //     );
    //     process.exit(1);
    //   });
    // }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

// Get component name from command line arguments
const componentName = process.argv[2];

if (!componentName) {
  console.error("Please provide a name for your React component.");
  process.exit(1);
}

// Check if npm install is attempted
if (
  process.env.npm_config_argv &&
  process.env.npm_config_argv.includes("install")
) {
  console.error(
    "This package cannot be installed via npm. Please use npx to execute it."
  );
  process.exit(1);
}

// Call the function
copyComponent(componentName);

// Function to refresh directory listing
async function copying(files) {
  return new Promise(async (resolve, reject) => {
    try {
      for (const file of files) {
        await copyFile(
          path.join(componentDirectory, file),
          path.join(targetDirectory, file)
        ).then(() => {
          console.log(
            `\nComponent '${componentName}' copied successfully to \u001b[32m'${targetDirectory}'\u001b[32m \n`
          );
        });
      }
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

// Function to refresh directory listing
async function refreshDirectory(directoryPath) {
  return new Promise((resolve, reject) => {
    exec("refresh_command", { cwd: directoryPath }, (error, stdout, stderr) => {
      if (error) {
        console.error("Error refreshing directory:", error);
        reject(error);
      } else {
        console.log("Directory refreshed successfully.");
        resolve();
      }
    });
  });
}
