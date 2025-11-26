import React, { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
// import ScratchCard from "react-scratchcard-v2";


export default function BirthdaySite() {
  const target = new Date("2025-11-28T00:00:00");

  const [musicAllowed, setMusicAllowed] = useState(false);
  const bgMusicRef = useRef(null);
  const [now, setNow] = useState(new Date());
  const [stage, setStage] = useState("countdown");
  const [candlesOut, setCandlesOut] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [images, setImages] = useState([]);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const slideshowTimer = useRef(null);
   const slideshowImages = [ 
      "/IMG_1.png",
  "/IMG_2.jpeg",
  "/IMG_3.jpeg",
  "/IMG_4.jpg",
  "/IMG_5.jpg",
  "/IMG_6.jpeg",
  "/IMG_7.jpeg",
  "/IMG_8.jpeg",
  "/IMG_9.jpeg",
  "/IMG_10.jpeg",
  "/IMG_11.jpeg",
  "/IMG_13.png",
  "/IMG_14.png",
  "/IMG_15.png",
  "/IMG_16.png",
  "/IMG_17.png",
  "/IMG_19.png",
  "/IMG_20.png",
  "/IMG_21.png",
  "/IMG_22.png",
];
  const [selectedGift, setSelectedGift] = useState("");
  const [scratchCompleted, setScratchCompleted] = useState(false);

  <button onClick={() => setMusicAllowed(true)}>Enter</button>

  // Time updater
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Slideshow auto-rotate
 useEffect(() => {
  if (stage === "fullslideshow") {
    const timer = setInterval(() => {
      setSlideshowIndex((i) => (i + 1) % slideshowImages.length);
    }, 3000); // 3 seconds

    return () => clearInterval(timer);
  }
}, [stage, slideshowImages.length]);

// When user retries after scratch → show gift options page
useEffect(() => {
  const goToGiftOptions = () => setStage("giftOptions");
  window.addEventListener("gift-options", goToGiftOptions);
  return () => window.removeEventListener("gift-options", goToGiftOptions);
}, []);

  function timeLeft() {
    const diff = Math.max(0, target - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
    
  }

  const { days, hours, minutes, seconds } = timeLeft();


  // Confetti burst function
  function burst() {
    confetti({
      particleCount: 90,
      spread: 60,
      origin: { y: 0.4 },
    });
  }

  // Button actions
  function handleCelebrateClick() {
    burst();
    setStage("celebrate");
  }

  function handleBlowCandles() {
    burst();
    setCandlesOut(true);
    setTimeout(() => setStage("message"), 1600);
  }

  function SmoothScratchCard({ width, height, children }) {
  const canvasRef = React.useRef(null);
  const soundRef = React.useRef(null);
  const isDrawing = React.useRef(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Load scratch sound
    soundRef.current = new Audio("/scratch.mp3");
    soundRef.current.volume = 0.4;

    canvas.width = width;
    canvas.height = height;
    canvas.revealed = false;

    // ----- GOLDEN SCRATCH LAYER -----
    const drawCover = () => {
      ctx.globalCompositeOperation = "source-over";
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#FFD700");
      gradient.addColorStop(1, "#E5BB00");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      canvas.style.opacity = 1;
      canvas.style.pointerEvents = "auto";
    };

    drawCover();

    // ----- SCRATCHING -----
    const startDraw = () => {
      isDrawing.current = true;
      soundRef.current.play(); // play scratch sound
    };

    const stopDraw = () => {
      isDrawing.current = false;
      soundRef.current.pause();
      soundRef.current.currentTime = 0;
    };

    const draw = (x, y) => {
      if (!isDrawing.current) return;

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();

      checkReveal();
    };

    // ----- CHECK COMPLETION -----
    const checkReveal = () => {
      if (canvas.revealed) return;

      const pixels = ctx.getImageData(0, 0, width, height).data;
      let cleared = 0;

      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) cleared++;
      }

      const percent = (cleared / (width * height)) * 100;

      if (percent > 10) {
        canvas.revealed = true;

        // Confetti!
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.7 } });

        setTimeout(() => {
          alert("❌ Hard Luck ! Better luck next time...");

          const retry = window.confirm("Do you want to try again?");

          if (retry) {
           
            window.dispatchEvent(new CustomEvent("gift-options"));


          }
        }, 200);
      }
    };

    const handleMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
      const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
      draw(x, y);
    };

    // --- event listeners ---
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mouseup", stopDraw);
    canvas.addEventListener("mousemove", handleMove);

    canvas.addEventListener("touchstart", startDraw);
    canvas.addEventListener("touchend", stopDraw);
    canvas.addEventListener("touchmove", handleMove);

    return () => {
      canvas.removeEventListener("mousedown", startDraw);
      canvas.removeEventListener("mouseup", stopDraw);
      canvas.removeEventListener("mousemove", handleMove);

      canvas.removeEventListener("touchstart", startDraw);
      canvas.removeEventListener("touchend", stopDraw);
      canvas.removeEventListener("touchmove", handleMove);
    };
  }, []);

  return(
    <div
      className="relative"
      style={{ width, height }}
    >
      <div className="absolute inset-0 z-0 flex items-center justify-center rounded-xl overflow-hidden">
        {children}
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 rounded-xl shadow-xl"
        style={{ touchAction: "none" }}
      />
    </div>
  );
}


  function handleImagesUpload(e) {
    const files = Array.from(e.target.files).slice(0, 20);
    const urls = files.map((f) => ({ url: URL.createObjectURL(f), name: f.name }));
    setImages(urls);
    setSlideshowIndex(0);
  }

  function openGift() {
    burst();
    setStage("gift");
  }

  return (

     <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-rose-200 via-pink-100 to-amber-100 relative">
        
<div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 60 }).map((_, i) => (
      <div
        key={i}
        className="absolute animate-[float_7s_ease-in-out_infinite]"
        style={{
          top: `${Math.random() * 110}%`,
          left: `${Math.random() * 100}%`,
          fontSize: `${28 + Math.random() * 40}px`,
          opacity: 0.35,
        }}
      >
        {["💙","🎉","🎊","🎂","🥳"][Math.floor(Math.random() * 3)]}
      </div>
    ))}
  </div>

 

    {/* MAIN CARD */}
    <div className="relative h-full w-full bg-white/60 backdrop-blur-2xl shadow-2xl rounded-3xl p-10 border border-pink-300">
     

      {/* Floating Hearts Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-300 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${20 + Math.random() * 30}px`,
              opacity: 0.3,
            }}
          >
            {["💖","🎉","🎈"][Math.floor(Math.random() * 3)]}
      </div>
        ))}
      </div>
     
     

      {/* Cake + Candle CSS */}
      <style>{`
        .cake-wrapper {
  position: relative;
  width: 260px;
  margin: 0 auto;
}

.cake-plate {
  width: 300px;
  height: 30px;
  background: radial-gradient(circle, #ffd6e8, #f7a1c6);
  border-radius: 50%;
  margin: 0 auto;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.cake-body {
  width: 260px;
  height: 150px;
  background: linear-gradient(to bottom, #fff8f0, #ffe8d9);
  border-radius: 20px 20px 12px 12px;
  position: relative;
  margin-top: -10px;
  box-shadow: inset 0 0 15px rgba(255, 230, 200, 0.6);
}

.frosting {
  width: 260px;
  height: 70px;
  background: linear-gradient(to bottom, #ffb6d5, #ff8cbc);
  border-radius: 20px 20px 0 0;
  position: absolute;
  top: -65px;
  box-shadow: inset 0 -10px 20px rgba(255, 170, 207, 0.5);
}

.drip {
  width: 32px;
  height: 60px;
  background: #ff8cbc;
  border-radius: 20px;
  position: absolute;
}

.drip.one { left: 30px; top: -10px; height: 50px; }
.drip.two { left: 110px; top: -15px; height: 60px; }
.drip.three { left: 190px; top: -8px; height: 45px; }

/* ----- Candles ----- */

.candle {
  width: 16px;
  height: 55px;
  background: linear-gradient(to bottom, #ffffff, #ffe3f1);
  border-radius: 6px;
  margin: 0 8px;
  position: relative;
  box-shadow: 0 0 3px rgba(255, 150, 200, 0.5);
}

.candle:before {
  content: "";
  width: 100%;
  height: 6px;
  background: #ff8cbc;
  position: absolute;
  bottom: 0;
  border-radius: 0 0 6px 6px;
}

/* Flame */
.flame {
  width: 16px;
  height: 22px;
  background: radial-gradient(circle, #fff5c0, #ffcf33);
  position: absolute;
  top: -22px;
  left: 0;
  border-radius: 50% 50% 60% 60%;
  animation: flameFlicker 0.25s infinite alternate ease-in-out;
  transform-origin: bottom center;
  filter: drop-shadow(0 0 6px #ffd673);
}

@keyframes flameFlicker {
  0% { transform: scale(1) rotate(-3deg); opacity: 1; }
  100% { transform: scale(1.15) rotate(3deg); opacity: 0.85; }
}

/* Smoke after blowing candles */
.smoke {
  width: 6px;
  height: 20px;
  background: linear-gradient(to top, gray, transparent);
  border-radius: 5px;
  position: absolute;
  top: -18px;
  left: 5px;
  animation: fadeSmoke 1.2s forwards;
}

@keyframes fadeSmoke {
  0% { opacity: 0.9; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-25px); }
}

       
      `}</style>

 

      
    



        {/* Header */}
        <h1 className="text-center text-3xl font-bold text-pink-600 mb-6">
          Happy Birthday — <span>Priyanshi</span> 🎉
        </h1>

        {/* ---------------- COUNTDOWN ---------------- */}
        {stage === "countdown" && (
          <div className="text-center">

            <p className="text-lg">Counting down to</p>
            <p className="text-2xl font-semibold mt-1">28 November 2025</p>
           
            <div className="flex justify-center gap-4 mt-5">
              <TimeBox label="Days" value={days} />
              <TimeBox label="Hours" value={hours} />
              <TimeBox label="Minutes" value={minutes} />
              <TimeBox label="Seconds" value={seconds} />
            </div>

            <button
              className="mt-8 px-6 py-2 bg-pink-500 text-white rounded-full shadow-lg hover:scale-105 transition"
              onClick={() => setStage("arrived")}
            >
              Jump to Date
            </button>
          </div>
        )}

        {/* ---------------- ARRIVED ---------------- */}
        {stage === "arrived" && (
          <div className="text-center">
            <h2 className="text-2xl font-bold">It’s 28th November 2025 🎉</h2>
            <p className="text-gray-600 mt-2">Tap to celebrate!</p>

            <button
              onClick={()=>{
              handleCelebrateClick();
               <audio src="/birthday.mp3" autoPlay loop />}}
              className="mt-6 px-6 py-2 bg-pink-600 text-white rounded-full shadow-lg hover:scale-105 transition"
            >
              Tap to Celebrate!
            </button>
          </div>
        )}



        {/* ---------------- CELEBRATE (CAKE) ---------------- */}
        {stage === "celebrate" && (
  <div className="text-center py-10 flex flex-col items-center gap-5px">

<div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-red-400 
            flex items-center justify-center text-white text-4xl font-bold 
            shadow-[0_0_20px_6px_rgba(255,100,150,0.6)] mb-4">
  20
</div>



{/* Candles BELOW the cake */}
    <div className="mt-4 flex justify-center gap-3">

      {[1, 2, 3, 4, 5, 6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map((c, index) => (
        <div key={index} className="relative">

          {/* Candle body */}
          <div className="w-[3px] h-[28px] bg-gradient-to-b from-red-400 to-red-600 rounded-md shadow-md"></div>

          {/* Flame or Smoke */}
          {!candlesOut ? (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 
                          w-[8px] h-[15px] rounded-full 
                          bg-orange-300 
                          animate-[flicker_0.25s_infinite_alternate]
                          shadow-[0_0_10px_#ffea80]"></div>
          ) : (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 
                          w-[6px] h-[20px] 
                          bg-gradient-to-t from-gray-500 to-transparent 
                          rounded-full 
                          animate-[smokeRise_1.2s_forwards]"></div>
          )}
        </div>
      ))}

    </div>

 




    {/* Cake Wrapper */}
    <div className="relative w-[320px] h-auto flex justify-center items-center">

      {/* Cake Image */}
      <img
        src="/cake.jpg"
        alt="Birthday Cake"
        className="w-[320px] h-auto drop-shadow-xl rounded-xl"
      />

    </div>

    

    {/* Blow Candles Button */}
    <button
      onClick={() => {
        setCandlesOut(true);

        // Confetti burst
        import("canvas-confetti").then((module) => {
          const confetti = module.default;
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.7 },
          });
        });

        // Move to next stage
        setTimeout(() => setStage("message"), 1500);
      }}
      className="mt-10 px-8 py-2 bg-white border border-pink-400 text-pink-600 rounded-full shadow-lg hover:scale-105 transition"
    >
      Blow the Candles 🎂
    </button>

    {/* Cute instruction */}
    <p className="text-sm text-gray-500 mt-2">Click to blow out the candles ✨</p>

    {/* Animations */}
    <style>{`
      @keyframes flicker {
        0% { transform: scale(1) rotate(-4deg); opacity: 1; }
        100% { transform: scale(1.12) rotate(4deg); opacity: 0.85; }
      }
      @keyframes smokeRise {
        0% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-25px); }
      }
    `}</style>

  </div>
)}
{stage === "message" && (
  <section className="py-6">
    <div className="bg-pink-50/70 rounded-3xl p-8 shadow-xl border border-pink-200 flex flex-col md:flex-row gap-8">

      {/* LEFT: LETTER */}
      <div className="md:w-1/2">
        <h2 className="text-3xl font-bold text-pink-600 mb-4">A Little Note For You 💗</h2>

        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          Happy Birthday Priyanshi,
          Vaise, I don't like expressing myself much. I try to maintain a cool image in front of others. Only with a few people I talk without any pretendence — congratulations, you’re one of them!

{"\n\n"}

It’s been 14 years or more, I guess, since we’ve studied together. And you're one of the very few (actually the only one) who has stayed in touch with me for so many years — apart from my family.

In these 14 years, things have changed, perspectives changed and we’ve fought a lot too. Matlab, agar total count nikalu, maybe 3–4 saal ki length toh sirf lad hi rahe honge ham.
(But koi nahi, tujhse galti ho jaati hai. No need to be sorry for this.)

{"\n\n"}

Baaki, on a serious note — you have been truly amazing.
Main woh generic cheezein nahi bolunga ki “meri life par tera bohot bada impact hai” and all… but this much I can definitely say: it is genuinely amazing to have you as a part of my life in any form.
{"\n\n"}
I think you don’t even know how much I admire you — but it’s really unexpressable.
{"\n\n"}
It’s genuinely exciting to talk to you, fight with you, support you, or get support from you.

{"\n\n"}

Just one request — always stay in touch, in whatever way you like. 
{"\n\n"}
Wishing you a very Happy Birthday, and more importantly, blessings from my side for all your future endeavours and plans.
         

          
        </p>

        <button
          onClick={() => {
            bgMusicRef.current?.pause();
    bgMusicRef.current.currentTime = 0; // optional: reset song
    burst();
    setStage("fullslideshow");
          }}
          className="mt-6 px-6 py-3 bg-pink-500 text-white rounded-full shadow-lg hover:scale-105 transition"
        >
          View Slideshow 💞
        </button>

        <button
          onClick={() => {
            burst();
            setStage("gift");
          }}
          className="mt-3 px-6 py-3 bg-white border border-pink-300 rounded-full shadow hover:scale-105 transition"
        >
          🎁 Gift Options
        </button>
      </div>

      {/* RIGHT: PHOTO */}
      <div className="md:w-1/2 flex justify-center">
        <div className="w-64 h-80 bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-pink-200">
          <img src="/DP.jpg" alt="Friend" className="w-full h-full object-cover" />
        </div>
      </div>

    </div>
  </section>
)}

   {stage === "fullslideshow" && (
  <div className="fixed inset-0 z-40 flex flex-col items-center justify-center p-20">

    
    {/* <div className="absolute inset-0 bg-gradient-to-br from-rose-200 via-pink-100 to-amber-100 opacity-90 pointer-events-none"></div> */}

    {/* Slideshow Box */}
    <div className="relative w-[80vw] h-[70vh] max-w-4xl max-h-[700px]
                overflow-hidden rounded-2xl shadow-[0_0_25px_5px_rgba(255,99,155,0.4)]
                border-4 border-pink-400 backdrop-blur-xl pointer-events-auto bg-pink-100/60">


      <img
        src={slideshowImages[slideshowIndex]}
        alt="Memory"
        className="w-full h-full object-contain bg-black/10 transition-all duration-[2500ms]"
      />
    </div>

    {/* Music */}
    <audio src="/Chand.mp3" autoPlay loop />

    {/* Next Button */}
    <button
      onClick={() => {
        burst();
        setStage("gift");
      }}
      className="mt-8 px-8 py-3 bg-pink-500 text-white rounded-full shadow-lg hover:scale-105 transition pointer-events-auto"
    >
      Next Surprise 🎁
    </button>
  </div>
)}




{stage === "gift" && (
  <div className="py-10 text-center">

    <div className="p-10 bg-gradient-to-br from-pink-50 to-white rounded-3xl shadow-2xl border border-pink-200 max-w-xl mx-auto">

      <h3 className="text-3xl font-bold text-pink-600 mb-4">
        Your Final Surprise 🎁
      </h3>

      <p className="text-gray-600 mb-6">
        Scratch the golden card to reveal your gift ✨
      </p>

      {/* SCRATCH CARD */}
      <div className="w-full flex justify-center">
  <SmoothScratchCard
    width={Math.min(window.innerWidth * 0.85, 350)}
    height={Math.min(window.innerHeight * 0.28, 240)}
    className="rounded-xl overflow-hidden shadow-xl"
  >
    <div className="w-full h-full bg-gradient-to-br from-pink-200 to-white 
         rounded-xl flex flex-col items-center justify-center p-4">
      <h2 className="text-lg font-bold text-pink-700">🎉 Surprise! 🎉</h2>
      <p className="text-gray-700 mt-2">Here is your special gift:</p>

      <a
        href="/gift.pdf"
        className="mt-3 px-4 py-2 bg-pink-600 text-white rounded-full shadow hover:scale-105 transition"
      >
        Download Gift
      </a>
    </div>
  </SmoothScratchCard>
</div>


      {/* Final Message */}
      <h4 className="mt-8 text-xl font-semibold">A Final Note 💗</h4>
      <p className="mt-3 text-gray-700 whitespace-pre-line">
        {userMessage || "Happy Birthday, Priyanshi 💖 You are truly special!"}
      </p>
    </div>
  </div>
)}



{/* ---------------- GIFT OPTIONS ---------------- */}
{stage === "giftOptions" && (
  <div className="py-10 text-center">
    <div className="p-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl max-w-lg mx-auto border border-pink-300">

      <h2 className="text-3xl font-bold text-pink-600 mb-6">
        Choose Your Gift 🎁
      </h2>

      <div className="flex flex-col gap-4 text-left">

        {/* Option 1 */}
        <label className="flex items-center gap-3 p-4 bg-pink-50 border border-pink-200 rounded-xl cursor-pointer hover:bg-pink-100">
          <input type="radio" name="gift" value="spotify" className="h-5 w-5" />
          <span className="text-lg font-medium">🎧 Spotify Subscription</span>
        </label>

        {/* Option 2 */}
        <label className="flex items-center gap-3 p-4 bg-pink-50 border border-pink-200 rounded-xl cursor-pointer hover:bg-pink-100">
          <input type="radio" name="gift" value="cakes" className="h-5 w-5" />
          <span className="text-lg font-medium">🎂 Cakes, Chocolates & Treats</span>
        </label>

        {/* Custom Option */}
        <div className="p-4 bg-pink-50 border border-pink-200 rounded-xl">
          <label className="text-lg font-medium mb-2 block">
            ✨ Anything else you'd like?
          </label>
          <input
            id="customGiftInput"
            type="text"
            placeholder="Type your custom wish..."
            className="w-full p-3 border border-pink-300 rounded-lg"
          />
        </div>

      </div>

      {/* Submit Button */}
      <button
        className="mt-8 px-6 py-3 bg-pink-600 text-white rounded-full shadow-lg hover:scale-105 transition"
        onClick={() => {
          const radio = document.querySelector("input[name='gift']:checked");
          const custom = document.getElementById("customGiftInput").value;

          if (radio) {
            setSelectedGift(radio.value);
          } else if (custom.trim() !== "") {
            setSelectedGift(custom.trim());
          } else {
            alert("Please select or enter an option!");
            return;
          }

          confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
          setStage("giftChoiceResult");
        }}
      >
        Submit Choice
      </button>

    </div>
  </div>
)}

{/* ---------------- GIFT CONFIRMATION ---------------- */}
{stage === "giftChoiceResult" && (
  <div className="py-10 text-center">
    <div className="p-10 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl max-w-xl mx-auto border border-pink-300">

      <h2 className="text-3xl font-bold text-pink-600 mb-6">🎁 Your Selected Gift</h2>

      <p className="text-xl font-semibold text-gray-800 mb-4">
        {selectedGift === "spotify" && "🎧 Spotify Subscription"}
        {selectedGift === "cakes" && "🎂 Cakes, Chocolates & Treats"}
        {selectedGift !== "spotify" &&
         selectedGift !== "cakes" &&
         `✨ ${selectedGift}`}
      </p>

      <p className="text-gray-700 mt-4 leading-relaxed">
        Send a screenshot of this page to 
        <span className="font-bold text-pink-600"> 7060173757 </span> 
        to claim your reward! 🎉
      </p>

      {/* Final Birthday Message */}
      <div className="mt-10 p-6 bg-pink-50 rounded-2xl border border-pink-200">
        <h3 className="text-2xl font-bold text-pink-700 mb-3">Happy Birthday 💗</h3>
        <p className="text-gray-700 leading-relaxed">
  Wishing you a <span className="line-through">day</span> life filled with love, laughter, and unforgettable memories.
  You deserve every bit of happiness. 💖✨
  Happy Birthday, once again.
</p>
      </div>

    </div>
  </div>
)}



        {/* Footer */}
        <div className="text-center text-s mt-8 text-gray-500">
          Made with ❤️ by  <span className="text-pink-500">Kaushal</span>
        </div>
      </div>
    </div>
  );
}

// countdown box component
function TimeBox({ label, value }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-3 w-20">
      <div className="text-2xl font-bold">{String(value).padStart(2, "0")}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}
