import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Page",
  description: "A modern blog platform for sharing ideas and articles.",
};

export default function Home() {
  return (
    <div className="flex items-center gap-[100px]">
      <div className="flex flex-1 flex-col gap-[40px]">
        <h1 className="text-[72px] md:text-[52px] font-bold bg-gradient-to-b from-[#194c33] to-[#bbb] bg-clip-text text-transparent">
          Welcome to My Blog App!
        </h1>
        <p className="font-light text-[24px] text-muted-foreground">
          Turning ideas into Reality. Ability to work together with teams from
          various global tech industry.
        </p>
      </div>

      <div className="relative flex-1 hidden md:block h-[500px]">
        <Image
          src="https://images.unsplash.com/photo-1681164315014-06bf36b2597a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAzfHxvZmZpY2UlMjB3b3JrfGVufDB8fDB8fHww"
          alt="Ab"
          fill
          className="w-full object-contain animate-[move_3s_ease_infinite_alternate]"
        />
      </div>
    </div>
  );
}
