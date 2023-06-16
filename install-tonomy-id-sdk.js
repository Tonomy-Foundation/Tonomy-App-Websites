import { execSync } from "child_process";

try {
  const currentBranch = execSync("git symbolic-ref --short HEAD", {
    encoding: "utf8",
  }).trim();

  console.log("current branch", currentBranch);

  if (currentBranch !== "master") {
    console.log("execution start");
    execSync("yarn add @tonomy/tonomy-id-sdk@development", {
      stdout: "inherit",
    });
    console.log("execution end");
  }
} catch (error) {
  console.error("An error occurred:", error);
  process.exit(1); // Exit the script with a non-zero code to indicate failure
}
