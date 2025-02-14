import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="p-4 text-center mt-0 sm:mt-14 md:mt-36 lg:mt-36 xl:mt-36">
      <p className="text-gray-600 text-sm">
        Developed by <span className="font-semibold">Rajat Rajput</span> |
        <a
          href="https://github.com/rajatrajputnbd/my-crud-app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline ml-1"
        >
          GitHub
        </a>{" "}
        |
        <a
          href="https://www.linkedin.com/in/rajat-rajput-9b8b14203/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline ml-1"
        >
          LinkedIn
        </a>
      </p>
    </footer>
  );
};

export default Footer;
