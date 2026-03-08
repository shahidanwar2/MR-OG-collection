"use client";
import { useState, useEffect } from 'react'; 
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryMobile, setRecoveryMobile] = useState("");
  
  // --- CONFIGURATION ---
  const ADMIN_ACCESS_KEY = "admin123"; 
  const REGISTERED_MOBILE = ""; // REPLACE WITH YOUR 10-DIGIT MOBILE NUMBER

  // Form States
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("mensTops");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);

  const fetchInventory = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (data) {
      setAllProducts([...data].reverse());
    }
    if (error) console.error("Error fetching inventory:", error.message);
  };

  useEffect(() => {
    if (isLoggedIn) fetchInventory();
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_ACCESS_KEY) {
      setIsLoggedIn(true);
    } else {
      alert("Invalid Access Key!");
    }
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (recoveryMobile === REGISTERED_MOBILE) {
      alert(`Identity Verified! Your Access Key is: ${ADMIN_ACCESS_KEY}`);
      setShowRecovery(false);
    } else {
      alert("This mobile number is not registered!");
    }
  };

  const handleUpload = async () => {
    if (!name || !price || !imageUrl) {
      alert("Please fill all details!");
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('products')
      .insert([{ name, price, category, image_url: imageUrl }]);

    if (error) {
      alert("Upload Error: " + error.message);
    } else {
      alert("Success! Product added to MR OG COLLECTIONS.");
      setName(""); setPrice(""); setImageUrl("");
      fetchInventory(); 
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to remove this item?")) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) {
        alert("Item removed successfully!");
        fetchInventory(); 
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white p-6">
        <div className="w-full max-w-md p-10 border border-white/10 rounded-3xl bg-zinc-900/50 backdrop-blur-xl shadow-2xl">
          <h2 className="text-4xl font-black italic uppercase text-orange-500 mb-2 text-center">MR OG</h2>
          <p className="text-center text-[10px] tracking-[4px] uppercase opacity-50 mb-8">Admin Control</p>
          
          {!showRecovery ? (
            <form onSubmit={handleLogin}>
              <input 
                type="password" 
                placeholder="ENTER ACCESS KEY" 
                className="w-full p-4 bg-black border border-white/10 rounded-xl outline-none focus:border-orange-500 transition-all text-center tracking-widest mb-4"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="w-full bg-orange-500 hover:bg-white hover:text-black py-4 font-black uppercase tracking-[3px] rounded-xl transition-all duration-500">
                Login Dashboard
              </button>
              <button 
                type="button"
                onClick={() => setShowRecovery(true)}
                className="w-full mt-6 text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-all underline"
              >
                Forgot Password?
              </button>
            </form>
          ) : (
            <form onSubmit={handleRecovery}>
              <p className="text-[10px] text-center mb-4 opacity-70 uppercase tracking-widest">Verify Mobile Number</p>
              <input 
                type="text" 
                placeholder="+91XXXXXXXXXX" 
                className="w-full p-4 bg-black border border-white/10 rounded-xl outline-none focus:border-orange-500 transition-all text-center tracking-widest mb-4"
                value={recoveryMobile}
                onChange={(e) => setRecoveryMobile(e.target.value)}
              />
              <button className="w-full bg-white text-black py-4 font-black uppercase tracking-[3px] rounded-xl transition-all">
                Recover Key
              </button>
              <button 
                type="button"
                onClick={() => setShowRecovery(false)}
                className="w-full mt-6 text-[10px] uppercase tracking-widest opacity-40"
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-black italic uppercase leading-none">Admin <br/><span className="text-orange-500 text-3xl">Dashboard</span></h1>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="px-6 py-2 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:border-red-500 transition-all">Logout</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5">
            <h3 className="text-sm font-black uppercase tracking-[3px] mb-8 text-orange-500 italic">Add New Collection</h3>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold tracking-widest opacity-50 ml-1">Product Title</label>
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="e.g. Oversized Black Tee" className="p-4 bg-black border border-white/10 rounded-xl outline-none focus:border-orange-500" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold tracking-widest opacity-50 ml-1">Price (₹)</label>
                <input value={price} onChange={(e) => setPrice(e.target.value)} type="text" placeholder="e.g. ₹1,299" className="p-4 bg-black border border-white/10 rounded-xl outline-none focus:border-orange-500" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold tracking-widest opacity-50 ml-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-4 bg-black border border-white/10 rounded-xl outline-none text-white appearance-none cursor-pointer">
                    <option value="mensTops">Men's Tops</option>
                    <option value="mensBottoms">Men's Bottoms</option>
                    <option value="kidsTops">Kids' Tops</option>
                    <option value="kidsBottoms">Kids' Bottoms</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold tracking-widest opacity-50 ml-1">Image URL</label>
                <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} type="text" placeholder="Paste Image Link" className="p-4 bg-black border border-white/10 rounded-xl outline-none focus:border-orange-500" />
              </div>

              <button onClick={handleUpload} disabled={loading} className="mt-4 bg-white text-black py-5 font-black uppercase tracking-widest rounded-xl hover:bg-orange-500 hover:text-white transition-all">
                {loading ? "Uploading..." : "Publish to Store"}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-orange-500 p-10 rounded-3xl text-black">
                <p className="text-[10px] font-black uppercase tracking-[4px]">Status</p>
                <h4 className="text-5xl font-black italic uppercase mt-2">Live</h4>
            </div>
            <div className="bg-zinc-900/50 p-10 rounded-3xl border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-[4px] opacity-50">Admin Notes</p>
                <ul className="mt-6 flex flex-col gap-4 text-xs font-bold opacity-70">
                    <li>• Registered Recovery: {REGISTERED_MOBILE.slice(-4).padStart(10, '*')}</li>
                    <li>• Changes are instant on the storefront.</li>
                </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 bg-zinc-900/30 p-8 rounded-3xl border border-white/5">
          <h3 className="text-xl font-black italic uppercase text-orange-500 mb-8">Manage Inventory</h3>
          <div className="grid grid-cols-1 gap-4">
            {allProducts.length === 0 ? (
                <p className="text-center py-10 opacity-30 italic">No products found...</p>
            ) : (
                allProducts.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-black/50 rounded-xl border border-white/5 group hover:border-orange-500/30 transition-all">
                      <div className="flex items-center gap-4">
                        <img src={item.image_url} className="w-14 h-14 object-cover rounded-lg" alt="" />
                        <div>
                          <p className="font-bold uppercase text-xs tracking-wider">{item.name}</p>
                          <p className="text-[10px] text-orange-500 font-black uppercase">{item.category} • {item.price}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDelete(item.id)} className="px-5 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-[10px] font-black uppercase rounded-lg transition-all">
                        Remove
                      </button>
                    </div>
                  ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}