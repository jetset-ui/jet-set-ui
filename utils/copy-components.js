const { compareAndCopyDirectories } = require("./common/copy");

const sourceDirectory = "./playground/react/src/components";
const destinationDirectory = "./jet-set-ui/components";

compareAndCopyDirectories(sourceDirectory, destinationDirectory);
