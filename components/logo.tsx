import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { icon: 48, text: "text-lg font-semibold" },
  md: { icon: 60, text: "text-xl font-bold" },
  lg: { icon: 72, text: "text-2xl font-bold" },
};

export function Logo({ className = "", showText = true, size = "sm" }: LogoProps) {
  const s = sizeMap[size];
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="/logo.gif"
        alt="WallProud Logo"
        width={s.icon}
        height={s.icon}
        className="object-contain"
        unoptimized // Required to keep GIF animation working properly in Next.js Image
      />
      {showText && (
        <span className={`${s.text} font-display tracking-tight text-ink`}>
          WallProud
        </span>
      )}
    </Link>
  );
}
