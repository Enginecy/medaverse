import Image from "next/image";

import graphics from "public/login-graphics.png";
import logo from "public/meda_health_logo.png";

export function LoginGraphics() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 h-full w-full bg-primary">
      <div
        className="absolute z-10 hidden h-full flex-col items-start
          justify-between p-4 lg:p-8 md:flex"
      >
        <Image
          src={logo}
          alt="logo"
          className="brightness-0 invert"
          width={150}
          height={150}
        />
        <p
          className="text-2xl leading-tight font-bold text-white uppercase
            lg:text-4xl xl:text-8xl"
        >
          Financial freedom
          <br />
          awaits you
        </p>
      </div>
      <div className="relative h-full w-full">
        <Image
          src={graphics}
          alt="login-graphics"
          fill
          className="object-cover object-top"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/30
            to-black/60"
        />
      </div>
    </div>
  );
}
