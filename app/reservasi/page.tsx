'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import { fetchAvailabilityData, getAvailablePlaces } from '@/utils/googleSheets';
import { menuData } from '@/data/menu';
import { MenuItem, MenuCategory, PriceOption } from '@/types/menu';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import MenuItemView from '@/components/MenuItem';
import Image from 'next/image';
import siteContent from '@/data/siteContent.json';

interface ReservationForm {
  nama: string;
  email: string;
  noWa: string;
  jumlahOrang: number | '';
  tanggalReservasi: string;
  jam: string;
  tempat: string;
}

interface CartItem {
  id: string;
  menuId: string;
  menuName: string;
  kategori: PriceOption;
  quantity: number;
  image?: string;
  catatan?: string;
}

const categories = [
  { id: 'all' as MenuCategory, label: 'Semua Menu', icon: '' },
  { id: 'best-seller' as MenuCategory, label: 'Best Seller', icon: '' },
  { id: 'coffee-milk' as MenuCategory, label: 'Coffee & Milk', icon: '' },
  { id: 'non-coffee' as MenuCategory, label: 'Non Coffee', icon: '' },
  { id: 'mocktail' as MenuCategory, label: 'Mocktail', icon: '' },
  { id: 'coldbrew' as MenuCategory, label: 'Coldbrew', icon: '' },
  { id: 'frappe-series' as MenuCategory, label: 'Frappe Series', icon: '' },
  { id: 'tea-based' as MenuCategory, label: 'Tea Based', icon: '' },
  { id: 'manual-brew' as MenuCategory, label: 'Manual Brew', icon: '' },
  { id: 'milk-based' as MenuCategory, label: 'Milk Based', icon: '' },
  { id: 'espresso-based' as MenuCategory, label: 'Espresso Based', icon: '' },
  { id: 'ricebowl' as MenuCategory, label: 'Ricebowl', icon: '' },
  { id: 'local-dish' as MenuCategory, label: 'Local Dish', icon: '' },
  { id: 'cake-cookies' as MenuCategory, label: 'Cake & Cookies', icon: '' },
  { id: 'snack' as MenuCategory, label: 'Snack', icon: '' },
  { id: 'spaghetti' as MenuCategory, label: 'Spaghetti', icon: '' },
  { id: 'sweet-treats' as MenuCategory, label: 'Sweet Treats', icon: '' },
];

export default function ReservasiPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<ReservationForm>({
    nama: '',
    email: '',
    noWa: '',
    jumlahOrang: '',
    tanggalReservasi: '',
    jam: '',
    tempat: '',
  });

  const [availablePlaces, setAvailablePlaces] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Menu selection state
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [showKategoriModal, setShowKategoriModal] = useState(false);
  const [modalCatatan, setModalCatatan] = useState<string>('');
  const [modalQuantity, setModalQuantity] = useState<number | ''>('');
  const [selectedKategori, setSelectedKategori] = useState<PriceOption | null>(null);
  const [showCartModal, setShowCartModal] = useState(false);
  const [catatanReview, setCatatanReview] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState<'lunas' | 'dp'>('lunas');
  const [submitting, setSubmitting] = useState(false);

  // Load form data and cart from localStorage on mount
  useEffect(() => {
    const savedForm = localStorage.getItem('reservasi_form');
    const savedCart = localStorage.getItem('reservasi_cart');
    const savedStep = localStorage.getItem('reservasi_step');
    
    if (savedForm) {
      try {
        const parsed = JSON.parse(savedForm);
        setFormData(parsed);
      } catch (e) {
        console.error('Failed to load saved form data', e);
      }
    }
    
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setCart(parsed);
      } catch (e) {
        console.error('Failed to load saved cart', e);
      }
    }

    if (savedStep) {
      try {
        const step = parseInt(savedStep) as 1 | 2 | 3;
        if (step >= 1 && step <= 3) {
          setCurrentStep(step);
        }
      } catch (e) {
        console.error('Failed to load saved step', e);
      }
    }
  }, []);

  // Save form data, cart, and step to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('reservasi_form', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('reservasi_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('reservasi_step', currentStep.toString());
  }, [currentStep]);

  // Fetch available places when date or number of people changes
  useEffect(() => {
    const fetchPlaces = async () => {
      const jumlahOrangNum = typeof formData.jumlahOrang === 'number' ? formData.jumlahOrang : 0;
      
      if (!formData.tanggalReservasi || !jumlahOrangNum || formData.jumlahOrang === '') {
        setAvailablePlaces([]);
        setFormData((prev) => ({ ...prev, tempat: '' }));
        return;
      }

      setLoading(true);
      setError('');

      const spreadsheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL || '';
      
      if (!spreadsheetUrl) {
        setError('URL spreadsheet belum dikonfigurasi. Silakan hubungi administrator.');
        setLoading(false);
        return;
      }

      try {
        const availabilityData = await fetchAvailabilityData(spreadsheetUrl);
        const places = getAvailablePlaces(
          availabilityData,
          formData.tanggalReservasi,
          jumlahOrangNum
        );
        
        setAvailablePlaces(places);
        
        if (formData.tempat && !places.includes(formData.tempat)) {
          setFormData((prev) => ({ ...prev, tempat: '' }));
        }
      } catch (err) {
        console.error('Failed to fetch availability', err);
        setError('Gagal memuat data ketersediaan tempat. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [formData.tanggalReservasi, formData.jumlahOrang]);

  const handleInputChange = (field: keyof ReservationForm, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    // Validation for step 1
    if (currentStep === 1) {
      const jumlahOrangNum = typeof formData.jumlahOrang === 'number' ? formData.jumlahOrang : 0;
      if (!formData.nama || !formData.email || !formData.noWa || !formData.tanggalReservasi || !formData.jam || !formData.tempat || !jumlahOrangNum || formData.jumlahOrang === '') {
        setError('Mohon lengkapi semua field yang wajib diisi.');
        return;
      }
      setError('');
      setCurrentStep(2);
    }
  };

  const handleMenuClick = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setModalCatatan('');
    setModalQuantity('');
    setSelectedKategori(null);
    setShowKategoriModal(true);
  };

  const handleSelectKategori = (kategori: PriceOption) => {
    setSelectedKategori(kategori);
  };

  const handleAddToCart = () => {
    if (!selectedMenuItem || !selectedKategori) return;
    
    const quantity = typeof modalQuantity === 'number' ? modalQuantity : 0;
    if (quantity < 1) return;

    const cartItemId = `${selectedMenuItem.id}-${selectedKategori.jenis}`;
    const existingItemIndex = cart.findIndex((item) => item.id === cartItemId);

    if (existingItemIndex >= 0) {
      // Update quantity
      setCart((prev) =>
        prev.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity, catatan: modalCatatan.trim() || undefined }
            : item
        )
      );
    } else {
      // Add new item
      const newItem: CartItem = {
        id: cartItemId,
        menuId: selectedMenuItem.id,
        menuName: selectedMenuItem.name,
        kategori: selectedKategori,
        quantity: quantity,
        image: selectedMenuItem.image,
        catatan: modalCatatan.trim() || undefined,
      };
      setCart((prev) => [...prev, newItem]);
    }

    setShowKategoriModal(false);
    setSelectedMenuItem(null);
    setModalCatatan('');
    setModalQuantity('');
    setSelectedKategori(null);
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.kategori.harga * item.quantity, 0);
  };

  const getServiceFee = () => {
    const subtotal = getCartTotal();
    return Math.round(subtotal * 0.02); // 2% service fee
  };

  const getGrandTotal = () => {
    return getCartTotal() + getServiceFee();
  };

  // Format WhatsApp ID: 082172772394 -> 6282172772394@c.us
  const formatWhatsAppId = (phoneNumber: string): string => {
    // Remove all non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // If starts with 0, replace with 62
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    } else if (!cleaned.startsWith('62')) {
      // If doesn't start with 62, add it
      cleaned = '62' + cleaned;
    }
    
    return cleaned + '@c.us';
  };

  // Format menu untuk spreadsheet: menu-kategori-jumlah-catatan, menu-kategori-jumlah-catatan
  const formatMenuItems = (cartItems: CartItem[]): string => {
    return cartItems.map((item) => {
      const parts = [
        item.menuName,
        item.kategori.jenis,
        item.quantity.toString(),
        item.catatan || ''
      ];
      return parts.join('-');
    }).join(', ');
  };

  const filteredMenu = useMemo(() => {
    let filtered = menuData;

    if (activeCategory === 'best-seller') {
      filtered = filtered.filter((item) => item.isPopular);
    }

    if (activeCategory !== 'all' && activeCategory !== 'best-seller') {
      filtered = filtered.filter((item) => item.category === activeCategory);
    }

    if (searchQuery && searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [activeCategory, searchQuery]);

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      {/* Step 1: Form Reservasi */}
      {currentStep === 1 && (
        <>
          <section className="bg-white border-b border-neutral-200/70">
            <div className="max-w-3xl mx-auto px-4 lg:px-0 py-10 md:py-14">
              <p className="text-[11px] font-medium tracking-[0.28em] uppercase text-neutral-500 text-center mb-3">
                Reservasi
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 text-center">
                Pesan meja untuk kunjungan Anda
              </h1>
              <p className="text-sm md:text-[15px] leading-relaxed text-neutral-600 text-center mt-4 max-w-xl mx-auto">
                Isi formulir di bawah ini untuk melakukan reservasi meja. Kami akan konfirmasi melalui WhatsApp.
              </p>
            </div>
          </section>

          <main className="max-w-3xl mx-auto px-4 lg:px-0 py-10 md:py-14">
            <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className="bg-white rounded-lg border border-neutral-200/80 p-6 md:p-8 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="nama" className="block text-sm font-medium text-neutral-900 mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => handleInputChange('nama', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-900 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  placeholder="nama@email.com"
                />
              </div>

              <div>
                <label htmlFor="noWa" className="block text-sm font-medium text-neutral-900 mb-2">
                  Nomor WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="noWa"
                  value={formData.noWa}
                  onChange={(e) => handleInputChange('noWa', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  placeholder="081234567890"
                />
              </div>

              <div>
                <label htmlFor="jumlahOrang" className="block text-sm font-medium text-neutral-900 mb-2">
                  Jumlah Orang <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="jumlahOrang"
                  min="1"
                  value={formData.jumlahOrang}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleInputChange('jumlahOrang', value === '' ? '' : parseInt(value) || '');
                  }}
                  required
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  placeholder="Masukkan jumlah orang"
                />
              </div>

              <div>
                <label htmlFor="tanggalReservasi" className="block text-sm font-medium text-neutral-900 mb-2">
                  Tanggal Reservasi <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="tanggalReservasi"
                  min={today}
                  value={formData.tanggalReservasi}
                  onChange={(e) => handleInputChange('tanggalReservasi', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label htmlFor="jam" className="block text-sm font-medium text-neutral-900 mb-2">
                  Jam Reservasi <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="jam"
                  value={formData.jam}
                  onChange={(e) => handleInputChange('jam', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label htmlFor="tempat" className="block text-sm font-medium text-neutral-900 mb-2">
                  Tempat <span className="text-red-500">*</span>
                </label>
                {loading ? (
                  <div className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-sm text-neutral-500">
                    Memuat ketersediaan tempat...
                  </div>
                ) : availablePlaces.length === 0 && formData.tanggalReservasi && typeof formData.jumlahOrang === 'number' && formData.jumlahOrang > 0 ? (
                  <div className="w-full px-4 py-3 border border-yellow-200 bg-yellow-50 rounded-lg text-sm text-yellow-700">
                    Tidak ada tempat yang tersedia untuk tanggal dan jumlah orang ini.
                  </div>
                ) : (
                  <select
                    id="tempat"
                    value={formData.tempat}
                    onChange={(e) => handleInputChange('tempat', e.target.value)}
                    required
                    disabled={!formData.tanggalReservasi || typeof formData.jumlahOrang !== 'number' || formData.jumlahOrang <= 0 || availablePlaces.length === 0}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm disabled:bg-neutral-50 disabled:text-neutral-400"
                  >
                    <option value="">Pilih tempat</option>
                    {availablePlaces.map((place) => (
                      <option key={place} value={place}>
                        {place}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-brand-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-brand transition-colors text-sm"
                >
                  Lanjut
                </button>
              </div>
            </form>
          </main>
        </>
      )}

      {/* Step 2: Pilih Menu */}
      {currentStep === 2 && (
        <>
          <section className="bg-white border-b border-neutral-200/70">
            <div className="max-w-6xl mx-auto px-4 lg:px-0 py-10 md:py-14">
              <p className="text-[11px] font-medium tracking-[0.28em] uppercase text-neutral-500 text-center mb-3">
                Pilih Menu
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 text-center">
                Pilih menu untuk reservasi Anda
              </h1>
              <p className="text-sm md:text-[15px] leading-relaxed text-neutral-600 text-center mt-4 max-w-xl mx-auto">
                Pilih menu yang ingin Anda pesan saat reservasi
              </p>
            </div>
          </section>

          <main className="max-w-6xl mx-auto px-4 lg:px-0 py-10 md:py-14">
            <div className="md:flex md:items-start md:gap-10 lg:gap-12">
              {/* Category Filter Sidebar */}
              <aside className="md:w-56 lg:w-64 md:pt-1 md:border-r md:border-neutral-200/70 md:pr-6 lg:pr-8 md:sticky md:top-24 md:self-start mb-6 md:mb-0">
                <CategoryFilter
                  categories={categories}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                />
              </aside>

              {/* Menu Grid */}
              <section className="md:flex-1">
                <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
                <div className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6">
                    {filteredMenu.map((item, index) => (
                      <div
                        key={item.id}
                        className="animate-in fade-in slide-in-from-bottom-4"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <button
                          type="button"
                          onClick={() => handleMenuClick(item)}
                          className="block w-full text-left cursor-pointer"
                          aria-label={`Pilih menu ${item.name}`}
                        >
                          <MenuItemView item={item} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Cart Display (Fixed at bottom on mobile, sidebar on desktop) */}
            {cart.length > 0 && (
              <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50">
                <div 
                  onClick={() => setShowCartModal(true)}
                  className="p-4 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-neutral-900">Keranjang ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                    <span className="text-base font-bold text-neutral-900">
                      Rp {getCartTotal().toLocaleString('id-ID')}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentStep(3);
                    }}
                    className="w-full bg-brand-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-brand transition-colors text-sm"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}

            {/* Desktop Cart Sidebar */}
            <div className="hidden md:block md:fixed md:right-8 md:top-24 md:w-80 md:max-h-[calc(100vh-8rem)] md:overflow-y-auto bg-white rounded-lg border border-neutral-200/80 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Keranjang</h3>
              {cart.length === 0 ? (
                <p className="text-sm text-neutral-500 text-center py-8">Keranjang kosong</p>
              ) : (
                <>
                  <div className="space-y-4 mb-4">
                    {cart.map((item) => (
                      <div key={item.id} className="border-b border-neutral-100 pb-4 last:border-0">
                        <div className="flex items-start gap-3">
                              {item.image && (
                            <div className="w-16 h-16 relative shrink-0 rounded overflow-hidden bg-neutral-100">
                              <Image
                                src={item.image}
                                alt={item.menuName}
                                fill
                                className="object-cover object-center"
                                sizes="64px"
                                unoptimized
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-neutral-900 mb-1 line-clamp-1">
                              {item.menuName}
                            </h4>
                            <p className="text-xs text-neutral-500 mb-1">{item.kategori.jenis}</p>
                            {item.catatan && (
                              <p className="text-xs text-neutral-600 mb-2 italic">Catatan: {item.catatan}</p>
                            )}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, -1)}
                                  className="w-6 h-6 rounded border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50"
                                >
                                  -
                                </button>
                                <span className="text-sm font-medium text-neutral-900 w-6 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, 1)}
                                  className="w-6 h-6 rounded border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => handleRemoveFromCart(item.id)}
                                className="text-xs text-red-500 hover:text-red-700"
                              >
                                Hapus
                              </button>
                            </div>
                            <p className="text-sm font-semibold text-neutral-900 mt-2">
                              Rp {(item.kategori.harga * item.quantity).toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-neutral-200 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-base font-semibold text-neutral-900">Total</span>
                      <span className="text-xl font-bold text-neutral-900">
                        Rp {getCartTotal().toLocaleString('id-ID')}
                      </span>
                    </div>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="w-full bg-brand-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-brand transition-colors text-sm"
                    >
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </main>
        </>
      )}

      {/* Step 3: Review & Submit */}
      {currentStep === 3 && (
        <>
          <section className="bg-white border-b border-neutral-200/70">
            <div className="max-w-3xl mx-auto px-4 lg:px-0 py-10 md:py-14">
              <p className="text-[11px] font-medium tracking-[0.28em] uppercase text-neutral-500 text-center mb-3">
                Review & Submit
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 text-center">
                Review reservasi Anda
              </h1>
              <p className="text-sm md:text-[15px] leading-relaxed text-neutral-600 text-center mt-4 max-w-xl mx-auto">
                Periksa kembali data reservasi dan menu yang Anda pilih
              </p>
            </div>
          </section>

          <main className="max-w-3xl mx-auto px-4 lg:px-0 py-10 md:py-14">
            <div className="bg-white rounded-lg border border-neutral-200/80 p-6 md:p-8 space-y-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Form Data Review */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Data Reservasi</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Nama:</span>
                    <span className="text-neutral-900 font-medium">{formData.nama}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Email:</span>
                    <span className="text-neutral-900 font-medium">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">No. WhatsApp:</span>
                    <span className="text-neutral-900 font-medium">{formData.noWa}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Jumlah Orang:</span>
                    <span className="text-neutral-900 font-medium">{formData.jumlahOrang}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Tanggal:</span>
                    <span className="text-neutral-900 font-medium">
                      {new Date(formData.tanggalReservasi).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Jam:</span>
                    <span className="text-neutral-900 font-medium">{formData.jam || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Tempat:</span>
                    <span className="text-neutral-900 font-medium">{formData.tempat}</span>
                  </div>
                </div>
              </div>

              {/* Menu Review */}
              {cart.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Menu yang Dipilih</h3>
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between pb-4 border-b border-neutral-100 last:border-0">
                        <div className="flex items-center gap-3 flex-1">
                              {item.image && (
                            <div className="w-16 h-16 relative shrink-0 rounded overflow-hidden bg-neutral-100">
                              <Image
                                src={item.image}
                                alt={item.menuName}
                                fill
                                className="object-cover object-center"
                                sizes="64px"
                                unoptimized
                              />
                            </div>
                          )}
                          <div>
                            <h4 className="text-sm font-semibold text-neutral-900">{item.menuName}</h4>
                            <p className="text-xs text-neutral-500">{item.kategori.jenis}</p>
                            <p className="text-xs text-neutral-500">x{item.quantity}</p>
                            {item.catatan && (
                              <p className="text-xs text-neutral-600 mt-1 italic">Catatan: {item.catatan}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-neutral-900">
                          Rp {(item.kategori.harga * item.quantity).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-neutral-200 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-600">Subtotal</span>
                      <span className="text-neutral-900 font-medium">
                        Rp {getCartTotal().toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-600">Service Fee (2%)</span>
                      <span className="text-neutral-900 font-medium">
                        Rp {getServiceFee().toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-neutral-200">
                      <span className="text-base font-semibold text-neutral-900">Total</span>
                      <span className="text-xl font-bold text-neutral-900">
                        Rp {getGrandTotal().toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Catatan Review */}
              <div>
                <label htmlFor="catatanReview" className="block text-sm font-medium text-neutral-900 mb-2">
                  Catatan (Opsional)
                </label>
                <textarea
                  id="catatanReview"
                  value={catatanReview}
                  onChange={(e) => setCatatanReview(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm resize-none"
                  placeholder="Tambahkan catatan khusus untuk reservasi Anda (opsional)"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 bg-neutral-100 text-neutral-900 px-6 py-3 rounded-lg font-medium hover:bg-neutral-200 transition-colors text-sm"
                >
                  Kembali
                </button>
                <button
                  onClick={async () => {
                    if (submitting) return;
                    
                    setSubmitting(true);
                    setError('');

                    try {
                      // Format data untuk spreadsheet
                      const menuItems = formatMenuItems(cart);
                      const idWa = formatWhatsAppId(formData.noWa);
                      const totalHarga = getGrandTotal();

                      // Submit ke Google Sheets
                      const response = await fetch('/api/reservasi', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          nama: formData.nama,
                          jumlahOrang: formData.jumlahOrang,
                          tempat: formData.tempat,
                          tanggal: formData.tanggalReservasi,
                          jam: formData.jam,
                          menu: menuItems,
                          totalHarga: totalHarga,
                          idWa: idWa,
                          noWa: formData.noWa,
                          catatan: catatanReview,
                        }),
                      });

                      if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        const errorMessage = errorData.details || errorData.error || 'Failed to submit reservation';
                        console.error('API Error:', errorData);
                        throw new Error(errorMessage);
                      }

                      // Show payment modal
                      setShowPaymentModal(true);
                      setSubmitting(false);
                    } catch (err: any) {
                      console.error('Failed to submit reservation:', err);
                      setError(err.message || 'Gagal mengirim reservasi. Silakan coba lagi.');
                      setSubmitting(false);
                    }
                  }}
                  disabled={submitting}
                  className={`flex-1 bg-brand-dark text-white px-6 py-3 rounded-lg font-medium transition-colors text-sm ${
                    submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand'
                  }`}
                >
                  {submitting ? 'Mengirim...' : 'Kirim Reservasi'}
                </button>
              </div>
            </div>
          </main>
        </>
      )}

      {/* Modal: Pilih Kategori */}
      {showKategoriModal && selectedMenuItem && (
        <div className="fixed inset-0 bg-[rgba(41,4,4,0.55)] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">{selectedMenuItem.name}</h3>
              <button
                onClick={() => {
                  setShowKategoriModal(false);
                  setSelectedMenuItem(null);
                  setSelectedKategori(null);
                  setModalCatatan('');
                  setModalQuantity('');
                }}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-neutral-500 mb-4">{selectedMenuItem.description}</p>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-neutral-900 mb-3">Pilih Kategori:</p>
                {selectedMenuItem.kategori.map((kat, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectKategori(kat)}
                    className={`w-full text-left p-4 border rounded-lg transition-colors mb-2 ${
                      selectedKategori?.jenis === kat.jenis
                        ? 'border-brand-dark bg-neutral-50'
                        : 'border-neutral-200 hover:border-brand-dark hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-900">{kat.jenis}</span>
                      <span className="text-sm font-semibold text-neutral-900">
                        Rp {kat.harga.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <div>
                <label htmlFor="jumlah" className="block text-sm font-medium text-neutral-900 mb-2">
                  Jumlah <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const current = typeof modalQuantity === 'number' ? modalQuantity : 0;
                      setModalQuantity(Math.max(1, current - 1));
                    }}
                    className="w-10 h-10 flex items-center justify-center border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-neutral-600 hover:text-brand-dark"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    id="jumlah"
                    min="1"
                    value={modalQuantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      setModalQuantity(value === '' ? '' : Math.max(1, parseInt(value) || 1));
                    }}
                    className="flex-1 px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm text-center"
                    placeholder="Masukkan jumlah"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const current = typeof modalQuantity === 'number' ? modalQuantity : 0;
                      setModalQuantity(current + 1);
                    }}
                    className="w-10 h-10 flex items-center justify-center border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-neutral-600 hover:text-brand-dark"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="catatan" className="block text-sm font-medium text-neutral-900 mb-2">
                  Catatan (Opsional)
                </label>
                <textarea
                  id="catatan"
                  value={modalCatatan}
                  onChange={(e) => setModalCatatan(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm resize-none"
                  placeholder="Contoh: Kurang manis, tanpa es, dll"
                />
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!selectedKategori || modalQuantity === '' || (typeof modalQuantity === 'number' && modalQuantity < 1)}
                className={`w-full px-6 py-3 rounded-lg font-medium transition-colors text-sm ${
                  selectedKategori && modalQuantity !== '' && typeof modalQuantity === 'number' && modalQuantity >= 1
                    ? 'bg-brand-dark text-white hover:bg-brand'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              >
                Tambah ke Keranjang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Cart Detail (Mobile) */}
      {showCartModal && (
        <div className="md:hidden fixed inset-0 bg-[rgba(41,4,4,0.55)] z-50" onClick={() => setShowCartModal(false)}>
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">Keranjang</h3>
              <button
                onClick={() => setShowCartModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              {cart.length === 0 ? (
                <p className="text-sm text-neutral-500 text-center py-8">Keranjang kosong</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="border-b border-neutral-100 pb-4 last:border-0">
                        <div className="flex items-start gap-3">
                          {item.image && (
                            <div className="w-16 h-16 relative shrink-0 rounded overflow-hidden bg-neutral-100">
                              <Image
                                src={item.image}
                                alt={item.menuName}
                                fill
                                className="object-cover"
                                sizes="64px"
                                unoptimized
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-neutral-900 mb-1 line-clamp-1">
                              {item.menuName}
                            </h4>
                            <p className="text-xs text-neutral-500 mb-1">{item.kategori.jenis}</p>
                            {item.catatan && (
                              <p className="text-xs text-neutral-600 mb-2 italic">Catatan: {item.catatan}</p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, -1)}
                                  className="w-7 h-7 rounded border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50"
                                >
                                  -
                                </button>
                                <span className="text-sm font-medium text-neutral-900 w-8 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, 1)}
                                  className="w-7 h-7 rounded border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => handleRemoveFromCart(item.id)}
                                className="text-xs text-red-500 hover:text-red-700 px-2 py-1"
                              >
                                Hapus
                              </button>
                            </div>
                            <p className="text-sm font-semibold text-neutral-900 mt-2">
                              Rp {(item.kategori.harga * item.quantity).toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-neutral-200 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-base font-semibold text-neutral-900">Total</span>
                      <span className="text-xl font-bold text-neutral-900">
                        Rp {getCartTotal().toLocaleString('id-ID')}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setShowCartModal(false);
                        setCurrentStep(3);
                      }}
                      className="w-full bg-brand-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-brand transition-colors text-sm"
                    >
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Pembayaran */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-[rgba(41,4,4,0.55)] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">Pembayaran</h3>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  // Clear localStorage and reset form after payment modal closes
                  localStorage.removeItem('reservasi_form');
                  localStorage.removeItem('reservasi_cart');
                  localStorage.removeItem('reservasi_step');
                  
                    setFormData({
                      nama: '',
                      email: '',
                      noWa: '',
                      jumlahOrang: '',
                      tanggalReservasi: '',
                      jam: '',
                      tempat: '',
                    });
                  setCart([]);
                  setCatatanReview('');
                  setCurrentStep(1);
                }}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Pilihan Pembayaran */}
              <div>
                <p className="text-sm font-medium text-neutral-900 mb-3">Pilih Tipe Pembayaran:</p>
                <div className="space-y-2">
                  <button
                    onClick={() => setPaymentType('lunas')}
                    className={`w-full text-left p-4 border rounded-lg transition-colors ${
                      paymentType === 'lunas'
                        ? 'border-brand-dark bg-neutral-50'
                        : 'border-neutral-200 hover:border-brand-dark hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-900">Lunas</span>
                      <span className="text-sm font-semibold text-neutral-900">
                        Rp {getGrandTotal().toLocaleString('id-ID')}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => setPaymentType('dp')}
                    className={`w-full text-left p-4 border rounded-lg transition-colors ${
                      paymentType === 'dp'
                        ? 'border-brand-dark bg-neutral-50'
                        : 'border-neutral-200 hover:border-brand-dark hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-900">DP (50%)</span>
                      <span className="text-sm font-semibold text-neutral-900">
                        Rp {Math.round(getGrandTotal() * 0.5).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* QRIS Image */}
              <div className="pt-4 border-t border-neutral-200">
                <div className="flex justify-center mb-4">
                  <div className="w-64 h-64 relative bg-neutral-100 rounded-lg overflow-hidden">
                    <Image
                      src="/QR.png"
                      alt="QRIS Payment"
                      fill
                      className="object-contain p-4"
                      sizes="256px"
                    />
                  </div>
                </div>
              </div>

              {/* Pesan */}
              <div className="bg-neutral-50 rounded-lg p-4 text-sm text-neutral-700">
                <p className="mb-2">Silakan kirim bukti pembayaran Anda ke WhatsApp berikut:</p>
              </div>

              {/* Button Kirim WA */}
              <a
                href={siteContent.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors text-sm text-center"
              >
                Kirim WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
