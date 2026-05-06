"use client";

export default function Footer() {
  return (
    <footer
      className="w-full border-t"
      style={{
        borderColor: "#D5D4D3",
        backgroundColor: "#302C2B",
        color: "#D5D4D3",
      }}
    >
      {/* ===================== */}
      {/* TOP SECTION (3 COLUMNS) */}
      {/* ===================== */}
      <div className="mx-auto w-full  px-6 py-16 flex justify-center items-center ">
        <div className="grid grid-cols-1 max-w-[1400px] md:grid-cols-3 gap-60 text-center md:text-center  ">
          
          {/* Column 1 */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">
              Explore
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Home</li>
              <li className="hover:text-white cursor-pointer">Categories</li>
              <li className="hover:text-white cursor-pointer">Articles</li>
              <li className="hover:text-white cursor-pointer">Trending</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">
              Resources
            </h3>
            <ul className="space-y-5 text-sm">
              <li className="hover:text-white cursor-pointer " style={{
                marginBottom:"5px"
              }}>Blog</li>
              <li className="hover:text-white cursor-pointer">Guides</li>
              <li className="hover:text-white cursor-pointer">Help Center</li>
              <li className="hover:text-white cursor-pointer">Support</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-white cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
            </ul>
          </div>

        </div>
      </div>

      {/* ===================== */}
      {/* BOTTOM SECTION */}
      {/* ===================== */}
      <div
        className="border-t py-6 px-4 text-center space-y-3"
        style={{ borderColor: "#5A6869" }}
      >
        {/* Row 1 */}
        <p className="text-sm">
          Copyright © 2026 ফেলনা উচ্চ বিদ্যালয়. All Rights Reserved
        </p>

        {/* Row 2 */}
        <p className="text-xs text-[#A0A0A0]">
          Domain Registration by: IGL Web Ltd. | Web Hosting by: IGL Web Ltd. | Web Design & Development by: IGL Web Ltd.
        </p>
      </div>
    </footer>
  );
}