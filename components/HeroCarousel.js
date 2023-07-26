import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HeroCarousel = () => {
  const settings = {
    dots: true, // Muestra los puntos de navegación
    infinite: true, // Bucle infinito
    speed: 500, // Velocidad de la transición
    slidesToShow: 1, // Número de elementos visibles a la vez
    slidesToScroll: 1, // Número de elementos a desplazar por vez
    autoplay: true, // Habilita el autoplay
    autoplaySpeed: 3000,
  };

  return (
    <div className="w-screen relative mb-20 z-10 ">
      <Slider {...settings}>
        <div>
          <img
            src="/img/banner2.png"
            alt="Imagen 1"
            className="w-full carousel__item"
            // style={{ height: "89vh" }}
          />
        </div>

        <div>
          <img
            src="/img/banner1.png"
            alt="Imagen 2"
            className="w-full carousel__item"
            // style={{ height: "89vh" }}
          />
        </div>

        <div>
          <img
            src="/img/banner3.png"
            alt="Imagen 2"
            className="w-full carousel__item"
            // style={{ height: "89vh" }}
          />
        </div>
      </Slider>
    </div>
  );
};

export default HeroCarousel;
