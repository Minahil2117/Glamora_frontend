import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Heart, Search, X, User, 
  Sparkles, Star, ArrowRight, Filter 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';

// Types
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
}

interface CartItem extends Product {
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

interface WishlistItem extends Product {}

interface ChatMessage {
  type: 'user' | 'ai';
  text: string;
  recommendations?: number[];
}

interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: string;
}

// Sample Products - Glamora Luxury Collection
const initialProducts: Product[] = [
  {
    id: 1,
    name: "Silk Evening Gown",
    price: 289,
    category: "Dresses",
    image: "https://images.unsplash.com/photo-1756483509162-b92ea967a884?q=80&w=361&auto=format&fit=crop",
    description: "Elegant floor-length silk gown with delicate lace detailing. Perfect for gala events and special occasions.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Midnight Black", "Champagne", "Deep Rose"],
    inStock: true
  },
  {
    id: 2,
    name: "Cashmere Turtleneck Sweater",
    price: 145,
    category: "Tops",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&h=800&fit=crop",
    description: "Ultra-soft Italian cashmere sweater with a refined turtleneck. Timeless essential for cooler days.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Cream", "Charcoal", "Camel"],
    inStock: true
  },
  {
    id: 3,
    name: "High-Waisted Wide Leg Trousers",
    price: 125,
    category: "Bottoms",
    image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&h=800&fit=crop",
    description: "Tailored high-waisted trousers in premium wool blend. Features clean lines and a sophisticated wide leg.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Navy", "Taupe"],
    inStock: true
  },
  {
    id: 4,
    name: "Velvet Blazer Jacket",
    price: 210,
    category: "Outerwear",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop",
    description: "Luxurious velvet blazer with structured shoulders and satin lining. The ultimate power piece.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Emerald", "Burgundy", "Black"],
    inStock: true
  },
  {
    id: 5,
    name: "Embroidered Maxi Dress",
    price: 245,
    category: "Dresses",
    image: "https://images.unsplash.com/photo-1755483503991-41ea3f121968?q=80&w=435&auto=format&fit=crop",
    description: "Stunning bohemian-inspired maxi dress with intricate hand embroidery and flowing silhouette.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Ivory", "Sage Green", "Terracotta"],
    inStock: true
  },
  {
    id: 6,
    name: "Oversized Button-Down Shirt",
    price: 95,
    category: "Tops",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop",
    description: "Premium cotton oversized shirt with crisp collar and subtle pleated details. Effortlessly chic.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["White", "Soft Blue", "Sand"],
    inStock: true
  },
  {
    id: 7,
    name: "Leather Slim Trousers",
    price: 165,
    category: "Bottoms",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&h=800&fit=crop",
    description: "Premium lambskin leather trousers with a sleek slim fit. Luxuriously soft with incredible drape.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Cognac", "Olive"],
    inStock: true
  },
  {
    id: 8,
    name: "Shearling Aviator Jacket",
    price: 425,
    category: "Outerwear",
    image: "https://plus.unsplash.com/premium_photo-1734218353091-a40705659ab1?q=80&w=1374&auto=format&fit=crop",
    description: "Iconic aviator jacket crafted from premium suede with genuine shearling collar and cuffs.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Cognac", "Black", "Sand"],
    inStock: true
  },
  {
    id: 9,
    name: "Satin Slip Dress",
    price: 135,
    category: "Dresses",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop",
    description: "Minimalist silk satin slip dress featuring delicate spaghetti straps and elegant bias cut.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Blush", "Black", "Silver"],
    inStock: true
  },
  {
    id: 10,
    name: "Merino Wool Cardigan",
    price: 115,
    category: "Tops",
    image: "https://images.unsplash.com/photo-1683315565563-f72590773805?q=80&w=435&auto=format&fit=crop",
    description: "Luxurious Italian merino wool cardigan with beautiful ribbed texture and pearl buttons.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Pearl", "Heather Grey", "Moss"],
    inStock: true
  },
  {
    id: 11,
    name: "Structured A-Line Skirt",
    price: 98,
    category: "Bottoms",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop",
    description: "Timeless structured A-line skirt in premium Italian wool. Features hidden side zipper and clean finish.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Camel", "Navy"],
    inStock: true
  },
  {
    id: 12,
    name: "Statement Gold Hoops",
    price: 68,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1608508644127-ba99d7732fee?q=80&w=465&auto=format&fit=crop",
    description: "Handcrafted 18K gold-plated hoop earrings with intricate detailing. Perfect everyday luxury.",
    sizes: ["One Size"],
    colors: ["Gold", "Rose Gold", "Silver"],
    inStock: true
  },
  {
    id: 13,
    name: "Double-Breasted Trench Coat",
    price: 365,
    category: "Outerwear",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop",
    description: "Classic double-breasted trench coat in premium water-resistant cotton with leather trim details.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Khaki", "Black", "Camel"],
    inStock: true
  },
  {
    id: 14,
    name: "Off-Shoulder Silk Top",
    price: 89,
    category: "Tops",
    image: "https://images.unsplash.com/photo-1772855436877-3fe7489f4199?q=80&w=387&auto=format&fit=crop",
    description: "Romantic off-shoulder silk charmeuse top with delicate ruffle detailing and adjustable straps.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Ivory", "Dusty Rose", "Black"],
    inStock: true
  }
];

// AI Stylist Knowledge Base
const aiResponses = {
  wedding: {
    text: "For a wedding, I recommend elegant silhouettes that make a statement. Consider our Silk Evening Gown paired with the Statement Gold Hoops. The cashmere turtleneck adds warmth for evening events.",
    recommendations: [1, 12, 2]
  },
  date: {
    text: "For a romantic date night, try the Satin Slip Dress in Blush — it's effortlessly seductive. Pair with our Statement Gold Hoops for a touch of glamour.",
    recommendations: [9, 12]
  },
  casual: {
    text: "For a chic everyday look, our Oversized Button-Down Shirt and Wide Leg Trousers create the perfect relaxed yet elevated outfit. The Merino Wool Cardigan adds cozy luxury.",
    recommendations: [6, 3, 10]
  },
  office: {
    text: "For professional elegance, the Velvet Blazer paired with High-Waisted Wide Leg Trousers makes a powerful impression. The Cashmere Turtleneck adds sophistication.",
    recommendations: [4, 3, 2]
  },
  winter: {
    text: "Stay warm and stylish this season with the Shearling Aviator Jacket and Leather Slim Trousers. The Cashmere Turtleneck underneath completes the look perfectly.",
    recommendations: [8, 7, 2]
  },
  summer: {
    text: "For warm weather, the Embroidered Maxi Dress or Off-Shoulder Silk Top are beautiful choices. Our Satin Slip Dress is lightweight and breathable.",
    recommendations: [5, 14, 9]
  },
  formal: {
    text: "For formal occasions, nothing beats the Silk Evening Gown. For a more tailored look, the Double-Breasted Trench Coat over a silk slip dress creates an unforgettable look.",
    recommendations: [1, 13, 9]
  }
};

const getAIResponse = (input: string): ChatMessage => {
  const lowerInput = input.toLowerCase();
  
  let response = {
    text: "Thank you for sharing! Based on your preferences, I've curated some beautiful options from our collection that I believe will suit you perfectly.",
    recommendations: [1, 4, 9]
  };

  // Match keywords
  if (lowerInput.includes('wedding') || lowerInput.includes('bride') || lowerInput.includes('ceremony')) {
    response = aiResponses.wedding;
  } else if (lowerInput.includes('date') || lowerInput.includes('romantic') || lowerInput.includes('dinner')) {
    response = aiResponses.date;
  } else if (lowerInput.includes('casual') || lowerInput.includes('everyday') || lowerInput.includes('weekend')) {
    response = aiResponses.casual;
  } else if (lowerInput.includes('office') || lowerInput.includes('work') || lowerInput.includes('professional')) {
    response = aiResponses.office;
  } else if (lowerInput.includes('winter') || lowerInput.includes('cold') || lowerInput.includes('coat')) {
    response = aiResponses.winter;
  } else if (lowerInput.includes('summer') || lowerInput.includes('beach') || lowerInput.includes('vacation')) {
    response = aiResponses.summer;
  } else if (lowerInput.includes('formal') || lowerInput.includes('gala') || lowerInput.includes('event')) {
    response = aiResponses.formal;
  } else if (lowerInput.includes('dress')) {
    response = { text: "Dresses are a signature of Glamora. The Silk Evening Gown and Embroidered Maxi Dress are standout pieces. Would you like recommendations for a specific occasion?", recommendations: [1, 5, 9] };
  } else if (lowerInput.includes('jacket') || lowerInput.includes('coat')) {
    response = { text: "Our outerwear collection features luxurious pieces like the Velvet Blazer and Shearling Aviator Jacket. Which style are you looking for?", recommendations: [4, 8, 13] };
  }

  return {
    type: 'ai',
    text: response.text,
    recommendations: response.recommendations
  };
};

// Size Advisor Logic
const getSizeRecommendation = (height: number, weight: number, bust: number): string => {
  const score = (bust + weight / 2) / height * 100;
  
  if (score < 22) return "XS";
  if (score < 25) return "S";
  if (score < 29) return "M";
  if (score < 34) return "L";
  return "Please consider our custom sizing — contact our stylists!";
};

export default function App() {
  // State Management
  const [products] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // UI State
  const [activeTab, setActiveTab] = useState<'shop' | 'ai' | 'orders'>('shop');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high'>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
const [cardNumber, setCardNumber] = useState('');
const [cardExpiry, setCardExpiry] = useState('');
//  ADD THIS NEW BLOCK HERE
const [checkoutForm, setCheckoutForm] = useState({
  fullName: 'Isabella Rossi',
  email: 'isabella.rossi@email.com',
  address: '24 Rue Saint-Honoré',
  city: 'Paris',
  postalCode: '75001'
});


  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [isSizeAdvisorOpen, setIsSizeAdvisorOpen] = useState(false);
  
  // AI Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { type: 'ai', text: "Hello! I'm your personal Glamora AI Stylist. How can I help you find the perfect look today? Tell me about the occasion or your style preferences!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Size Advisor State
  const [height, setHeight] = useState(165);
  const [weight, setWeight] = useState(58);
  const [bust, setBust] = useState(88);
  const [sizeRec, setSizeRec] = useState('');

  // Load from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('glamora_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    
    const savedWishlist = localStorage.getItem('glamora_wishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    
    const savedOrders = localStorage.getItem('glamora_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('glamora_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('glamora_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('glamora_orders', JSON.stringify(orders));
  }, [orders]);

  // Filtered & Sorted Products
  const filteredProducts = React.useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Category
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    // Price Range
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, searchQuery, activeCategory, priceRange, sortBy]);

  const categories = ['All', 'Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Accessories'];

  // Cart Functions
  const addToCart = (product: Product, size: string, color: string, qty: number = 1) => {
    const existing = cart.findIndex(item => 
      item.id === product.id && 
      item.selectedSize === size && 
      item.selectedColor === color
    );

    if (existing !== -1) {
      const updated = [...cart];
      updated[existing].quantity += qty;
      setCart(updated);
    } else {
      setCart([...cart, { ...product, selectedSize: size, selectedColor: color, quantity: qty }]);
    }
    
    toast.success(`Added ${product.name} to cart`, {
      description: `${size} • ${color}`,
      action: { label: "View Cart", onClick: () => setIsCartOpen(true) }
    });
    
    setQuantity(1);
  };

  const removeFromCart = (index: number) => {
    const removed = cart[index];
    setCart(cart.filter((_, i) => i !== index));
    toast.error(`Removed ${removed.name}`);
  };

  const updateCartQuantity = (index: number, newQty: number) => {
    if (newQty < 1) return;
    const updated = [...cart];
    updated[index].quantity = newQty;
    setCart(updated);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist Functions
  const toggleWishlist = (product: Product) => {
    const isWishlisted = wishlist.some(item => item.id === product.id);
    
    if (isWishlisted) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
      toast.info('Removed from wishlist');
    } else {
      setWishlist([...wishlist, product]);
      toast.success('Added to wishlist', { description: product.name });
    }
  };

  const isInWishlist = (id: number) => wishlist.some(item => item.id === id);

  // Product Detail Functions
  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0]);
    setSelectedColor(product.colors[0]);
    setQuantity(1);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setIsTryOnOpen(false);
  };

  // AI Chat Functions
  const sendChatMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = { type: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    
    const currentInput = chatInput;
    setChatInput('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse = getAIResponse(currentInput);
      setChatMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 900);
  };

  // Virtual Try-On Simulation
  const openTryOn = () => {
    if (selectedProduct) {
      setIsTryOnOpen(true);
    }
  };

  // Size Advisor
  const calculateSize = () => {
    const recommended = getSizeRecommendation(height, weight, bust);
    setSizeRec(recommended);
    toast.success('Size recommendation generated', { description: `Recommended: ${recommended}` });
  };

  // Checkout
  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
const completeOrder = async () => {
  const items = cart.map(item => ({
    product_id:     item.id,
    selected_size:  item.selectedSize,
    selected_color: item.selectedColor,
    quantity:       item.quantity
  }));

  try {
    const response = await fetch('http://localhost/glamora_backend/api/orders.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name:    checkoutForm.fullName,
        customer_email:   checkoutForm.email,
        shipping_address: checkoutForm.address,
        city:             checkoutForm.city,
        postal_code:      checkoutForm.postalCode,
        items:            items
      })
    });

    const data = await response.json();
    console.log('Order saved to DB:', data);
  } catch (err) {
    console.error('Could not save order:', err);
  }

  const newOrder: Order = {
    id:     'GLM-' + Date.now().toString().slice(-6),
    date:   new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    items:  [...cart],
    total:  cartTotal,
    status: 'Confirmed'
  };

  setOrders([newOrder, ...orders]);
  setCart([]);
  setIsCheckoutOpen(false);

  toast.success('Order Placed Successfully!', {
    description: `Order #${newOrder.id} • $${cartTotal}`,
    duration: 5000
  });

  setTimeout(() => setActiveTab('orders'), 800);
};

  // Quick Add from AI
  const quickAddProduct = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart(product, product.sizes[0], product.colors[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F2937] font-sans">
      <Toaster position="top-center" richColors closeButton />

      {/* Elegant Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-lg border-b border-[#E5E0D5]">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#9F1239] to-[#7C2D12] rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-serif tracking-[-1px]">G</span>
            </div>
            <div>
              <div className="font-serif text-3xl tracking-[-1.5px] text-[#1F2937]">GLAMORA</div>
              <div className="text-[9px] text-[#9F1239] -mt-1 tracking-[3px]">EST 2014</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10 text-sm tracking-widest uppercase font-medium">
            <button 
              onClick={() => { setActiveTab('shop'); window.scrollTo({ top: 700, behavior: 'smooth' }); }} 
              className={`hover:text-[#9F1239] transition-colors ${activeTab === 'shop' ? 'text-[#9F1239]' : ''}`}
            >
              Shop
            </button>
            <button 
              onClick={() => setActiveTab('ai')} 
              className={`flex items-center gap-1.5 hover:text-[#9F1239] transition-colors ${activeTab === 'ai' ? 'text-[#9F1239]' : ''}`}
            >
              <Sparkles size={15} /> AI Stylist
            </button>
            <button 
              onClick={() => setActiveTab('orders')} 
              className={`hover:text-[#9F1239] transition-colors ${activeTab === 'orders' ? 'text-[#9F1239]' : ''}`}
            >
              Orders
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Wishlist */}
            <button 
              onClick={() => {
                if (wishlist.length > 0) {
                  const first = wishlist[0];
                  openProduct(first);
                } else {
                  toast.info("Your wishlist is empty");
                }
              }}
              className="p-3 hover:bg-white rounded-full relative transition-all group"
            >
              <Heart className="w-5 h-5 text-[#1F2937] group-hover:text-[#9F1239]" />
              {wishlist.length > 0 && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#9F1239] text-white text-[9px] rounded-full flex items-center justify-center">
                  {wishlist.length}
                </div>
              )}
            </button>

            {/* Cart */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-3 hover:bg-white rounded-full relative flex items-center gap-2 transition-all group"
            >
              <ShoppingBag className="w-5 h-5 text-[#1F2937] group-hover:text-[#9F1239]" />
              {cartCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-[#9F1239] text-white text-xs font-medium px-1.5 py-px rounded-full min-w-[18px] text-center">
                  {cartCount}
                </div>
              )}
            </button>

            <button onClick={() => setActiveTab('ai')} className="hidden md:block px-6 py-2.5 text-sm font-medium bg-[#1F2937] text-white rounded-full hover:bg-[#9F1239] transition-colors">
              Talk to AI
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="pt-20 bg-[#1F2937] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-8 pt-24 pb-24 text-center relative z-10">
          <div className="inline-block px-4 py-1 bg-white/10 text-[#E5D4B9] rounded-full text-xs tracking-[4px] mb-6">LUXURY REDEFINED</div>
          <h1 className="font-serif text-7xl md:text-8xl tracking-[-4.5px] leading-none mb-6">Timeless.<br />Elegant.<br />Unforgettable.</h1>
          <p className="text-xl text-[#E5D4B9] max-w-md mx-auto mb-10">Discover the finest in contemporary luxury fashion. Crafted with purpose, designed to last.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => { setActiveTab('shop'); window.scrollTo({ top: 680, behavior: 'smooth' }); }}
              className="group px-10 py-4 bg-white text-[#1F2937] rounded-full font-medium flex items-center justify-center gap-3 text-sm tracking-widest hover:bg-[#9F1239] hover:text-white transition-all"
            >
              EXPLORE THE COLLECTION <ArrowRight className="group-hover:translate-x-0.5 transition" />
            </button>
            <button 
              onClick={() => setActiveTab('ai')}
              className="group px-9 py-4 border border-white/40 hover:bg-white/10 rounded-full flex items-center justify-center gap-3 text-sm tracking-widest transition-all"
            >
              <Sparkles className="w-4 h-4" /> MEET YOUR AI STYLIST
            </button>
          </div>
        </div>

        {/* Subtle Hero Visual */}
        <div className="absolute bottom-0 right-0 w-2/5 h-3/5 bg-gradient-to-br from-[#9F1239]/30 to-transparent"></div>
        <div className="absolute bottom-12 right-12 hidden lg:block text-right text-white/40 text-xs tracking-widest">
          PARIS • NEW YORK • MILAN
        </div>
      </div>

      {/* STATS BAR */}
      <div className="bg-white border-b border-[#E5E0D5]">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-center gap-16 text-center">
          {[
            { label: "Collections", value: "14" },
            { label: "Countries", value: "39" },
            { label: "Satisfied Clients", value: "18k" }
          ].map((stat, idx) => (
            <div key={idx}>
              <div className="font-serif text-4xl tracking-tight text-[#1F2937]">{stat.value}</div>
              <div className="text-xs tracking-[3px] text-[#9F1239] mt-1">{stat.label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT TABS */}
      <div className="max-w-7xl mx-auto px-8 pt-12 pb-20">
        
        {/* SHOP TAB */}
        {activeTab === 'shop' && (
          <>
            {/* Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-y-6 mb-9">
              <div>
                <div className="font-serif text-5xl tracking-[-2px]">The Collection</div>
                <p className="text-[#6B6B6B] mt-1">Signature pieces handcrafted for the modern woman</p>
              </div>

              {/* Search */}
              <div className="relative w-full lg:w-80">
                <input 
                  type="text" 
                  placeholder="Search our collection..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white pl-12 py-3.5 border border-[#E5E0D5] rounded-full focus:outline-none focus:border-[#9F1239] text-sm placeholder:text-[#9F1239]/40"
                />
                <Search className="absolute left-5 top-4 text-[#9F1239]" size={19} />
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-7 py-2 rounded-full text-sm transition-all border ${activeCategory === cat 
                    ? 'bg-[#1F2937] text-white border-[#1F2937]' 
                    : 'border-[#E5E0D5] hover:bg-white hover:border-[#9F1239]'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between bg-white p-5 rounded-3xl border border-[#E5E0D5]">
              <div className="flex items-center gap-3 text-sm">
                <Filter className="text-[#9F1239]" size={17} /> 
                <span className="font-medium">Price Range:</span>
                <input 
                  type="range" 
                  min="0" max="500" step="10" 
                  value={priceRange[1]} 
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} 
                  className="accent-[#9F1239] w-28" 
                />
                <span className="font-mono text-xs text-[#6B6B6B]">${priceRange[0]} — ${priceRange[1]}</span>
              </div>

              <div className="flex items-center gap-3">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as any)} 
                  className="border border-[#E5E0D5] px-5 py-2.5 text-sm rounded-full bg-white focus:outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <div className="text-xs text-[#6B6B6B] px-3 py-1 bg-[#F8F5F1] rounded-full">{filteredProducts.length} pieces</div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="group bg-white rounded-3xl overflow-hidden border border-[#E5E0D5] hover:shadow-2xl hover:border-[#9F1239]/20 transition-all duration-300 flex flex-col">
                  <div className="relative aspect-[4/4.4] overflow-hidden bg-[#F8F5F1]">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700" 
                    />
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                        className={`p-2.5 bg-white/90 backdrop-blur rounded-full transition-all ${isInWishlist(product.id) ? 'text-[#9F1239]' : 'text-[#1F2937] hover:text-[#9F1239]'}`}
                      >
                        <Heart size={16} fill={isInWishlist(product.id) ? '#9F1239' : 'none'} />
                      </button>
                    </div>
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm">SOLD OUT</div>
                    )}
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <div className="text-xs tracking-[1.5px] text-[#9F1239] mb-px">{product.category}</div>
                        <div className="font-medium text-xl tracking-tight pr-3 leading-tight">{product.name}</div>
                      </div>
                      <div className="font-mono text-xl font-medium text-right whitespace-nowrap">${product.price}</div>
                    </div>
                    
                    <div className="text-xs text-[#6B6B6B] mt-auto pt-3 line-clamp-2 mb-4">{product.description}</div>
                    
                    <div className="flex gap-2 mt-auto">
                      <button 
                        onClick={() => openProduct(product)}
                        className="flex-1 py-3 text-xs font-medium border border-[#1F2937] hover:bg-[#1F2937] hover:text-white transition-colors tracking-[1.5px] rounded-full"
                      >
                        VIEW DETAILS
                      </button>
                      <button 
                        onClick={() => addToCart(product, product.sizes[0], product.colors[0])}
                        className="flex-1 py-3 text-xs font-medium bg-[#1F2937] text-white hover:bg-[#9F1239] transition-colors tracking-[1.5px] rounded-full"
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* AI STYLIST TAB */}
        {activeTab === 'ai' && (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-[#1F2937] text-white px-5 py-1 rounded-full text-xs tracking-[3px] mb-3">POWERED BY GLAMORA AI</div>
              <h2 className="font-serif text-6xl tracking-tight">Your Personal Stylist</h2>
              <p className="text-[#6B6B6B] mt-3 text-lg">Describe your vision. We'll curate a perfect look.</p>
            </div>

            {/* AI Chat Interface */}
            <div className="bg-white border border-[#E5E0D5] rounded-3xl shadow-xl overflow-hidden mb-8">
              {/* Chat Header */}
              <div className="px-8 py-5 border-b flex items-center gap-4 bg-[#F8F5F1]">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#9F1239] to-[#7C2D12] flex items-center justify-center">
                  <Sparkles className="text-white" size={21} />
                </div>
                <div>
                  <div className="font-medium">Glamora AI Stylist</div>
                  <div className="text-xs text-emerald-600 flex items-center gap-1.5">• Online • Personalized for you</div>
                </div>
              </div>

              {/* Messages */}
              <div className="h-[380px] overflow-y-auto p-8 space-y-6 bg-[#FAF7F2]">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : ''}`}>
                    <div className={`max-w-[82%] px-6 py-4 text-[15px] rounded-3xl ${msg.type === 'user' 
                      ? 'bg-[#1F2937] text-white rounded-tr-none' 
                      : 'bg-white border border-[#E5E0D5] rounded-tl-none shadow-sm'}`}>
                      {msg.text}
                      
                      {/* Recommendations */}
                      {msg.recommendations && msg.recommendations.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-[#E5E0D5]">
                          <div className="text-xs tracking-widest mb-3 text-[#9F1239]">RECOMMENDED FOR YOU</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {msg.recommendations.map(pid => {
                              const prod = products.find(p => p.id === pid);
                              if (!prod) return null;
                              return (
                                <button 
                                  key={pid} 
                                  onClick={() => quickAddProduct(pid)}
                                  className="group text-left p-3 bg-[#FAF7F2] hover:bg-[#1F2937] hover:text-white text-xs rounded-2xl flex gap-3 items-center transition-all"
                                >
                                  <img src={prod.image} className="w-10 h-10 object-cover rounded-xl flex-shrink-0" alt="" />
                                  <div>
                                    <div className="font-medium group-hover:text-white">{prod.name}</div>
                                    <div className="text-[#9F1239] group-hover:text-[#E5D4B9]">${prod.price}</div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex">
                    <div className="px-5 py-4 bg-white rounded-3xl border border-[#E5E0D5]">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-[#9F1239] rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-[#9F1239] rounded-full animate-bounce delay-100" />
                        <div className="w-1.5 h-1.5 bg-[#9F1239] rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t p-5 bg-white">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Describe the occasion, vibe or style you're looking for..." 
                    className="flex-1 bg-[#F8F5F1] px-6 py-4 rounded-2xl text-sm border border-[#E5E0D5] focus:outline-none focus:border-[#9F1239]"
                  />
                  <button 
                    onClick={sendChatMessage}
                    disabled={!chatInput.trim()}
                    className="px-9 rounded-2xl bg-[#1F2937] text-white disabled:bg-zinc-400 flex items-center justify-center hover:bg-[#9F1239] transition-colors"
                  >
                    <ArrowRight size={19} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3 text-xs">
                  {["Date night outfit", "Wedding guest", "Winter formal", "Office chic", "Beach vacation"].map((suggestion, i) => (
                    <button key={i} onClick={() => { setChatInput(suggestion); }} className="px-4 py-1 rounded-full bg-[#F8F5F1] hover:bg-[#E5E0D5] text-[#6B6B6B]">
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Features Quick Access */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Size Advisor */}
              <div className="bg-white p-8 rounded-3xl border border-[#E5E0D5]">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-9 h-9 bg-[#1F2937] rounded-2xl flex items-center justify-center"><User className="text-white" size={19} /></div>
                  <div>
                    <div className="font-medium tracking-tight">AI Size Advisor</div>
                    <div className="text-xs text-[#6B6B6B]">Find your perfect fit instantly</div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsSizeAdvisorOpen(true)} 
                  className="mt-2 px-8 py-3.5 rounded-2xl bg-[#1F2937] text-white text-sm tracking-widest font-medium w-full hover:bg-[#9F1239]"
                >
                  GET MY SIZE RECOMMENDATION
                </button>
              </div>

              {/* Try On */}
              <div className="bg-white p-8 rounded-3xl border border-[#E5E0D5]">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-9 h-9 bg-[#9F1239] rounded-2xl flex items-center justify-center"><Star className="text-white" size={19} /></div>
                  <div>
                    <div className="font-medium tracking-tight">Virtual Try-On</div>
                    <div className="text-xs text-[#6B6B6B]">See how pieces look on you</div>
                  </div>
                </div>
                <button 
                  onClick={() => { setActiveTab('shop'); toast.info("Browse products and click 'View Details' to try them on"); }}
                  className="mt-2 px-8 py-3.5 rounded-2xl border border-[#1F2937] text-sm tracking-widest font-medium w-full hover:bg-[#1F2937] hover:text-white transition"
                >
                  BROWSE &amp; TRY-ON
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-9">
              <div className="font-serif text-6xl tracking-[-2px]">Your Orders</div>
              <p className="text-[#6B6B6B]">Track your recent purchases and style journey</p>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-[#E5E0D5]">
                <ShoppingBag className="mx-auto mb-4 text-[#9F1239]" size={42} />
                <div className="text-xl font-medium mb-1">No orders yet</div>
                <p className="text-[#6B6B6B]">Start shopping to see your orders here.</p>
                <button onClick={() => setActiveTab('shop')} className="mt-6 px-8 py-3 bg-[#1F2937] text-white rounded-full text-sm tracking-widest">SHOP THE COLLECTION</button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white border border-[#E5E0D5] p-8 rounded-3xl">
                    <div className="flex justify-between items-center mb-5">
                      <div>
                        <div className="font-mono text-xs tracking-[2px] text-[#9F1239]">{order.id}</div>
                        <div className="font-medium tracking-tight text-2xl">Order placed on {order.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs px-4 py-px bg-emerald-100 text-emerald-700 rounded-full w-fit ml-auto">{order.status}</div>
                        <div className="font-mono text-3xl mt-1 tracking-tighter">${order.total}</div>
                      </div>
                    </div>
                    <div className="border-t pt-6">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-3 border-b last:border-none text-sm">
                          <div>{item.name} <span className="text-[#9F1239]">× {item.quantity}</span></div>
                          <div className="font-mono">${item.price * item.quantity}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="bg-[#1F2937] text-[#E5D4B9] py-16 border-t border-[#2F3B4A]">
        <div className="max-w-7xl mx-auto px-8 text-center text-sm">
          <div className="font-serif text-4xl text-white tracking-[-1px] mb-2">GLAMORA</div>
          <div className="text-xs tracking-[3px]">PARIS • MILAN • NEW YORK</div>
          <div className="mt-8 text-[#A38C6B]">© {new Date().getFullYear()} Glamora. All Rights Reserved.</div>
        </div>
      </footer>

      {/* PRODUCT DETAIL MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4" onClick={closeProductModal}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 30 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.96, y: 30 }}
              transition={{ ease: [0.22, 1, 0.36, 1] }}
              className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={closeProductModal} className="absolute top-6 right-6 z-10 p-3 bg-white/90 backdrop-blur rounded-full">
                <X size={18} />
              </button>

              <div className="grid md:grid-cols-2">
                {/* Image Side */}
                <div className="relative bg-[#F8F5F1]">
                  <img src={selectedProduct.image} alt="" className="w-full h-full object-cover aspect-[4/4.35]" />
                  
                  {/* Try On Button */}
                  <button 
                    onClick={openTryOn}
                    className="absolute bottom-6 left-6 px-7 py-3 flex items-center gap-2 bg-white/95 hover:bg-white backdrop-blur text-[#1F2937] text-xs rounded-full font-medium tracking-[1.5px] shadow-xl"
                  >
                    <Star size={15} /> VIRTUAL TRY-ON
                  </button>
                </div>

                {/* Details Side */}
                <div className="p-9 flex flex-col">
                  <div>
                    <div className="uppercase text-xs tracking-[3px] text-[#9F1239]">{selectedProduct.category}</div>
                    <h3 className="font-serif text-5xl tracking-[-2px] leading-none mt-1 mb-3">{selectedProduct.name}</h3>
                    <div className="font-mono text-4xl tracking-tight mb-6">${selectedProduct.price}</div>
                  </div>
                  
                  <p className="text-[#6B6B6B] leading-snug pr-8 mb-auto">{selectedProduct.description}</p>

                  {/* Size Selection */}
                  <div className="mt-8">
                    <div className="text-xs font-medium tracking-widest mb-3 flex justify-between items-center">
                      SIZE <button onClick={() => setIsSizeAdvisorOpen(true)} className="text-[#9F1239] flex items-center gap-1 text-[10px]">AI SIZE ADVISOR →</button>
                    </div>
                    <div className="flex gap-2">
                      {selectedProduct.sizes.map(size => (
                        <button 
                          key={size} 
                          onClick={() => setSelectedSize(size)}
                          className={`px-5 py-2 text-sm border rounded-full transition-all flex-1 ${selectedSize === size ? 'bg-[#1F2937] border-[#1F2937] text-white' : 'border-[#E5E0D5] hover:border-[#9F1239]'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Selection */}
                  <div className="mt-6">
                    <div className="text-xs font-medium tracking-widest mb-3">COLOR</div>
                    <div className="flex gap-2 flex-wrap">
                      {selectedProduct.colors.map(color => (
                        <button 
                          key={color} 
                          onClick={() => setSelectedColor(color)}
                          className={`px-6 py-2 text-xs border rounded-full transition-all ${selectedColor === color ? 'bg-[#1F2937] text-white border-[#1F2937]' : 'border-[#E5E0D5] hover:bg-[#F8F5F1]'}`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity + Actions */}
                  <div className="flex gap-3 mt-9">
                    <div className="flex border border-[#E5E0D5] rounded-full text-sm items-center">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 py-3 text-lg font-light">-</button>
                      <div className="font-mono w-6 text-center">{quantity}</div>
                      <button onClick={() => setQuantity(quantity + 1)} className="px-5 py-3 text-lg font-light">+</button>
                    </div>
                    
                    <button 
                      onClick={() => {
                        if (selectedProduct) {
                          addToCart(selectedProduct, selectedSize, selectedColor, quantity);
                          closeProductModal();
                        }
                      }}
                      className="flex-1 py-3.5 bg-[#1F2937] hover:bg-[#9F1239] transition-colors text-white text-sm tracking-widest rounded-full font-medium"
                    >
                      ADD TO CART
                    </button>
                  </div>

                  <button 
                    onClick={() => {
                      if (selectedProduct) toggleWishlist(selectedProduct);
                    }}
                    className="mt-3 py-3.5 flex items-center justify-center gap-2 text-sm border border-[#E5E0D5] rounded-full text-[#1F2937] hover:bg-[#F8F5F1]"
                  >
                    <Heart size={17} className={isInWishlist(selectedProduct.id) ? 'fill-[#9F1239] text-[#9F1239]' : ''} /> 
                    {isInWishlist(selectedProduct.id) ? 'IN WISHLIST' : 'ADD TO WISHLIST'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIRTUAL TRY-ON MODAL */}
      <AnimatePresence>
        {isTryOnOpen && selectedProduct && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-6" onClick={() => setIsTryOnOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              className="bg-[#1F2937] text-white w-full max-w-md rounded-3xl overflow-hidden" 
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex justify-between mb-7">
                  <div>
                    <div className="font-serif text-3xl tracking-[-1px]">Virtual Try-On</div>
                    <div className="text-xs text-[#E5D4B9]">AI POWERED PREVIEW</div>
                  </div>
                  <button onClick={() => setIsTryOnOpen(false)}><X /></button>
                </div>
                
                <div className="relative aspect-[4/5] bg-[#2A3749] rounded-2xl overflow-hidden mb-7">
                  {/* Simulated Model + Clothing Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#334155] via-[#1F2937] to-black flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto w-[120px] h-[120px] border border-white/40 rounded-full flex items-center justify-center mb-4">
                        <div className="text-center text-white/60 text-sm">MODEL<br />PREVIEW</div>
                      </div>
                      <div className="text-2xl tracking-widest font-serif text-[#E5D4B9]">{selectedProduct.name}</div>
                      <div className="text-xs mt-1 text-[#E5D4B9]/60">IN {selectedColor.toUpperCase()} • {selectedSize}</div>
                    </div>
                  </div>
                  
                  {/* Overlay Clothing Effect */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#9F1239]/70 to-transparent" />
                </div>
                
                <div className="text-xs text-center text-[#E5D4B9]">This is a high-fidelity preview. Actual fit may vary based on body type.</div>
              </div>
              <button onClick={() => setIsTryOnOpen(false)} className="w-full py-4 text-xs tracking-widest bg-white/10 hover:bg-white/20">CLOSE PREVIEW</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[90] flex justify-end bg-black/40" onClick={() => setIsCartOpen(false)}>
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} 
              transition={{ type: 'spring', bounce: 0.05, duration: 0.4 }}
              className="bg-white w-full max-w-md h-full overflow-auto shadow-2xl flex flex-col" 
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center px-8 pt-9 pb-5 border-b">
                <div>
                  <div className="font-medium tracking-tight text-3xl">Your Cart</div>
                  <div className="text-sm text-[#9F1239]">{cartCount} items</div>
                </div>
                <button onClick={() => setIsCartOpen(false)}><X /></button>
              </div>

              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-center px-8">
                  <ShoppingBag className="text-[#E5E0D5]" size={60} />
                  <div className="mt-6 text-lg tracking-tight">Your cart is empty</div>
                  <button onClick={() => { setIsCartOpen(false); setActiveTab('shop'); }} className="mt-5 px-8 py-3 border border-[#1F2937] text-sm tracking-widest rounded-full">BROWSE COLLECTION</button>
                </div>
              ) : (
                <>
                  <div className="flex-1 px-8 pt-6 space-y-6 overflow-y-auto">
                    {cart.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <img src={item.image} alt="" className="w-24 h-24 object-cover rounded-2xl" />
                        <div className="flex-1 text-sm">
                          <div className="font-medium pr-4">{item.name}</div>
                          <div className="text-xs text-[#6B6B6B] mt-px">{item.selectedSize} • {item.selectedColor}</div>
                          <div className="font-mono mt-2 tracking-tight">${item.price}</div>

                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center border border-[#E5E0D5] text-sm rounded-xl">
                              <button onClick={() => updateCartQuantity(index, item.quantity - 1)} className="px-3 py-px">-</button>
                              <span className="px-3 text-xs font-mono">{item.quantity}</span>
                              <button onClick={() => updateCartQuantity(index, item.quantity + 1)} className="px-3 py-px">+</button>
                            </div>
                            <button onClick={() => removeFromCart(index)} className="text-xs text-[#9F1239] hover:underline">Remove</button>
                          </div>
                        </div>
                        <div className="font-mono text-right whitespace-nowrap pt-1">${item.price * item.quantity}</div>
                      </div>
                    ))}
                  </div>

                  <div className="p-8 border-t mt-auto">
                    <div className="flex justify-between font-medium mb-1 text-xl tracking-tighter">
                      <div>Total</div><div>${cartTotal}</div>
                    </div>
                    <div className="text-xs text-[#6B6B6B]">Taxes &amp; shipping calculated at checkout</div>
                    
                    <button 
                      onClick={handleCheckout}
                      className="w-full mt-6 py-4 bg-[#1F2937] text-white tracking-[2px] rounded-full text-sm hover:bg-[#9F1239] transition"
                    >
                      PROCEED TO CHECKOUT
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHECKOUT MODAL */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-[95] bg-black/70 flex items-center justify-center p-4" onClick={() => setIsCheckoutOpen(false)}>
          <motion.div 
  initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
  className="bg-white w-full max-w-lg rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto"
  onClick={e => e.stopPropagation()}
>
  <div className="p-9">
    <div className="font-serif text-4xl tracking-[-1.5px] mb-6">Checkout</div>

    {/* CONTACT + SHIPPING — unchanged */}
    <div className="space-y-6 text-sm">
  <div>
    <div className="font-medium tracking-widest text-xs mb-2 text-[#9F1239]">CONTACT INFORMATION</div>
    <input 
      type="text" 
      placeholder="Full Name" 
      value={checkoutForm.fullName}
      onChange={(e) => setCheckoutForm({ ...checkoutForm, fullName: e.target.value })}
      className="w-full py-3 border-b border-[#E5E0D5] focus:outline-none" 
    />
    <input 
      type="email" 
      placeholder="Email Address" 
      value={checkoutForm.email}
      onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
      className="w-full py-3 border-b border-[#E5E0D5] focus:outline-none" 
    />
  </div>
  <div>
    <div className="font-medium tracking-widest text-xs mb-2 text-[#9F1239]">SHIPPING ADDRESS</div>
    <input 
      type="text" 
      placeholder="Street Address" 
      value={checkoutForm.address}
      onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
      className="w-full py-3 border-b border-[#E5E0D5] focus:outline-none" 
    />
    <div className="grid grid-cols-2 gap-3">
      <input 
        type="text" 
        placeholder="City" 
        value={checkoutForm.city}
        onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
        className="py-3 border-b border-[#E5E0D5] focus:outline-none" 
      />
      <input 
        type="text" 
        placeholder="ZIP / Postal" 
        value={checkoutForm.postalCode}
        onChange={(e) => setCheckoutForm({ ...checkoutForm, postalCode: e.target.value })}
        className="py-3 border-b border-[#E5E0D5] focus:outline-none" 
      />
    </div>
  </div>
</div>
    {/* ── PAYMENT METHOD ── */}
    <div className="mt-8">
      <div className="font-medium tracking-widest text-xs mb-4 text-[#9F1239]">PAYMENT METHOD</div>

      {/* Method Tabs */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
          { id: 'upi',  label: 'UPI',                 icon: '📱' },
          { id: 'cod',  label: 'Cash on Delivery',    icon: '📦' },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setPaymentMethod(m.id as 'card' | 'upi' | 'cod')}
            className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border text-xs font-medium transition-all ${
              paymentMethod === m.id
                ? 'border-[#9F1239] bg-[#FFF5F7] text-[#9F1239]'
                : 'border-[#E5E0D5] hover:border-[#9F1239] text-[#6B6B6B]'
            }`}
          >
            <span className="text-lg">{m.icon}</span>
            <span className="text-center leading-tight">{m.label}</span>
          </button>
        ))}
      </div>

      {/* CARD FIELDS */}
      {paymentMethod === 'card' && (
        <div className="space-y-4">
          <div className="flex gap-2 mb-1">
            {['VISA', 'Mastercard', 'AMEX'].map(b => (
              <span key={b} className="text-[10px] font-medium border border-[#E5E0D5] rounded-md px-2 py-1 text-[#6B6B6B]">{b}</span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Card Number  1234  5678  9012  3456"
            maxLength={19}
            value={cardNumber}
            onChange={e => {
              const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
              setCardNumber(raw.replace(/(.{4})/g, '$1  ').trim());
            }}
            className="w-full py-3 border-b border-[#E5E0D5] focus:outline-none text-sm tracking-widest"
          />
          <input
            type="text"
            placeholder="Cardholder Name"
            className="w-full py-3 border-b border-[#E5E0D5] focus:outline-none text-sm"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="MM / YY"
              maxLength={7}
              value={cardExpiry}
              onChange={e => {
                const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                setCardExpiry(raw.length >= 3 ? raw.slice(0,2) + ' / ' + raw.slice(2) : raw);
              }}
              className="py-3 border-b border-[#E5E0D5] focus:outline-none text-sm"
            />
            <input
              type="password"
              placeholder="CVV  •••"
              maxLength={4}
              className="py-3 border-b border-[#E5E0D5] focus:outline-none text-sm"
            />
          </div>
        </div>
      )}

      {/* UPI FIELDS */}
      {paymentMethod === 'upi' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(u => (
              <span key={u} className="text-xs border border-[#E5E0D5] rounded-xl px-3 py-1 text-[#6B6B6B]">{u}</span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Enter your UPI ID  e.g. name@upi"
            className="w-full py-3 border-b border-[#E5E0D5] focus:outline-none text-sm"
          />
          <p className="text-xs text-[#6B6B6B]">You'll receive a payment request on your UPI app to approve.</p>
        </div>
      )}

      {/* CASH ON DELIVERY */}
      {paymentMethod === 'cod' && (
        <div className="bg-[#F8F5F1] rounded-2xl p-6 text-center">
          <div className="text-3xl mb-2">💵</div>
          <div className="font-medium mb-1">Pay when your order arrives</div>
          <p className="text-xs text-[#6B6B6B] leading-relaxed">
            No extra charges. Have the exact amount ready at the time of delivery.<br/>
            Available on orders up to $500.
          </p>
        </div>
      )}
    </div>

    {/* ORDER SUMMARY */}
    <div className="border-t mt-8 pt-5 space-y-2 text-sm">
      <div className="flex justify-between text-[#6B6B6B]"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
      <div className="flex justify-between text-[#6B6B6B]"><span>Shipping</span><span>Free</span></div>
      <div className="flex justify-between text-[#6B6B6B]"><span>Tax (5%)</span><span>${(cartTotal * 0.05).toFixed(2)}</span></div>
      <div className="flex justify-between font-medium text-xl pt-2 border-t border-[#E5E0D5]">
        <span>Total</span>
        <span className="font-mono">${(cartTotal * 1.05).toFixed(2)}</span>
      </div>
    </div>

    <button
      onClick={completeOrder}
      className="w-full mt-6 py-4 bg-[#9F1239] text-white tracking-[2px] text-sm font-medium rounded-full hover:bg-[#7C2D12] transition"
    >
      {paymentMethod === 'cod' ? 'PLACE ORDER — PAY ON DELIVERY' : paymentMethod === 'upi' ? 'PAY VIA UPI' : 'PLACE SECURE ORDER'}
    </button>
    <div className="text-center mt-3 text-xs text-[#6B6B6B] flex items-center justify-center gap-1">
      🔒 Secured by Stripe · 256-bit SSL · 30-day returns
    </div>
  </div>
</motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SIZE ADVISOR MODAL */}
      <AnimatePresence>
        {isSizeAdvisorOpen && (
          <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4" onClick={() => setIsSizeAdvisorOpen(false)}>
            <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-md p-9 rounded-3xl" onClick={e => e.stopPropagation()}>
              <div className="font-serif text-4xl tracking-tighter mb-1">AI Size Advisor</div>
              <div className="text-[#6B6B6B] text-sm">Enter your measurements for the perfect fit recommendation.</div>
              
              <div className="mt-8 space-y-6">
                <div>
                  <div className="flex justify-between mb-2 text-sm"><div>Height (cm)</div><div className="font-mono">{height}</div></div>
                  <input type="range" min="145" max="190" step="1" value={height} onChange={e => setHeight(parseInt(e.target.value))} className="accent-[#9F1239] w-full" />
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm"><div>Weight (kg)</div><div className="font-mono">{weight}</div></div>
                  <input type="range" min="42" max="95" step="1" value={weight} onChange={e => setWeight(parseInt(e.target.value))} className="accent-[#9F1239] w-full" />
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm"><div>Bust (cm)</div><div className="font-mono">{bust}</div></div>
                  <input type="range" min="75" max="115" step="1" value={bust} onChange={e => setBust(parseInt(e.target.value))} className="accent-[#9F1239] w-full" />
                </div>
              </div>

              {sizeRec && (
                <div className="my-7 px-6 py-4 bg-[#F8F5F1] rounded-2xl text-center">
                  <div className="text-xs tracking-widest text-[#9F1239]">YOUR RECOMMENDED SIZE</div>
                  <div className="font-serif text-7xl tracking-[-3px] text-[#1F2937] mt-1">{sizeRec}</div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setIsSizeAdvisorOpen(false)} className="flex-1 py-4 border text-sm rounded-full tracking-widest">CLOSE</button>
                <button onClick={calculateSize} className="flex-1 py-4 bg-[#1F2937] text-white rounded-full text-sm tracking-widest">CALCULATE MY SIZE</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
