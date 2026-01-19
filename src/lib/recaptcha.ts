declare global {
  interface Window {
    grecaptcha: {
      enterprise: {
        ready: (callback: () => void) => void;
        execute: (
          siteKey: string,
          options: { action: string }
        ) => Promise<string>;
      }
    };
  }
}

export function isRecaptchaEnabled(): boolean {
  return !!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
}

export async function executeRecaptcha(action: string): Promise<string | null> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey) {
    return null;
  }

  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.grecaptcha || !window.grecaptcha.enterprise) {
      reject(new Error('reCAPTCHA not loaded'));
      return;
    }

    window.grecaptcha.enterprise.ready(() => {
      window.grecaptcha.enterprise
        .execute(siteKey, { action })
        .then(resolve)
        .catch(reject);
    });
  });
}

export async function verifyRecaptcha(token: string | null): Promise<boolean> {
  if (!token) {
    return true;
  }

  try {
    const response = await fetch('/api/recaptcha/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    return data.success === true;
  } catch {
    return false;
  }
}
