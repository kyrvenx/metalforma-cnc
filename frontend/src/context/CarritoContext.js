import React, { createContext, useContext, useMemo, useState } from 'react';

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const agregarItem = (producto) => {
    setItems((itemsActuales) => {
      const existe = itemsActuales.find((item) => item.id === producto.id);

      if (existe) {
        return itemsActuales.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...itemsActuales, { ...producto, cantidad: 1 }];
    });
  };

  const quitarItem = (id) => {
    setItems((itemsActuales) =>
      itemsActuales
        .map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const vaciarCarrito = () => setItems([]);

  const cantidadTotal = useMemo(
    () => items.reduce((total, item) => total + item.cantidad, 0),
    [items]
  );

  return (
    <CarritoContext.Provider
      value={{ items, agregarItem, quitarItem, vaciarCarrito, cantidadTotal }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => useContext(CarritoContext);
