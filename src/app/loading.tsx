export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="relative w-32 h-32 flex items-center justify-center">

    
        <img
          src="/logo-biru.png" 
          alt="logo"
          className="w-14 h-14 z-20 object-contain"
        />

        <div className="
          absolute 
          w-40 h-40
          rounded-full
          animate-spin-slow
        "
          style={{
            background: "conic-gradient(#dcdcdc 0deg, #31569A 120deg, transparent 360deg)"
          }}
        />

        {/* WHITE INNER CIRCLE */}
        <div className="absolute w-32 h-32 bg-white rounded-full z-10"></div>
      </div>
    </div>
  );
}
