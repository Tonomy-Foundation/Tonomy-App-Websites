import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

/**
 * using dynamic import to have less code depending on the subdomain
 *
 * this solution can also be done using multiple servers in vite to load root based on subdomain
 */

console.log(window.location.port);
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

console.log(window.location.href);
try {
  if(parseInt(window.location.port) === 3001){
    import("./demo/module-index.js").then((module) => {
      const demo = module.default;
      demo(root);
    });
  }else if(parseInt(window.location.port) === 3000){
    import("./demo/module-index.js").then((module) => {
      const demo = module.default;
      demo(root);
    });
  }
  
} catch (e) {
  console.log(e);
}
