import React from 'react';

const Header = () => {
  return (
    <header>
      <div className="holder header-contenido">
        <img
          src="/img/logo.png"
          alt="Logo de MetalForma CNC"
        />

        <div className="header-texto">
          <p className="marca-superior">
            FABRICACIÓN DE PRECISIÓN
          </p>

          <h1>MetalForma CNC</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
