import React, { useState, useEffect, useContext } from 'react';
import { useShoppingCart } from '@/hooks/use-shopping-cart';
import { useLocalStorageReducer } from '@/hooks/use-local-storage-reducer';
import { Kushki } from '@kushki/js';
import { formatCurrency } from '@/lib/utils';

const PaymentForm = () => {
  
  const [cardNumber, setCardNumber] = useState('');
  const [cvc, setCvc] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const { totalPrice, addPayment } = useShoppingCart();
  const [token, setToken] = useState('');

  
  const handleCardNumberChange = (e) => {
    const { value } = e.target;
    // Remover espacios en blanco y limitar a un máximo de 16 dígitos
    const formattedValue = value.replace(/\s/g, '').slice(0, 16);
    setCardNumber(formattedValue);
  };


  const handleCvcChange = (e) => {
    const { value } = e.target;
    // Limitar a un máximo de 4 dígitos
    const formattedValue = value.slice(0, 4);
    setCvc(formattedValue);
  };

  const handleExpiryChange = (e) => {
    const { value } = e.target;
    // Remover espacios en blanco y limitar a un máximo de 4 dígitos
    const formattedValue = value.replace(/\s/g, '').slice(0, 4);
    // Agregar espacios cada dos dígitos
    const formattedExpiry = formattedValue.replace(/(\d{2})/g, '$1');
    setExpiry(formattedExpiry);
  };

  const handleCardHolderNameChange = (e) => {
    const { value } = e.target;
    // Permitir solo letras y espacios entre las letras
    const formattedValue = value.replace(/[^a-zA-Z\s]/g, '');
    setCardHolderName(formattedValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para enviar los datos del formulario
    console.log(process.env)
    var kushki = new Kushki({
      merchantId: process.env.PUBLIC_MERCHANT_ID, 
      inTestEnvironment: true,
      regional:false
    });
    var callback = function(response) {
      if(!response.code){
        console.log("response");
        console.log(response);
        setToken(response.token)
      } else {
        console.error('Error: ',response.error, 'Code: ', response.code, 'Message: ',response.message);
      }
    }
    setCardNumber("");
    setCvc("");
    setExpiry("");
    setCardHolderName("");

    kushki.requestToken({
      amount: formatCurrency(totalPrice).replace("$", ""),
      currency: "USD",
      card: {
        name: cardHolderName,
        number: cardNumber,
        cvc: cvc,
        expiryMonth: expiry[0]+expiry[1],
        expiryYear: expiry[2]+expiry[3]
    },
    }, callback);

    
  };

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  
  useEffect(async () => {
    const fetchData = async () => {
      try {
        const options = {
          method: 'POST',
          body: '{"token":"'+token+'","amount":{"currency":"USD","subtotalIva":0,"subtotalIva0":'+formatCurrency(totalPrice).replace("$", "")+',"iva":0,"ice":0,"extraTaxes":{"iac":0,"tasaAeroportuaria":0,"agenciaDeViaje":0}},"metadata":{"key0":"value0","key1":"value1","key2":"value2"},"fullResponse":"v2"}'
        };
        const response = await fetch("/api/webhook", options);
        const jsonData = await response.json();
        setData(jsonData);
        addPayment(response)
        
        window.location = "/success"
      } catch (error) {
        setError(error);
      }
    };
    if(token){
      await fetchData();
    }
  }, [token]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <form className="grid grid-cols-1 gap-4 max-w-md mx-auto p-6 border border-gray-300 rounded" onSubmit={handleSubmit}>
      <label className="grid gap-1">
        Nombre del titular:
        <input
          type="text"
          value={cardHolderName}
          onChange={handleCardHolderNameChange}
          pattern="[a-zA-Z\s]*"
          placeholder="Nombre Apellido"
          required
          className="p-2 border border-gray-300 rounded"
        />
      </label>
      
      <label className="grid gap-1">
        Número de tarjeta:
        <input
          type="text"
          value={cardNumber}
          onChange={handleCardNumberChange}
          placeholder="0000 0000 0000 0000"
          required
          className="p-2 border border-gray-300 rounded"
        />
      </label>
      
      <label className="grid gap-1">
        Fecha de expiración:
        <input
          type="text"
          value={expiry}
          onChange={handleExpiryChange}
          maxLength={5}
          placeholder="MM/YY"
          required
          className="p-2 border border-gray-300 rounded"
        />
      </label>
      
      <label className="grid gap-1">
        CVC:
        <input
          type="text"
          value={cvc}
          onChange={handleCvcChange}
          maxLength={4}
          pattern="\d{3,4}"
          placeholder="123"
          required
          className="p-2 border border-gray-300 rounded"
        />
      </label>
      
      <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded" >
        Pagar {formatCurrency(totalPrice)}
      </button>
    </form>
  );
};



export default PaymentForm;