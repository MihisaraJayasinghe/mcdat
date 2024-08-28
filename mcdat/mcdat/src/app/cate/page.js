"use client";
import Link from "next/link";

export default function Page() {
    const categories = [
        { name: "Category 1", link: "/Home" },
        { name: "Category 2", link: "#" },
        { name: "Category 3", link: "#" },
        { name: "Category 4", link: "#" }
      ];
    
  
     
    return (
        
      <div className="flex items-center justify-center min-h-screen bg-black p-10">
  <div className=" imager absolute top-20 left-0 right-0">
            <img 
          src=" " 
          alt="Logo" 
          className="absolute inset-0 m-auto w-24 h-24"
        />
            </div>
        {/* Left Section */}
        <div className="text-7xl  text-white">
          MCdat
          <br/>
          <div>
            <a className="text-sm">Database with adding ,edit and deleting , use categories and use the system</a>
        </div>
          
        </div>
       
      
        {/* Right Section */}
        <div className="pl-40 text-white columns-2 row-auto">
        {categories.map((category, index) => (
          <Link href={category.link} key={index}>
            <div
              className="p-4 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-600 cursor-pointer mb-4"
            >
              <h2 className="text-2xl font-semibold">{category.name}</h2>
            </div>
          </Link>
        ))}
      </div>
      </div>
    );
  }