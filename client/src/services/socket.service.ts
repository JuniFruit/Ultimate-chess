import ioClient from "../api/socketApi";


export const tryReconnect = () => {
    setTimeout(() => {
      ioClient.io.open((err) => {
        if (err) {
          tryReconnect();
        }
      });
    }, 2000);
  }