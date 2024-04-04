import { Button } from "flowbite-react";
import React from "react";

const CalltoAction = () => {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl">
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-2xl">what want to learn about javascript?</h2>
        <p className="text-gray-500 my-2">
          Checkout these resources with 100 javascript projects
        </p>
        <Button
          gradientDuoTone="purpleToPink"
          className="rounded-tl-xl rounded-bl-none"
        >
          <a
            href="https://www.100jsprojects.com"
            target="_blank"
            rel="noopener noreferrer"
          />
          100 JavaScript Projects
        </Button>
      </div>
      <div className="p-7 flex-1 ">
        <img src="https://kinsta.com/wp-content/uploads/2022/01/tailwind-css.jpg" />
      </div>
    </div>
  );
};

export default CalltoAction;
