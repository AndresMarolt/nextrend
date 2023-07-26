import React from "react";

const CheckoutWizard = ({ activeStep = 0 }) => {
  return (
    <div className="mb-5 flex flex-wrap w-full">
      {["Datos de envío", "Método de pago", "Confirmar compra"].map(
        (step, index) => {
          return (
            <div
              key={step}
              className={`flex-1 border-b-2 text-center ${
                index + 1 <= activeStep
                  ? "border-black text-black"
                  : "border-gray-400 text-gray-400"
              }`}
            >
              {step}
            </div>
          );
        }
      )}
    </div>
  );
};

export default CheckoutWizard;
