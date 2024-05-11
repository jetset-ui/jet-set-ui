#! /usr/bin/env node

const fs = require("fs");
const path = require("path");
const fsExtra = require("fs-extra");

const installationQueue = [];
// Function to copy React component directory
async function copyComponent(componentName) {
  try {
    const componentDirectory = path.join(
      __dirname,
      "../",
      "jet-set-ui",
      "cards",
      componentName
    );

    const dependencyDirectoryJetSet = path.join(
      __dirname,
      "../",
      "jet-set-ui",
      "dependency-graph.json"
    );

    const targetDirectory = path.join(
      process.cwd(),
      "trail",
      "src",
      "jet-set-ui",
      "components",
      componentName
    );

    const dependencyDirectory = path.join(
      process.cwd(),
      "trail",
      "src",
      "jet-set-ui",
      "dependency.json"
    );

    const jetSetUIDirectory = path.join(
      process.cwd(),
      "trail",
      "src",
      "jet-set-ui"
    );

    const jetSetUIExists = fs.existsSync(jetSetUIDirectory);

    if (!jetSetUIExists) {
      // Create dependency directory
      fsExtra.ensureDirSync(jetSetUIDirectory);
      fs.writeFileSync(dependencyDirectory, "{}");
      console.error(`'created jet-set-ui directory in the project.`);
    }

    // Check if component directory exists
    const exists = fs.existsSync(componentDirectory);
    if (!exists) {
      console.error(`Component '${componentName}' not found.`);
      process.exit(1);
    }

    // Create target directory
    fsExtra.ensureDirSync(targetDirectory);

    const dependencyData = JSON.parse(
      fs.readFileSync(dependencyDirectory, "utf8")
    );

    const packageJsonData = JSON.parse(
      fs.readFileSync(dependencyDirectoryJetSet, "utf8")
    );

    const packageDependencies =
      packageJsonData[componentName].dependencies || {};

    // Get the difference between dependency.json and package.json
    const missingDependencies = packageDependencies.filter(
      (dependency) => !dependencyData[dependency]
    );

    console.log("missingDependencies:", missingDependencies);

    if (missingDependencies.length) {
      installationQueue.push(componentName, ...missingDependencies);
      console.log("installationQueue", installationQueue);
      await copyComponentsRecursively();
      process.exit;
    }

    // Copy component directory
    fsExtra.copySync(componentDirectory, targetDirectory);

    // Add componentName to dependency.json file
    dependencyData[componentName] = componentName;
    fs.writeFileSync(
      dependencyDirectory,
      JSON.stringify(dependencyData, null, 2)
    );

    console.log(
      `\nComponent '${componentName}' copied successfully to \u001b[32m'${targetDirectory}'\u001b[32m \n`
    );

    if (installationQueue.length) {
      console.log(installationQueue, "installationQueue");
      copyComponent(installationQueue.pop());
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

// Function to copy components recursively from the installation queue
async function copyComponentsRecursively() {
  while (installationQueue.length > 0) {
    const componentName = installationQueue.pop();
    await copyComponent(componentName);
  }
}

// Get component name from command line arguments
const componentName = process.argv[2];

if (!componentName) {
  console.error("Please provide a name for your React component.");
  process.exit(1);
}

// Call the function to copy the initial component
copyComponent(componentName).catch((error) => {
  console.error("Error occurred while copying the component:", error);
  process.exit(1);
});
