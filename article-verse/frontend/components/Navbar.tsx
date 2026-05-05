"use client";

export default function Navbar() {
  return (
    <nav
      className="w-full border-b shadow-sm"
      style={{
        borderColor: "#D5D4D3",
        backgroundColor: "#FFFFFF",
      }}
    >
      <div
  className="flex h-28 w-full justify-end"
  style={{
    paddingLeft: "15px",
    paddingRight: "15px",
  }}
>
        

        {/* Navigation Links */}
        {/* <div className="hidden flex-1 items-center justify-center gap-6 md:flex lg:gap-10">
          {["Home", "Articles", "Explore", "About"].map((item) => (
            <button
              key={item}
              className="text-base font-medium transition-all duration-300 hover:scale-105 lg:text-lg"
              style={{ color: "#5A6869" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#A9512C";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#5A6869";
              }}
            >
              {item}
            </button>
          ))}
        </div> */}

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-4">

          {/* Sign In */}
          <div
            role="button"
            tabIndex={0}
            className="flex h-[52px] w-[130px] cursor-pointer items-center justify-center border-2 text-sm font-semibold tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:h-[58px] md:w-[145px] md:text-base"
            style={{
              borderColor: "#A9512C",
              color: "#A9512C",
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#A9512C";
              e.currentTarget.style.color = "#FFFFFF";
              e.currentTarget.style.boxShadow =
                "0 10px 24px rgba(169, 81, 44, 0.28)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FFFFFF";
              e.currentTarget.style.color = "#A9512C";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0,0,0,0.06)";
            }}
          >
            Sign In
          </div>

          {/* Register */}
          <div
            role="button"
            tabIndex={0}
            className="flex h-[52px] w-[145px] cursor-pointer items-center justify-center text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:h-[58px] md:w-[165px] md:text-base"
            style={{
              background:
                "linear-gradient(135deg, #A9512C 0%, #302C2B 100%)",
              borderRadius: "12px",
              boxShadow: "0 8px 18px rgba(48, 44, 43, 0.22)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 14px 30px rgba(48, 44, 43, 0.32)";
              e.currentTarget.style.opacity = "0.96";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 18px rgba(48, 44, 43, 0.22)";
              e.currentTarget.style.opacity = "1";
            }}
          >
            Register
          </div>

        </div>
      </div>
    </nav>
  );
}