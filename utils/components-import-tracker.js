const fs = require("fs");
const path = require("path");

// Function to recursively traverse directories and collect component information
function traverseDirectory(directory) {
  const components = [];

  // Read the contents of the directory
  const files = fs.readdirSync(directory);

  // Iterate over each file in the directory
  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    // If it's a directory, recursively traverse it
    if (stat.isDirectory()) {
      components.push(...traverseDirectory(filePath));
    } else {
      // If it's a JavaScript file, check if it's a React component
      if (filePath.endsWith(".js") || filePath.endsWith(".jsx")) {
        const content = fs.readFileSync(filePath, "utf8");
        const componentName = path.basename(filePath, path.extname(filePath));

        // Check if the file contains a React component
        if (
          content.includes("React.Component") ||
          content.includes("function " + componentName)
        ) {
          const dependencies = {};

          // Extract dependencies by searching for import statements
          const regex = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
          let match;
          while ((match = regex.exec(content)) !== null) {
            const [, imports, dependency] = match;

            let pathArray = dependency.split("/");

            const dependencyNames = imports.split(",").map((dep) => dep.trim());

            dependencies[pathArray[pathArray?.length - 1]] = dependencyNames;
          }

          components.push({
            [componentName]: {
              path: filePath,
              dependencies: dependencies,
            },
          });
        }
      }
    }
  });

  return components;
}

// Directory containing your React components
const sourceDirectory = "./playground/react/src/cards/Crard-1";

// Traverse the directory to collect component information
const allComponents = traverseDirectory(sourceDirectory);

// Write the collected component information to a JSON file
const jsonFilePath = path.join(sourceDirectory, "component-dependency.json");

fs.writeFileSync(jsonFilePath, JSON.stringify(allComponents[0], null, 2));
