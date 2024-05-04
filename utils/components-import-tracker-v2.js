const fs = require("fs");
const path = require("path");

let dependancyList = [];
let allDependency = [];

function getAllDependency(newDataDependancyArray, existingData) {
  newDataDependancyArray?.map((dependancyName) => {
    if (existingData[dependancyName]) {
      dependancyList.push(...existingData[dependancyName]?.dependencies);
      allDependency.push(...existingData[dependancyName]?.dependencies);
    }
    allDependency.push(dependancyName);
  });

  if (dependancyList?.length > 0) {
    let newList = [];
    dependancyList?.map((dependancyName) => {
      if (existingData[dependancyName]) {
        newList.push(...existingData[dependancyName]?.dependencies);
      }
    });
    dependancyList = newList;
    getAllDependency(dependancyList, existingData);
  } else {
    return allDependency;
  }
}

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
          const dependencies = [];

          // Extract dependencies by searching for import statements
          const regex = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
          let match;
          while ((match = regex.exec(content)) !== null) {
            const [, imports, dependency] = match;

            let pathArray = dependency.split("/");

            const dependencyNames = imports.split(",").map((dep) => dep.trim());

            dependencies.push(dependencyNames);
          }

          components.push({
            [componentName]: {
              path: filePath,
              dependencies: dependencies.flat(),
            },
          });
        }
      }
    }
  });

  return components;
}

// Directory containing your React components
const sourceDirectory = "./playground/react/src/pages/Dashboard";

// Traverse the directory to collect component information
const allComponents = traverseDirectory(sourceDirectory);

// Write the collected component information to a JSON file
const jsonFilePath = path.join(
  "./playground/react/src/",
  "dependency-tree.json"
);

const newData = allComponents[0];

if (fs.existsSync(jsonFilePath)) {
  // If the file exists, read the existing data
  const existingData = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));

  let newDataDependancyArray = Object.values(newData)[0]?.dependencies;

  getAllDependency(newDataDependancyArray, existingData);

  let newData2 = Object.values(newData)[0];

  newData2.dependencies = [...new Set(allDependency)];

  // Append the new data to the existing data
  let latestData = { ...existingData, ...newData };

  // Write the updated data back to the file
  fs.writeFileSync(jsonFilePath, JSON.stringify(latestData, null, 2));
} else {
  // If the file doesn't exist, create a new file with the new data
  fs.writeFileSync(jsonFilePath, JSON.stringify([newData], null, 2));
}

// fs.writeFileSync(jsonFilePath, JSON.stringify(allComponents[0], null, 2));
