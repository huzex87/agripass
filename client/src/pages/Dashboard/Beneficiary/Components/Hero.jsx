import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function HeroCarousel() {
  const slides = [
    {
      id: 1,
      title: "Welcome to Our Platform",
      subtitle: "Discover amazing features and endless possibilities",
      image:
        "https://images.unsplash.com/photo-1544476866-ce192b63bd7f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwfHx8ZW58MHx8fHx8", // Add your image path
      cta: "Get Started",
    },
    {
      id: 2,
      title: "Built for Developers",
      subtitle: "Modern tools and seamless integration for your projects",
      image:
        "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=731&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Add your image path
      cta: "Learn More",
    },
    {
      id: 3,
      title: "Scale with Confidence",
      subtitle: "Enterprise-grade solutions that grow with your business",
      image:
        "https://plus.unsplash.com/premium_photo-1721861982256-3d4e155afd92?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEyfHx8ZW58MHx8fHx8", // Add your image path
      cta: "View Pricing",
    },
  ];

  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        effect="slide"
        fadeEffect={{ crossFade: true }}
        loop={true}
        className="h-[600px]" // Removed rounded-lg
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              {/* Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Dark Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 to-gray-950/80" />
              {/* Content */}
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center text-white px-4 max-w-4xl">
                  <h1 className="text-5xl md:text-6xl font-bold mb-6">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 opacity-90">
                    {slide.subtitle}
                  </p>
                  <button className="btn btn-lg bg-white text-gray-800 hover:bg-gray-100 border-none px-8">
                    {slide.cta}
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
