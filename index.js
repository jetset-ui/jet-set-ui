const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);

// Function to copy React component directory
async function copyComponent(componentName) {
  try {
    const componentDirectory = path.join(
      __dirname,
      "..",
      "jet-set-ui",
      "src",
      "components",
      componentName
    );
    const targetDirectory = path.join(process.cwd(), componentName);

    // Check if component directory exists
    const exists = fs.existsSync(componentDirectory);
    if (!exists) {
      console.error(`Component '${componentName}' not found.`);
      process.exit(1);
    }

    // Create target directory
    await mkdir(targetDirectory);

    // Copy component files
    const files = await readdir(componentDirectory);
    for (const file of files) {
      await copyFile(
        path.join(componentDirectory, file),
        path.join(targetDirectory, file)
      );
    }

    console.log(
      `Component '${componentName}' copied successfully to '${targetDirectory}'.`
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
