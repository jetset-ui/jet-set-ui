#! /usr/bin/env node

const fs = require("fs");
const path = require("path");
const fsExtra = require("fs-extra");

// Function to copy React component directory
async function copyComponent(componentName) {
  try {
    const componentDirectory = path.join(
      __dirname,
      "../",
      "jet-set-ui",
      "components",
      componentName
    );
    const targetDirectory = path.join(
      process.cwd(),
      "trail",
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
    fsExtra.ensureDirSync(targetDirectory);

    // Copy component directory
    fsExtra.copySync(componentDirectory, targetDirectory);

    console.log(
      `\nComponent '${componentName}' copied successfully to \u001b[32m'${targetDirectory}'\u001b[32m \n`
    );
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
if (process.argv && process.argv[0] === "npm") {
  console.error(
    "This package cannot be installed via npm. Please use npx to execute it."
  );
  process.exit(1);
}

// Call the function
copyComponent(componentName);
