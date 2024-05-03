const { compareAndCopyDirectories } = require("./common/copy");

const sourceDirectory = "./playground/react/src/cards";
const destinationDirectory = "./jet-set-ui/cards";

compareAndCopyDirectories(sourceDirectory, destinationDirectory);
