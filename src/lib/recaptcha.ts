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

export async function executeRecaptcha(action: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.grecaptcha || !window.grecaptcha.enterprise) {
      reject(new Error('reCAPTCHA not loaded'));
      return;
    }

    window.grecaptcha.enterprise.ready(() => {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      if (!siteKey) {
        reject(new Error('reCAPTCHA site key not configured'));
        return;
      }

      window.grecaptcha.enterprise
        .execute(siteKey, { action })
        .then(resolve)
        .catch(reject);
    });
  });
}

export async function verifyRecaptcha(token: string): Promise<boolean> {
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
