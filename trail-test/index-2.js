#! /usr/bin/env node

const fs = require("fs");
const path = require("path");
const fsExtra = require("fs-extra");
const { Command } = require("commander");

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
      "trail-test",
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

    let filePath = path.resolve(targetDirectory);

    // Copy component directory
    fsExtra.copySync(componentDirectory, targetDirectory);
    // await fs.writeFile(filePath, content);

    console.log(
      `\nComponent '${componentName}' copied successfully to \u001b[32m'${targetDirectory}'\u001b[32m \n`
    );
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

const addComponent = new Command()
  .name("add-component")
  .argument("[components...]", "the components to add")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .action(async (components, opts) => {
    if (components?.length === 0) {
      console.error("Please provide a name for your React component.");
      process.exit(1);
    }

    for (const component of components) {
      await copyComponent(component);
    }
  });

addComponent.parse();
