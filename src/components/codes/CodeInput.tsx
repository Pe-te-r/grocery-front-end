import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { X, Clock, Mail, RotateCw, Check } from 'lucide-react';
import { useSendMailCode, useVerifyMailCode, useVerifyTotp } from '@/hooks/authHook';
import { getUserEmailHelper } from '@/lib/authHelper';
import toast from 'react-hot-toast';

interface CodeInputProps {
  type: 'code' | 'otp';
  onVerify: (isValid: boolean) => void;
}

export const CodeInput = ({ type, onVerify }: CodeInputProps) => {
  console.log('type',type)
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isSending, setIsSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const getCodeMutate = useSendMailCode();
  const verifyCodeMutate = useVerifyMailCode();
  const verifyTotpMutate = useVerifyTotp()

  // Handle cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const getCodeToEmail = (email: string) => {
    if (isSending || cooldown > 0) return;

    setIsSending(true);
    getCodeMutate.mutate(email, {
      onSuccess: (data) => {
        if (data.status === 'success') {
          toast.success(data.message);
          setCooldown(60); // Start 60-second cooldown
        } else {
          toast.error(data?.message || 'Failed to send code');
        }
      },
      onError: () => {
        toast.error('Failed to send code');
      },
      onSettled: () => {
        setIsSending(false);
      }
    });
  };

  const verifyCode = (code: string) => {
    if (type === 'code') {
      verifyCodeMutate.mutate(code, {
        onSuccess: (data) => {
          if (data.status === 'success') {
            toast.success(data.message);
            onVerify(true);
          } else {
            toast.error(data?.message || 'Verification failed');
            onVerify(false);
          }
        }
      });
    } else {
      console.log('submiting')
      verifyTotpMutate.mutate(code, {
        onSuccess: (data) => {
          console.log('otp data', data)
          if (data.status === 'success') {
            toast.success(data.message);
            onVerify(true);
          } else {
            toast.error(data?.message || 'Verification failed');
            onVerify(false);
          }
        },
        onError: (error) => {
          console.error('error', error)
        }
      })
      console.log('OTP to verify:', code);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when 6 digits are entered (for code only)
    if (newDigits.every(d => d) && newDigits.join('').length === 6) {
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
    const pasteData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newDigits = [...digits];
      for (let i = 0; i < pasteData.length; i++) {
        if (i < 6) newDigits[i] = pasteData[i];
      }
      setDigits(newDigits);
      if (pasteData.length === 6) {
        verifyCode(pasteData);
      } else if (pasteData.length < 6) {
        inputRefs.current[pasteData.length]?.focus();
      }
    }
  };

  const clearAll = () => {
    setDigits(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="max-w-md mx-aut  p-10 bg-white rounded-xl shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {type === 'code' ? 'Email Verification' : 'Authenticator OTP'}
      </h3>
      <p className="text-gray-600 mb-6">
        {type === 'code'
          ? 'Enter the 6-digit code sent to your email'
          : 'Enter the 6-digit code from your authenticator app'}
      </p>

      <div className="flex  items-center justify-center space-x-3 mb-8 ">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={el => {
              inputRefs.current[index] = el;
            }}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-14 h-14 border-2 m-1 border-gray-300 rounded-lg text-3xl text-center focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
          />
        ))}
      </div>

      <div className="flex justify-between  items-center">
        <div className="flex space-x-3">
          <button
            onClick={clearAll}
            className="px-3 py-2 text-gray-600 hover:text-gray-800 flex items-center transition-colors"
          >
            <X size={18} className="mr-1" />
            Clear
          </button>

          {type === 'code' && (
            <button
              onClick={() => getCodeToEmail(getUserEmailHelper() ?? '')}
              disabled={isSending || cooldown > 0}
              className="px-3 py-2 text-green-600 hover:text-green-800 flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <RotateCw size={18} className="mr-1 animate-spin" />
              ) : (
                <Mail size={18} className="mr-1" />
              )}
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Request Code'}
            </button>
          )}

          {type === 'otp' && (
            <button
              onClick={() => verifyCode(digits.join(''))}
              disabled={!digits.every(d => d)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Check size={18} className="mr-1" />
              Verify
            </button>
          )}
        </div>

        {digits.every(d => d) && type === 'code' && isSending && (
          <div className="flex items-center text-gray-500">
            <Clock size={18} className="mr-1 animate-pulse" />
            Verifying...
          </div>
        )}
      </div>
    </div>
  );
};