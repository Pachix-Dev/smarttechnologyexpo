import MarqueeModule from "react-fast-marquee";

const Marquee = MarqueeModule.default ?? MarqueeModule;

export function MarqueeBanners({ listBanners }) {
  return (
    <div className="w-full">
      <Marquee
        speed={65}
        gradient={true}
        gradientColor={[255, 255, 255]}
        pauseOnHover={true}

      >
        {listBanners.map((banner, index) => (
          <div
            key={index}
            className="mx-4 w-[300px] sm:w-[700px] shrink-0"
          >
            <a href={banner.href} target="_blank" rel="noopener noreferrer">
              <img
                src={banner.src}
                alt={banner.alt}
                className="h-auto w-full object-contain"
              />
            </a>
          </div>
        ))}
      </Marquee>
    </div>
  );
}
