if (process.argv && process.argv[0] === "npm") {
  console.error(
    "This package cannot be installed via npm. Please use npx to execute it."
  );
  process.exit(1);
}
