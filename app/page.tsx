"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import io from "socket.io-client";
const socket = io("http://localhost:3001", {
  transports: ["websocket"],
});
export default function Home() {
  const [isLoading, setLoading] = useState(false);
  const [waitingAuth, setAuth] = useState<"waiting" | "logined" | "nologin">(
    "nologin"
  );
  const [remainingTime, setRemainingTime] = useState(150);
  const [countdownCompleted, setCountdownCompleted] = useState(false);

  async function sendPerm() {
    setLoading(true);
    await fetch("/api/sendNotification", { method: "GET" })
      .then((res) => {
        setAuth("waiting");
      })
      .catch((err) => console.log("Err: ", err));
    setLoading(false);
  }
  useEffect(() => {
    // Listen for incoming messages
    socket.on("authenticated", (response) => {
      const res = JSON.parse(response)
      console.log("Response: ",res.authed)
      if (res.authed) return setAuth("logined");
      else return setAuth("nologin");
    });
  }, []);

  useEffect(() => {
    if (waitingAuth === "logined" || waitingAuth === "nologin") return;

    const countdownInterval = setInterval(() => {
      setRemainingTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [waitingAuth]);
  useEffect(() => {
    if (remainingTime === 0) {
      setCountdownCompleted(true);
    }
  }, [remainingTime]);

  const progressValue = Math.max(0, Math.min(100, (remainingTime / 150) * 100));
  return (
    <div>
      <div className="transition-all flex flex-col space-y-3 justify-center items-center">
        {waitingAuth !== "logined" && (
          <h1 className="text-4xl font-semibold p-4">Giriş Yap</h1>
        )}

        {waitingAuth === "nologin" && (
          <>
            <div className="gap-4 flex flex-col">
              <div className="gap-2 flex flex-col">
                <h4>Kullanıcı Adı</h4>
                <input
                  placeholder="Kullanıcı adınız"
                  className="w-96 p-3 rounded-2xl bg-gray-200 outline-none"
                  type="text"
                />
              </div>
              <div className="gap-2 flex flex-col">
                <h4>Parola</h4>
                <input
                  placeholder="Parolanız"
                  className="w-96 p-3 rounded-2xl bg-gray-200 outline-none"
                  type="password"
                />
              </div>
            </div>
            <div>
              <button
                disabled={isLoading}
                onClick={sendPerm}
                className="disabled:opacity-50  transition-opacity bg-black text-white p-4 w-96 h-12 rounded-2xl font-medium m-4 flex flex-row justify-center items-center"
              >
                {isLoading ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="animate-spin w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                ) : (
                  "Giriş Yap"
                )}
              </button>
            </div>
          </>
        )}

        {waitingAuth === "waiting" && (
          <>
            <div className="bg-gray-100 rounded-2xl p-4">
              <div className="flex flex-col justify-center items-center mt-10">
                <h2 className="text-2xl font-semibold ">Erişim Bekleniyor</h2>
                <h2 className="text-md">
                  Devam etmek için cihaz bildirimlerinizi kontrol ediniz
                </h2>
              </div>
              <div className="flex flex-col gap-y-2">
                <div className="m-4 mt-10">
                  <h3 className="text-lg">Cihaz: SM-A71</h3>
                  <h6 className="text-lg">
                    Devam etmek için cihazınıza gelen bildirimi onaylayın veya
                    mobil uygulama üzerinden yetkilendirin
                  </h6>
                </div>
                <div>
                  <div className="w-full justify-center items-center flex flex-col space-y-10 rounded-full ">
                    <div className="w-36 h-36 flex flex-col justify-center items-center">
                      <p className="mb-4">Kalan Süre</p>
                      <CircularProgressbar
                        styles={{ text: { fontSize: 12 } }}
                        value={progressValue}
                        text={`${remainingTime} saniye`}
                      />
                    </div>

                    {countdownCompleted ? (
                      <button
                        onClick={() => {
                          setRemainingTime(150);
                          setCountdownCompleted(false);
                        }}
                        className="text-white transition-opacity bg-black/50 p-4 w-48 h-12 rounded-2xl font-medium m-4 flex flex-row justify-center items-center"
                      >
                        Yeniden gönder
                      </button>
                    ) : (
                      <button className="disabled:opacity-50 transition-opacity bg-black text-white p-4 w-48 h-12 rounded-2xl font-medium m-4 flex flex-row justify-center items-center">
                        İşlemi iptal et
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {waitingAuth === "logined" && (
          <>
            <div className="p-10 flex items-center justify-center flex-col space-y-4">
              <h1 className="font-bold text-4xl">Hoşgeldiniz</h1>
              <h3 className="text-xl">Giriş Yapan kullanıcı: GRKN</h3>

              <button className="disabled:opacity-50 transition-opacity bg-black text-white p-4 w-48 h-12 rounded-2xl font-medium m-4 flex flex-row justify-center items-center">
                Çıkış Yap
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
