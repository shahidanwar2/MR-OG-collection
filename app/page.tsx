"use client";
import { useRef, useState, useEffect } from 'react'; // useEffect add kiya
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { supabase } from '@/lib/supabase'; // Supabase connect kiya

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// --- Interface for TypeScript ---
// Isse build error (type 'never') hamesha ke liye khatam ho jayegi
interface ProductData {
  mensTops: any[];
  mensBottoms: any[];
  kidsTops: any[];
  kidsBottoms: any[];
}

export default function Home() {
  const container = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // --- Dynamic State ---
  // Interface use kiya hai taki TypeScript ko data type pata rahe
  const [productsData, setProductsData] = useState<ProductData>({
    mensTops: [],
    mensBottoms: [],
    kidsTops: [],
    kidsBottoms: []
  });
  
  const [activeGallery, setActiveGallery] = useState<keyof ProductData | null>(null);

  // --- Supabase se data kheenchna ---
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      
      if (data) {
        // Data ko categories mein divide karna
        const organized: ProductData = {
          mensTops: data.filter((p: any) => p.category === 'mensTops'),
          mensBottoms: data.filter((p: any) => p.category === 'mensBottoms'),
          kidsTops: data.filter((p: any) => p.category === 'kidsTops'),
          kidsBottoms: data.filter((p: any) => p.category === 'kidsBottoms'),
        };
        setProductsData(organized);
      }
      if (error) console.error("Error fetching products:", error.message);
    };

    fetchProducts();
  }, []);

  useGSAP(() => {
    gsap.to(".hero-title", { y: 0, duration: 1.5, ease: "power4.out" });

    const sections = gsap.utils.toArray(".panel");
    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: ".horizontal-slider",
        pin: true,
        scrub: 1,
        end: () => "+=" + (scrollRef.current?.offsetWidth || 4000),
      }
    });

    ScrollTrigger.create({
      trigger: ".horizontal-slider",
      start: "top center",
      onEnter: () => document.body.classList.add('dark-mode'),
      onLeaveBack: () => document.body.classList.remove('dark-mode'),
    });
  }, { scope: container });

  const openLocation = () => {
    window.open("https://www.google.com/maps/search/?api=1&query=Pakadiya+road+Harsidhi+Bihar", "_blank");
  };

  return (
    <main ref={container} className="relative">
      
      {/* --- Floating Gallery Modal --- */}
      {activeGallery && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 md:p-20 overflow-y-auto">
          <button onClick={() => setActiveGallery(null)} className="fixed top-10 right-10 text-white text-5xl font-light hover:rotate-90 transition-all z-[110]">✕</button>
          
          {/* Agar products nahi hain toh message dikhayega */}
          {productsData[activeGallery].length === 0 ? (
            <div className="text-white text-center">
                <h3 className="text-4xl font-black italic uppercase opacity-20">No Products Found</h3>
                <p className="mt-4 text-orange-500 font-bold uppercase tracking-widest text-xs">Upload from Admin Dashboard</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl pt-20 pb-10">
                {productsData[activeGallery].map((item: any) => (
                <div key={item.id} className="group bg-zinc-900/50 p-5 rounded-2xl border border-white/5 hover:border-orange-500 transition-all">
                  
                    <div className="h-[400px] overflow-hidden rounded-xl mb-6 shadow-2xl">
                    <img src={item.image_url || item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.name} />
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h4 className="text-2xl font-black text-white uppercase italic leading-none mb-2">{item.name}</h4>
                            <p className="text-orange-500 font-black text-2xl leading-none">{item.price}</p>
                        </div>
                        <button className="px-6 py-3 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-lg hover:bg-orange-500 hover:text-white transition-all">Order</button>
                    </div>
                </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Navbar */}
      <nav className="fixed top-0 w-full p-6 md:p-10 flex justify-between items-center z-50 mix-blend-difference text-white">
        <div className="font-black text-2xl tracking-tighter uppercase italic text-orange-500">MR OG.</div>
        <div className="flex gap-6 md:gap-10 text-[10px] uppercase tracking-[3px] font-bold">
          <a href="#catalogue" className="hover:text-orange-500 transition-colors">Catalogue</a>
          <a href="#contact" className="hover:text-orange-500 transition-colors">Contact</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="h-screen flex flex-col items-center justify-center">
        <div className="overflow-hidden">
          <h1 className="hero-title translate-y-full text-[10vw] font-black uppercase leading-[0.8] tracking-tighter text-center">
            MR OG <br/> <span className="text-orange-500 text-[8vw]">Collections</span>
          </h1>
        </div>
        <p className="mt-6 text-zinc-400 tracking-[0.8em] uppercase text-[9px] text-center px-4 font-bold">
          Premium Streetwear for Men & Kids
        </p>
      </section>

      {/* Horizontal Slider */}
      <section id="catalogue" className="horizontal-slider overflow-hidden h-screen bg-zinc-950 text-white">
        <div ref={scrollRef} className="flex h-full w-[600%]">
          
          <div className="panel w-screen h-full flex flex-col items-center justify-center border-r border-white/10">
            <h2 className="text-8xl md:text-[12vw] font-black italic uppercase text-orange-500 leading-none">Men's</h2>
            <p className="mt-4 tracking-[8px] uppercase text-xs opacity-50 italic">Scroll to Explore</p>
          </div>

          {/* MENS TOP */}
          <div className="panel w-screen h-full flex flex-col md:flex-row items-center justify-center gap-10 p-10 bg-zinc-900 border-r border-white/10">
            <div className="max-w-md">
              <span className="text-orange-500 font-bold tracking-widest text-xs">MENS / TOPS</span>
              <h3 className="text-6xl font-black uppercase mt-2 mb-4">OG Shirts</h3>
              <button onClick={() => setActiveGallery('mensTops')} className="px-12 py-4 border-2 border-white text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">View All Tops</button>
            </div>
            <div className="w-full md:w-[350px] h-[450px] bg-zinc-800 rounded-lg overflow-hidden shadow-2xl">
               <img src="https://i.pinimg.com/736x/cb/63/9a/cb639a6a329c3f685e0c7f123c8de2ba.jpg" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Shirts"/>
            </div>
          </div>

          {/* MENS BOTTOM */}
          <div className="panel w-screen h-full flex flex-col md:flex-row-reverse items-center justify-center gap-10 p-10 border-r border-white/10">
            <div className="max-w-md">
              <span className="text-orange-500 font-bold tracking-widest text-xs">MENS / BOTTOMS</span>
              <h3 className="text-6xl font-black uppercase mt-2 mb-4">OG Jeans</h3>
              <button onClick={() => setActiveGallery('mensBottoms')} className="px-12 py-4 bg-orange-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">View All Jeans</button>
            </div>
            <div className="w-full md:w-[350px] h-[450px] bg-zinc-800 rounded-lg overflow-hidden shadow-2xl">
               <img src="https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Jeans"/>
            </div>
          </div>

          <div className="panel w-screen h-full flex flex-col items-center justify-center bg-orange-500 text-black border-r border-black/10">
            <h2 className="text-8xl md:text-[12vw] font-black italic uppercase leading-none">Kids</h2>
            <p className="mt-4 tracking-[8px] uppercase text-xs font-bold italic">Little OGs Collection</p>
          </div>

          {/* KIDS TOP */}
          <div className="panel w-screen h-full flex flex-col md:flex-row items-center justify-center gap-10 p-10 bg-zinc-950 border-r border-white/10">
            <div className="max-w-md">
              <span className="text-orange-500 font-bold tracking-widest text-xs italic">KIDS / TOPS</span>
              <h3 className="text-6xl font-black uppercase mt-2 mb-4">Mini Tees</h3>
              <button onClick={() => setActiveGallery('kidsTops')} className="px-12 py-4 border-2 border-orange-500 text-orange-500 font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all">Explore Tops</button>
            </div>
            <div className="w-full md:w-[350px] h-[450px] bg-zinc-800 rounded-lg overflow-hidden border border-white/10 shadow-2xl">
               <img src="https://xcdn.next.co.uk/Common/Items/Default/Default/ItemImages/3_4Ratio/Search/Lge/W66708.jpg?im=Resize,width=450" className="w-full h-full object-cover" alt="Kids Tops"/>
            </div>
          </div>

          {/* KIDS BOTTOM */}
          <div className="panel w-screen h-full flex flex-col md:flex-row-reverse items-center justify-center gap-10 p-10 bg-white text-black">
            <div className="max-w-md text-right md:text-left">
              <span className="text-orange-500 font-bold tracking-widest text-xs italic uppercase">Kids / Bottoms</span>
              <h3 className="text-6xl font-black uppercase mt-2 mb-4">Mini Jeans</h3>
              <button onClick={() => setActiveGallery('kidsBottoms')} className="px-12 py-4 bg-black text-white font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 transition-all">Shop Bottoms</button>
            </div>
            <div className="w-full md:w-[350px] h-[450px] bg-zinc-200 rounded-lg overflow-hidden shadow-2xl">
               <img src="https://www.patpat.com/cdn/shop/files/688053ce59035.webp?v=1757926823&width=750" className="w-full h-full object-cover" alt="Kids Bottoms"/>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-black text-white p-10 md:p-20 min-h-screen flex flex-col justify-between">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10">
            <h2 className="text-[12vw] font-black leading-none text-orange-500 uppercase tracking-tighter">OG   <br/> STORE.</h2>
            <div className="flex flex-col gap-10">
                <div className="flex flex-col text-4xl md:text-6xl font-black italic uppercase">
                    <a href="#" className="hover:text-orange-500 transition-all">Instagram</a>
                    <a href="https://wa.me/91XXXXXXXXXX" className="text-green-500 hover:text-white transition-all">WhatsApp</a>
                    <a href="#" className="hover:text-orange-500 transition-all">Facebook</a>
                </div>
                <div className="flex items-center gap-4 group cursor-pointer" onClick={openLocation}>
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div className="font-bold text-sm tracking-[3px] uppercase">
                        Pakadiya road, Harsidhi, Bihar <br/>
                        <span className="text-orange-500 text-[10px]">Click to view on Map</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-end gap-4">
            <p className="text-[10px] font-bold uppercase text-zinc-400">© 2026 MR OG COLLECTIONS</p>
            <div className="text-right">
                <p className="text-2xl font-black italic uppercase">MR OG Lifestyle.</p>
                <p className="text-[10px] font-bold text-orange-500 tracking-widest uppercase">mrogcollections.in</p>
            </div>
        </div>
      </footer>
    </main>
  );
}