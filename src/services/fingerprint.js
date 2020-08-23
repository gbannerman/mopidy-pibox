import Fingerprint2 from "fingerprintjs2";
import axios from "axios";

let fingerprint = null;

const generateFingerprint = () =>
  new Promise((resolve) => {
    requestIdleCallback(() => {
      Fingerprint2.get(
        {
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
        },
        (fingerprint) => {
          const fingerprintString = JSON.stringify(fingerprint);
          let hash = 0;
          for (let i = 0; i < fingerprintString.length; i++) {
            const chr = fingerprintString.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0; // Convert to 32bit integer
          }
          const base64Fingerprint = Buffer.from(hash.toString()).toString(
            "base64"
          );
          resolve(base64Fingerprint);
        }
      );
    });
  });

export const initialiseFingerprint = async () => {
  fingerprint = await generateFingerprint();
  axios.defaults.headers.common["pibox-fingerprint"] = fingerprint;
  return fingerprint;
};

export const getFingerprint = () => fingerprint;
