import React, { useEffect, useState, useRef } from "react";

// Single-file React component. Uses Tailwind classes for styling (no imports required).
// Default export a React component — drop into a React app or a CodeSandbox to preview.

export default function BirthdaySite() {
  // target date (midnight at start of 28 Nov 2025 local time)
  const target = new Date("2025-11-28T00:00:00");

  const [now, setNow] = useState(new Date());
  const [stage, setStage] = useState("countdown"); // countdown -> arrived -> celebrate -> message -> slideshow -> gift
  const [showCake, setShowCake] = useState(false);
  const [candlesOut, setCandlesOut] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [images, setImages] = useState([]);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const slideshowTimer = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (now >= target && stage === "countdown") {
      setStage("arrived");
      // small delay before showing arrival animation
      setTimeout(() => setShowCake(true), 1200);
    }
  }, [now, target, stage]);

  useEffect(() => {
    if (stage === "slideshow" && images.length > 0) {
      slideshowTimer.current = setInterval(() => {
        setSlideshowIndex((i) => (i + 1) % images.length);
      }, 3000);
      return () => clearInterval(slideshowTimer.current);
    }
    return () => {};
  }, [stage, images]);

  function timeLeft() {
    const diff = Math.max(0, target - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  }

  function handleCelebrateClick() {
    setStage("celebrate");
    setTimeout(() => setShowCake(true), 500);
  }

  function handleBlowCandles() {
    setCandlesOut(true);
    setTimeout(() => setStage("message"), 1200);
  }

  function handleImagesUpload(e) {
    const files = Array.from(e.target.files).slice(0, 20);
    const urls = files.map((f) => ({ url: URL.createObjectURL(f), name: f.name }));
    setImages(urls);
    setSlideshowIndex(0);
  }

  function startSlideshow() {
    if (images.length > 0) setStage("slideshow");
  }

  function openGift() {
    setStage("gift");
  }

  // small helpers for rendering
  const { days, hours, minutes, seconds } = timeLeft();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-pink-100 text-gray-800 p-6">
      <style>{`
        .balloon { animation: floatUp 6s infinite ease-in-out; }
        @keyframes floatUp { 0% { transform: translateY(0) } 50% { transform: translateY(-18px)} 100% { transform: translateY(0) } }
        .confetti { animation: confettiFall 2s forwards; }
        @keyframes confettiFall { to { transform: translateY(400px); opacity: 0 } }
        .sparkle { animation: sparkle 1.2s infinite; }
        @keyframes sparkle { 0% { opacity: 0.2; transform: scale(0.98)} 50% { opacity: 1; transform: scale(1.03)} 100% { opacity: 0.2; transform: scale(0.98)} }
      `}</style>

      <div className="max-w-4xl w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-10">
        {/* Skip Countdown Preview */}
        <div className="mb-4 text-right">
          <button onClick={() => setStage("arrived")} className="px-3 py-1 text-xs rounded-full bg-pink-200 text-pink-700 shadow hover:scale-105 transition">Skip Countdown (Preview Birthday Mode)</button>
        </div>

        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold">Happy Birthday — <span className="text-pink-600">Name</span></h1>
          <div className="text-sm text-gray-600">From <span className="font-medium">YourName</span></div>
        </header>

        {/* Main content area */}
        <main>
          {stage === "countdown" && (
            <section className="text-center py-12">
              <p className="mb-4 text-lg">Counting down to</p>
              <div className="mb-4 text-xl font-medium">28 November 2025</div>

              <div className="inline-flex gap-3 bg-pink-50/60 p-4 rounded-xl shadow-sm">
                <div className="text-center px-3">
                  <div className="text-3xl font-bold">{String(days).padStart(2, "0")}</div>
                  <div className="text-xs text-gray-500">Days</div>
                </div>
                <div className="text-center px-3">
                  <div className="text-3xl font-bold">{String(hours).padStart(2, "0")}</div>
                  <div className="text-xs text-gray-500">Hours</div>
                </div>
                <div className="text-center px-3">
                  <div className="text-3xl font-bold">{String(minutes).padStart(2, "0")}</div>
                  <div className="text-xs text-gray-500">Minutes</div>
                </div>
                <div className="text-center px-3">
                  <div className="text-3xl font-bold">{String(seconds).padStart(2, "0")}</div>
                  <div className="text-xs text-gray-500">Seconds</div>
                </div>
              </div>

              <p className="mt-6 text-sm text-gray-500">(When the countdown reaches zero the celebration will begin automatically.)</p>

              <div className="mt-6">
                <button
                  onClick={() => setStage(now >= target ? "arrived" : "countdown")}
                  className="px-6 py-2 rounded-full bg-pink-500 text-white shadow hover:scale-105 transform transition"
                >
                  Jump to date
                </button>
              </div>
            </section>
          )}

          {(stage === "arrived" || stage === "celebrate") && (
            <section className="relative text-center py-8">
              {/* Balloons */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="hidden md:block">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className={`absolute w-12 h-16 rounded-full bg-pink-300/90 balloon`} 
                      style={{ left: `${8 + i * 11}%`, bottom: `${-10 + (i % 3) * 8}%`, transform: `rotate(${(i % 3) * 10}deg)` }}
                    />
                  ))}
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-2">It’s 28th November 2025 🎉</h2>
              <p className="text-gray-600 mb-6">Tap to celebrate — balloons, cake and surprises await.</p>

              <button onClick={handleCelebrateClick} className="px-6 py-2 rounded-full bg-pink-600 text-white shadow hover:scale-105 transform transition">
                It’s 28th November 2025 — Tap to Celebrate!
              </button>

              {/* subtle confetti */}
              {showCake && (
                <div className="mt-6">
                  <div className="inline-block p-6 bg-white rounded-xl shadow-md">
                    <div className="text-sm text-gray-500 mb-3">Celebration starting...</div>
                    <div className="text-2xl">🎈🎉</div>
                  </div>
                </div>
              )}
            </section>
          )}

          {stage === "celebrate" && (
            <section className="text-center py-10">
              <div className="flex flex-col items-center gap-4">
                {/* Cake */}
                <div className="relative w-56 h-48 flex items-end justify-center">
                  <div className="w-56 h-32 bg-pink-100 rounded-2xl shadow-inner border-t-2 border-pink-200"></div>
                  <div className="absolute -top-6 w-40 h-10 bg-pink-200 rounded-full shadow-md"></div>
                  {/* candles */}
                  <div className="absolute -top-10 flex gap-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="w-1 h-6 bg-yellow-300 rounded-sm"></div>
                        <div className={`w-3 h-3 rounded-full ${candlesOut ? "bg-gray-400" : "bg-yellow-400"} ${candlesOut ? "opacity-40" : "sparkle"}`} />
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={handleBlowCandles} className="mt-4 px-6 py-2 rounded-full bg-white border border-pink-300 shadow hover:scale-105 transform transition">
                  Blow the candles
                </button>

                <div className="text-sm text-gray-500 mt-2">(Click to blow out & reveal the first surprise)</div>
              </div>
            </section>
          )}

          {stage === "message" && (
            <section className="py-6">
              <div className="bg-pink-50 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Surprise — write your message</h3>
                <p className="text-sm text-gray-600 mb-3">Type your heartfelt message below. You can edit it anytime.</p>
                <textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Write your birthday message here..."
                  className="w-full h-40 p-3 rounded-md border border-pink-200 bg-white resize-none"
                />

                <div className="mt-4 flex gap-3">
                  <button onClick={() => setStage("slideshow")} className="px-4 py-2 rounded-md bg-pink-500 text-white">Save & View Slideshow</button>
                  <label className="px-4 py-2 rounded-md bg-white border border-pink-200 cursor-pointer">
                    Upload Photos
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImagesUpload} />
                  </label>
                  <button onClick={() => setStage("gift")} className="px-4 py-2 rounded-md bg-white border border-pink-200">Skip to Gift</button>
                </div>
              </div>
            </section>
          )}

          {stage === "slideshow" && (
            <section className="py-6">
              <div className="rounded-xl overflow-hidden shadow-md">
                <div className="bg-white p-6">
                  <h3 className="text-xl font-semibold mb-3">Memory Lane — Slideshow</h3>
                  {images.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">No photos added yet. Upload images or go back to write message.</div>
                  ) : (
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="w-full md:w-2/3 h-64 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                        <img src={images[slideshowIndex].url} alt={images[slideshowIndex].name} className="object-cover w-full h-full" />
                      </div>
                      <div className="w-full md:w-1/3">
                        <div className="mb-4">
                          <div className="text-sm text-gray-500">Caption (optional)</div>
                          <div className="text-lg font-medium mt-2">{images[slideshowIndex].name}</div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setSlideshowIndex((i) => Math.max(0, i - 1))} className="px-3 py-1 rounded bg-white border">Prev</button>
                          <button onClick={() => setSlideshowIndex((i) => (i + 1) % images.length)} className="px-3 py-1 rounded bg-white border">Next</button>
                          <button onClick={() => setStage("gift")} className="ml-auto px-3 py-1 rounded bg-pink-500 text-white">Next Surprise</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {stage === "gift" && (
            <section className="py-6 text-center">
              <div className="p-6 rounded-xl bg-gradient-to-br from-pink-50 to-white shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">Final Surprise</h3>
                <p className="text-gray-600 mb-4">Tap the gift box to open your present.</p>

                <div className="flex items-center justify-center">
                  <button onClick={openGift} className="relative w-44 h-44 rounded-lg shadow-lg bg-pink-200 flex items-center justify-center transform hover:scale-105 transition">
                    <div className="absolute -top-6 text-6xl">🎁</div>
                    <div className="text-sm mt-24">Open Gift</div>
                  </button>
                </div>

                <div className="mt-6 text-sm text-gray-600">After opening, a special downloadable keepsake will appear.</div>

                {/* When gift stage activated, show content */}
                {stage === "gift" && (
                  <div className="mt-6">
                    <div className="p-4 bg-white rounded-lg shadow-inner">
                      <h4 className="font-medium">Your Digital Gift</h4>
                      <p className="text-sm text-gray-600 mb-3">(Replace this with your actual gift — e.g., a PDF, portrait, video link.)</p>
                      <a
                        className="inline-block px-4 py-2 bg-pink-600 text-white rounded-full"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          alert("Pretend download opened — replace this link with your real gift file URL.");
                        }}
                      >
                        Download Keepsake
                      </a>
                    </div>

                    <div className="mt-6">
                      <h5 className="font-semibold">Final Message</h5>
                      <p className="text-gray-700 mt-2 whitespace-pre-line">{userMessage || "Happy Birthday, Name!\nYou are loved."}</p>

                      <div className="mt-6">
                        <button onClick={() => setStage("countdown")} className="px-4 py-2 rounded-md bg-white border">Replay</button>
                        <button onClick={() => alert('You can now deploy this site or export the code.')} className="ml-3 px-4 py-2 rounded-md bg-pink-500 text-white">Deploy / Export</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </main>

        {/* footer */}
        <footer className="mt-6 text-center text-xs text-gray-500">Made with ❤️ for <span className="text-pink-500 font-medium">Name</span></footer>
      </div>
    </div>
  );
}
