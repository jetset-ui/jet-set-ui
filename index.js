#! /usr/bin/env node
const fs = require("fs");
const path = require("path");

function createPackage(componentName) {
  // Validate component name
  if (!componentName) {
    console.error("Component name is required.");
    return;
  }
  // Validate component name for invalid characters (optional)
  if (!isValidComponentName(componentName)) {
    console.error("Invalid component name.");
    return;
  }

  // Create directory
  const directoryPath = path.join(process.cwd(), componentName);
  try {
    fs.mkdirSync(directoryPath);
  } catch (err) {
    console.error("Error creating directory:", err);
    return;
  }

  // Copy file
  const templateFilePath = path.join(__dirname, "template.txt"); // Assuming template.txt is your template file
  try {
    fs.copyFileSync(
      templateFilePath,
      path.join(directoryPath, "copiedFile.txt")
    );
  } catch (err) {
    console.error("Error copying file:", err);
    return;
  }

  console.log(`Package '${componentName}' created successfully!`);
}

// Validate component name for invalid characters (optional)
function isValidComponentName(componentName) {
  return /^[a-zA-Z0-9_-]+$/.test(componentName);
}

module.exports = createPackage;

// Run function if executed directly
if (require.main === module) {
  const componentName = process.argv[2];
  createPackage(componentName);
}
