'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
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
import ReservationPlaceLayout from '@/components/ReservationPlaceLayout';
import { formatReservationPlaceLabel, reservationTablesById } from '@/data/reservationPlaces';

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
  { id: 'bundle' as MenuCategory, label: 'Bundle', icon: '' },
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
  const [showTimePicker, setShowTimePicker] = useState(false);
  const isNavigatingFromHistory = useRef(false);

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

  // Sync step with browser history - update URL when step changes
  useEffect(() => {
    if (isNavigatingFromHistory.current) {
      isNavigatingFromHistory.current = false;
      return;
    }

    const hash = `#step${currentStep}`;
    if (window.location.hash !== hash) {
      window.history.pushState({ step: currentStep }, '', hash);
    }
  }, [currentStep]);

  // Handle browser back/forward buttons
  useEffect(() => {
    // Check initial hash on mount
    const handleHashChange = () => {
      const hash = window.location.hash;
      const stepMatch = hash.match(/^#step([123])$/);
      if (stepMatch) {
        const step = parseInt(stepMatch[1]) as 1 | 2 | 3;
        if (step !== currentStep) {
          isNavigatingFromHistory.current = true;
          setCurrentStep(step);
        }
      } else if (!hash && currentStep !== 1) {
        // If no hash and not on step 1, set to step 1
        isNavigatingFromHistory.current = true;
        setCurrentStep(1);
      }
    };

    // Handle popstate (browser back/forward)
    const handlePopState = (e: PopStateEvent) => {
      isNavigatingFromHistory.current = true;
      if (e.state && e.state.step) {
        setCurrentStep(e.state.step);
      } else {
        // Parse from hash if state doesn't have step
        const hash = window.location.hash;
        const stepMatch = hash.match(/^#step([123])$/);
        if (stepMatch) {
          const step = parseInt(stepMatch[1]) as 1 | 2 | 3;
          setCurrentStep(step);
        } else if (!hash) {
          setCurrentStep(1);
        }
      }
    };

    // Initial check on mount
    if (window.location.hash) {
      handleHashChange();
    } else if (currentStep !== 1) {
      // If no hash but not on step 1, update URL
      window.history.replaceState({ step: currentStep }, '', `#step${currentStep}`);
    }

    // Listen to hash changes (when user manually changes URL)
    window.addEventListener('hashchange', handleHashChange);
    // Listen to popstate (browser back/forward)
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handlePopState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

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

        // `getAvailablePlaces` supports 2 modes:
        // - legacy: returns area keys ["Indoor","Semi Outdoor","Outdoor"]
        // - new sheet: returns table IDs ["A1","B1","G2"]
        const isAreaMode = places.some((p) => p === 'Indoor' || p === 'Semi Outdoor' || p === 'Outdoor');
        const availableTableIds = isAreaMode
          ? Object.keys(reservationTablesById).filter((id) => places.includes(reservationTablesById[id].areaKey))
          : places;

        setAvailablePlaces(availableTableIds);
        
        if (formData.tempat) {
          const selectedTable = reservationTablesById[formData.tempat];
          const invalidByAvailability = !selectedTable || !availableTableIds.includes(selectedTable.id);
          const invalidByCapacity =
            !selectedTable || jumlahOrangNum < selectedTable.minCapacity || jumlahOrangNum > selectedTable.maxCapacity;

          if (invalidByAvailability || invalidByCapacity) {
            setFormData((prev) => ({ ...prev, tempat: '' }));
          }
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
    // If date / people changes, reset selected table immediately to avoid stale selection.
    if (field === 'tanggalReservasi' || field === 'jumlahOrang') {
      setAvailablePlaces([]);
    }
    
    // Ensure jam 19 only allows minute 00
    if (field === 'jam' && typeof value === 'string' && value.includes(':')) {
      const [hour, minute] = value.split(':');
      if (hour === '19' && minute !== '00') {
        value = '19:00';
      }
    }
    
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'tanggalReservasi' || field === 'jumlahOrang' ? { tempat: '' } : {}),
    }));
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

  const handleBackStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    }
  };

  const handleMenuClick = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setModalCatatan('');
    setModalQuantity('');
    // Auto-select if there's only 1 option, otherwise let user choose.
    setSelectedKategori(item.kategori?.length === 1 ? item.kategori[0] : null);
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

  // Format menu untuk spreadsheet: menu-kategori-jumlah(catatan), menu-kategori-jumlah(catatan)
  const formatMenuItems = (cartItems: CartItem[]): string => {
    return cartItems.map((item) => {
      const base = `${item.menuName}-${item.kategori.jenis}-${item.quantity.toString()}`;
      return item.catatan ? `${base}(${item.catatan})` : base;
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

              <div className="relative">
                <label htmlFor="jam" className="block text-sm font-medium text-neutral-900 mb-2">
                  Jam Reservasi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  
                  <input
                    type="text"
                    id="jam"
                    readOnly
                    value={formData.jam || '--:--'}
                    onClick={() => setShowTimePicker(!showTimePicker)}
                    required
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm cursor-pointer"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  {showTimePicker && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowTimePicker(false)}
                      />
                      <div className="absolute top-full left-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-20 p-4">
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="text-xs text-neutral-500 mb-2 font-medium">Jam</div>
                            <div className="overflow-y-auto max-h-48 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-neutral-100">
                              {[17, 18, 19].map((hour) => {
                                const hourStr = hour.toString().padStart(2, '0');
                                const isSelected = formData.jam && formData.jam.includes(':') ? formData.jam.split(':')[0] === hourStr : false;
                                return (
                                  <div
                                    key={hour}
                                    onClick={() => {
                                      // Jika jam 19 dipilih, otomatis set menit ke 00
                                      const minute = hour === 19 ? '00' : (formData.jam && formData.jam.includes(':') ? formData.jam.split(':')[1] || '00' : '00');
                                      handleInputChange('jam', `${hourStr}:${minute}`);
                                    }}
                                    className={`px-4 py-2 text-sm cursor-pointer rounded ${
                                      isSelected ? 'bg-brand text-white hover:bg-brand/90' : 'text-neutral-900 hover:bg-neutral-100'
                                    }`}
                                  >
                                    {hourStr}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="text-xs text-neutral-500 mb-2 font-medium">Menit</div>
                            <div className="overflow-y-auto max-h-48 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-neutral-100">
                              {Array.from({ length: 60 }, (_, i) => {
                                const minute = i.toString().padStart(2, '0');
                                const currentHour = formData.jam && formData.jam.includes(':') ? formData.jam.split(':')[0] : '';
                                const isSelected = formData.jam && formData.jam.includes(':') ? formData.jam.split(':')[1] === minute : false;
                                const isDisabled = currentHour === '19' && minute !== '00';
                                
                                return (
                                  <div
                                    key={minute}
                                    onClick={() => {
                                      if (isDisabled) return;
                                      const hour = formData.jam && formData.jam.includes(':') ? formData.jam.split(':')[0] : '17';
                                      handleInputChange('jam', `${hour}:${minute}`);
                                    }}
                                    className={`px-4 py-2 text-sm rounded ${
                                      isDisabled 
                                        ? 'text-neutral-300 cursor-not-allowed' 
                                        : `cursor-pointer rounded ${
                                            isSelected ? 'bg-brand text-white hover:bg-brand/90' : 'text-neutral-900 hover:bg-neutral-100'
                                          }`
                                    }`}
                                  >
                                    {minute}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="tempat" className="block text-sm font-medium text-neutral-900 mb-2">
                  Tempat <span className="text-red-500">*</span>
                </label>
                {loading && (
                  <div className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-sm text-neutral-500">
                    Memuat ketersediaan tempat...
                  </div>
                )}

                {!loading &&
                  availablePlaces.length === 0 &&
                  formData.tanggalReservasi &&
                  typeof formData.jumlahOrang === 'number' &&
                  formData.jumlahOrang > 0 && (
                    <div className="w-full px-4 py-3 border border-yellow-200 bg-yellow-50 rounded-lg text-sm text-yellow-700">
                      Tidak ada tempat yang tersedia untuk tanggal dan jumlah orang ini.
                    </div>
                  )}

                <div className="mt-3">
                  <ReservationPlaceLayout
                    value={formData.tempat}
                    onChange={(next) => handleInputChange('tempat', next)}
                    jumlahOrang={formData.jumlahOrang}
                    availableTableIds={availablePlaces}
                    disabled={
                      !formData.tanggalReservasi ||
                      typeof formData.jumlahOrang !== 'number' ||
                      formData.jumlahOrang <= 0 ||
                      (availablePlaces.length === 0 &&
                        formData.tanggalReservasi !== '' &&
                        typeof formData.jumlahOrang === 'number' &&
                        formData.jumlahOrang > 0)
                    }
                  />
                </div>

                <input id="tempat" name="tempat" type="hidden" value={formData.tempat} required />
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
              <div className="mb-6">
                <button
                  onClick={handleBackStep}
                  className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors text-sm font-medium mb-4"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Kembali ke Form Reservasi
                </button>
              </div>
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
              <div className="mb-6">
                <button
                  onClick={handleBackStep}
                  className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors text-sm font-medium mb-4"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Kembali ke Pilih Menu
                </button>
              </div>
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
                    <span className="text-neutral-900 font-medium">{formatReservationPlaceLabel(formData.tempat)}</span>
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

              {/* Metode Pembayaran (dipilih sebelum submit) */}
              <div className="rounded-lg border border-neutral-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">Metode Pembayaran</p>
                    <p className="text-xs text-neutral-500 mt-0.5">Pilih tipe pembayaran sebelum kirim reservasi.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-neutral-500">Nominal dibayar</p>
                    <p className="text-sm font-semibold text-neutral-900">
                      Rp {(paymentType === 'dp' ? Math.round(getGrandTotal() * 0.5) : getGrandTotal()).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentType('lunas')}
                    className={`w-full text-left px-4 py-3 border rounded-lg transition-colors ${
                      paymentType === 'lunas'
                        ? 'border-brand-dark bg-neutral-50'
                        : 'border-neutral-200 hover:border-brand-dark hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-900">Lunas</span>
                      <span className="text-sm font-semibold text-neutral-900">Rp {getGrandTotal().toLocaleString('id-ID')}</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType('dp')}
                    className={`w-full text-left px-4 py-3 border rounded-lg transition-colors ${
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

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleBackStep}
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
                          tempat: formatReservationPlaceLabel(formData.tempat),
                          tanggal: formData.tanggalReservasi,
                          jam: formData.jam,
                          menu: menuItems,
                          totalHarga: totalHarga,
                          idWa: idWa,
                          noWa: formData.noWa,
                          catatan: catatanReview,
                          paymentType,
                        }),
                      });

                      if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        const errorMessage = errorData.details || errorData.error || 'Failed to submit reservation';
                        console.error('API Error:', errorData);
                        throw new Error(errorMessage);
                      }

                      await response.json().catch(() => ({}));

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
              {selectedMenuItem.kategori.length > 1 ? (
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
              ) : (
                <div></div>
              )}
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
              <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
                <span className="text-sm font-medium text-neutral-700">Total Harga</span>
                <span className="text-sm font-semibold text-neutral-900">
                  Rp{' '}
                  {(
                    (selectedKategori?.harga ?? selectedMenuItem.kategori[0]?.harga ?? 0) *
                    (typeof modalQuantity === 'number' ? modalQuantity : 0)
                  ).toLocaleString('id-ID')}
                </span>
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
            <div className="flex items-start justify-between mb-4 gap-4">
              <div>
              <h3 className="text-lg font-semibold text-neutral-900">Pembayaran</h3>
                <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-6 w-6 p-2 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">
                      ✓
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold">Reservasi berhasil tercatat</p>
                      <p className="text-emerald-800/90 leading-relaxed">
                        Silakan pilih metode pembayaran di bawah, lalu <span className="font-semibold">konfirmasi ke admin.</span>{' '}<br />
                        Jika <span className="font-semibold">dalam waktu 30 menit</span> belum melakukan pembayaran dan konfirmasi ke admin, <span className="font-semibold">reservasi akan dibatalkan otomatis.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

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
              {/* Ringkasan Pembayaran */}
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                    <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-700">Tipe</span>
                      <span className="text-sm font-semibold text-neutral-900">
                    {paymentType === 'dp' ? 'DP (50%)' : 'Lunas'}
                      </span>
                    </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-700">Nominal dibayar</span>
                      <span className="text-sm font-semibold text-neutral-900">
                    Rp {(paymentType === 'dp' ? Math.round(getGrandTotal() * 0.5) : getGrandTotal()).toLocaleString('id-ID')}
                      </span>
                </div>
              </div>

              {/* QRIS Image */}
              <div className="pt-4 border-t border-neutral-200">
                <div className="flex justify-center mb-4">
                  <div className="w-full max-w-full rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
                    
                    <div className="px-24 py-0 my-0">
                      <div className="w-full h-20 relative rounded-lg overflow-hidden">
                        <Image
                          src="/images/logoqris.png"
                          alt="Logo QRIS"
                          fill
                          className="object-contain p-0"
                          sizes="288px"
                        />
                      </div>
                    </div>

                    <div className="px-4 pt-0 text-center">
                      <div className="text-[13px] font-extrabold tracking-[0.22em] text-neutral-900">
                        KASIKO RESERVASI, RNGKSBTN
                      </div>
                      <div className="mt-1 text-[12px] tracking-[0.18em] text-neutral-700">
                        NMID: ID1026484387844
                      </div>
                      <div className="mt-2 text-[12px] font-semibold tracking-[0.28em] text-neutral-900">
                        A01
                      </div>
                    </div>
                 

                    <div className="px-12 pb-4 pt-0">
                      <div className="aspect-square w-full relative bg-neutral-50 rounded-lg overflow-hidden">
                        <Image
                          src="/images/qris.png"
                          alt="QRIS Payment"
                          fill
                          className="object-contain p-0"
                          sizes="288px"
                        />
                      </div>
                    </div>
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
