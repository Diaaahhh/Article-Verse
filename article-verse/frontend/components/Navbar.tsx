"use client";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/constants/api";

export default function Navbar() {
  const router = useRouter();
   const handleAddPost = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/check-auth`, {
        credentials: "include", // VERY IMPORTANT
      });

      if (res.status === 401) {
        router.push("/login");
      } else {
        router.push("/add-post");
      }
    } catch (error) {
      console.log(error);
      router.push("/login");
    }
  };
  return (
    <nav
      className="w-full border-b shadow-sm flex justify-center"
      style={{
        borderColor: "#D5D4D3",
        backgroundColor: "#FFFFFF",
      }}
    >
      <div className="mx-auto flex h-28 w-full max-w-[1400px] items-center justify-end px-4"
      // style={{
      //   borderColor: "#D5D4D3",
      //   backgroundColor: "#FF00FF",
      // }}
      >
        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-4">
          {/* Add Post */}
          <div
            role="button"
            tabIndex={0}
              onClick={handleAddPost}
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
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
            }}
          >
            Add Post
          </div>

          {/* Sign In */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => router.push("/login")}
            className="flex h-[52px] w-[145px] cursor-pointer items-center justify-center text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:h-[58px] md:w-[165px] md:text-base"
            style={{
              background: "linear-gradient(135deg, #A9512C 0%, #302C2B 100%)",
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
            Sign In
          </div>
        </div>
      </div>
    </nav>
  );
}
