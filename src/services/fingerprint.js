import Fingerprint2 from "fingerprintjs2";

let fingerprint = null;

const FINGERPRINT_OPTIONS = {
  exclude: {
    userAgent: true,
    sessionStorage: true,
    localStorage: true,
    indexedDb: true,
    addBehavior: true,
    openDatabase: true,
    doNotTrack: true,
    plugins: true,
    canvas: true,
    webgl: true,
    adBlock: true,
    fonts: true,
    fontsFlash: true,
    audio: true,
    enumerateDevices: true,
  },
};

const generateFingerprint = () =>
  new Promise((resolve) => {
    const buildFingerprint = () => {
      Fingerprint2.get(FINGERPRINT_OPTIONS, (fingerprint) => {
        const fingerprintString = JSON.stringify(fingerprint);
        let hash = 0;
        for (let i = 0; i < fingerprintString.length; i++) {
          const chr = fingerprintString.charCodeAt(i);
          hash = (hash << 5) - hash + chr;
          hash |= 0; // Convert to 32bit integer
        }
        const base64Fingerprint = btoa(hash.toString());
        resolve(base64Fingerprint);
      });
    };

    if (window.requestIdleCallback) {
      requestIdleCallback(buildFingerprint);
    } else {
      setTimeout(buildFingerprint, 500);
    }
  });

export const initialiseFingerprint = async () => {
  fingerprint = await generateFingerprint();
  return fingerprint;
};

export const getFingerprint = () => fingerprint;
