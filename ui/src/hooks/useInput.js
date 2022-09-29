import { useState } from 'react';

export default function useInput(initialValue = {}) {
  const [inputs, setInputs] = useState(initialValue);
  const handleInputChange = e => {
    if (e.target) {
      return setInputs({ ...inputs, [e.target.name]: e.target.value });
    }

    return setInputs({ ...inputs, ...e });
  };
  return {
    inputs,
    handleInputChange,
    setInputs,
  };
}
