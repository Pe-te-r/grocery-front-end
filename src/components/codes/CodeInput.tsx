import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import {  X, Clock } from 'lucide-react';

interface CodeInputProps {
  type: 'code' | 'otp';
  onVerify: (isValid: boolean) => void;
}

export const CodeInput = ({ type, onVerify }: CodeInputProps) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 4);
  }, []);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newDigits.every(digit => digit) && newDigits.join('').length === 4) {
      verifyCode(newDigits.join(''));
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').slice(0, 4);
    if (/^\d+$/.test(pasteData)) {
      const newDigits = [...digits];
      for (let i = 0; i < pasteData.length; i++) {
        if (i < 4) {
          newDigits[i] = pasteData[i];
        }
      }
      setDigits(newDigits);
      if (pasteData.length === 4) {
        verifyCode(pasteData);
      } else if (pasteData.length < 4) {
        inputRefs.current[pasteData.length]?.focus();
      }
    }
  };

  const verifyCode = (code: string) => {
    const validCodes = {
      code: '1234',
      otp: '5678',
    };

    setTimeout(() => {
      const isValid = code === validCodes[type];
      onVerify(isValid);
    }, 500);
  };

  const clearAll = () => {
    setDigits(['', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">
        {type === 'code' ? 'Verification Code' : 'One-Time Password'}
      </h3>
      <p className="text-gray-600 mb-6">Enter the 4-digit {type === 'code' ? 'code' : 'OTP'}</p>

      <div className="flex items-center justify-center space-x-3 mb-6">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={el => {
              inputRefs.current[index] = el;
            }}
            type="text"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-16 h-16 border-2 border-gray-300 rounded-lg text-3xl text-center focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
          />
        ))}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={clearAll}
          className="text-green-600 hover:text-green-800 flex items-center transition-colors"
        >
          <X size={16} className="mr-1" />
          Clear
        </button>

        {digits.every(d => d) && (
          <div className="flex items-center text-gray-500">
            <Clock size={16} className="mr-1 animate-pulse" />
            Verifying...
          </div>
        )}
      </div>
    </div>
  );
};