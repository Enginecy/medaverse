import Image from "next/image";

import graphics from "public/login-graphics.png";
import logo from "public/meda_health_logo.png";

 export function LoginGraphics() {
  return (
    <div className="bg-primary relative h-full w-1/2 rounded-lg">
      <div className="absolute z-10 flex h-full flex-col items-start justify-between p-8">
        <Image
          src={logo}
          alt="logo"
          className="brightness-0 invert"
          width={200}
          height={200}
        />
        <p
          className="text-light-blue-500 text-5xl"
          style={{ fontFamily: "Druk Wide Bold Bold" }}
        >
          Your Universe of Medical Insurance Solutions.
        </p>
      </div>
      <div className="relative h-full w-full">
        <Image
          src={graphics}
          alt="login-graphics"
          fill
          className="rounded-lg object-cover object-top"
        />
      </div>
    </div>
  );
}
