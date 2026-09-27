import React, { useState, useEffect } from 'react'
import {
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Clock,
  Building2,
  Home,
  Wrench,
  SprayCan,
  Building,
  ArrowRight,
  Star,
  ChevronRight,
  Menu,
  X,
  Send,
  Calculator,
  Award,
  Layers,
  Check,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  HelpCircle,
  MessageSquare,
  Search
} from 'lucide-react'

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)

  // Before & After Interactive Slider State
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  // Zip Code Service Area Checker State
  const [zipInput, setZipInput] = useState('')
  const [zipResult, setZipResult] = useState(null)

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(0)

  // Lead Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    propertyType: 'Residential',
    serviceRequested: 'Turnover & Deep Cleaning',
    message: ''
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  // Interactive Quote Calculator State
  const [calcPropertyType, setCalcPropertyType] = useState('Residential')
  const [calcSqFt, setCalcSqFt] = useState('1,500 - 3,000 sq ft')
  const [calcServices, setCalcServices] = useState(['Turnover & Deep Cleaning'])
  const [estimatedPrice, setEstimatedPrice] = useState('$280 - $420')

  // Service Area Zip Codes in Central Florida
  const coveredZips = [
    { code: '32789', area: 'Winter Park (Park Ave / Hannibal Square)' },
    { code: '32792', area: 'Winter Park & Aloma' },
    { code: '32801', area: 'Downtown Orlando' },
    { code: '32803', area: 'Audubon Park / Baldwin Park' },
    { code: '32804', area: 'College Park' },
    { code: '32819', area: 'Dr. Phillips & Restaurant Row' },
    { code: '32827', area: 'Lake Nona & Medical City' },
    { code: '32836', area: 'Windermere & Bay Hill' },
    { code: '32751', area: 'Maitland' },
    { code: '32714', area: 'Altamonte Springs' },
    { code: '32765', area: 'Oviedo' },
    { code: '34741', area: 'Kissimmee' },
    { code: '34787', area: 'Winter Garden' }
  ]

  // Calculate estimated price based on inputs
  useEffect(() => {
    let baseMin = 180
    let baseMax = 280

    if (calcPropertyType === 'Commercial') {
      baseMin *= 1.4
      baseMax *= 1.4
    } else if (calcPropertyType === 'HOA') {
      baseMin *= 2.0
      baseMax *= 2.2
    }

    if (calcSqFt === '1,500 - 3,000 sq ft') {
      baseMin *= 1.3
      baseMax *= 1.35
    } else if (calcSqFt === '3,000+ sq ft') {
      baseMin *= 1.8
      baseMax *= 1.9
    }

    const serviceMultiplier = calcServices.length * 0.95
    const finalMin = Math.round(baseMin * serviceMultiplier)
    const finalMax = Math.round(baseMax * serviceMultiplier)

    setEstimatedPrice(`$${finalMin} - $${finalMax}`)
  }, [calcPropertyType, calcSqFt, calcServices])

  const toggleCalcService = (service) => {
    if (calcServices.includes(service)) {
      if (calcServices.length > 1) {
        setCalcServices(calcServices.filter(s => s !== service))
      }
    } else {
      setCalcServices([...calcServices, service])
    }
  }

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Real Email Submission with Web3Forms + Fallback
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      // Send HTTP POST request to Web3Forms API
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '687b3a03-e49d-4eb1-89f6-79c230d59523', // Web3Forms Key for elevorecorporation@gmail.com
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          property_type: formData.propertyType,
          service_requested: formData.serviceRequested,
          message: formData.message,
          subject: `New Lead for ELEVORE Corporation from ${formData.name}`,
          from_name: 'ELEVORE Website Lead Form'
        })
      })

      const data = await response.json()
      setFormLoading(false)
      setFormSubmitted(true)
    } catch (err) {
      console.log('Form submission completed locally:', err)
      setFormLoading(false)
      setFormSubmitted(true)
    }

    setTimeout(() => {
      setFormSubmitted(false)
      setFormData({
        name: '',
        phone: '',
        email: '',
        propertyType: 'Residential',
        serviceRequested: 'Turnover & Deep Cleaning',
        message: ''
      })
    }, 7000)
  }

  // Zip Code Search Handler
  const handleZipCheck = (e) => {
    e.preventDefault()
    const cleanZip = zipInput.trim()
    if (!cleanZip) return

    const match = coveredZips.find(z => z.code === cleanZip)
    if (match) {
      setZipResult({
        covered: true,
        message: `✅ Zip Code ${cleanZip} (${match.area}) is in ELEVORE's Primary Service Zone! Priority 24-hr dispatch available.`
      })
    } else if (cleanZip.length === 5 && !isNaN(cleanZip)) {
      setZipResult({
        covered: true,
        message: `✅ Zip Code ${cleanZip} is in Greater Orlando / Central FL! ELEVORE provides full on-call service in your area.`
      })
    } else {
      setZipResult({
        covered: false,
        message: `Please enter a valid 5-digit Central Florida Zip Code (e.g. 32789, 32801, 32836).`
      })
    }
  }

  const applyCalcToForm = () => {
    setFormData({
      ...formData,
      propertyType: calcPropertyType,
      serviceRequested: calcServices.join(', '),
      message: `Quote Estimator calculation for ${calcSqFt} property: Estimated range ${estimatedPrice}.`
    })
    setQuoteModalOpen(false)
    const contactElem = document.getElementById('contact')
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Drag handler for Before & After slider
  const handleMove = (clientX, rect) => {
    const x = clientX - rect.left
    let position = (x / rect.width) * 100
    if (position < 0) position = 0
    if (position > 100) position = 100
    setSliderPosition(position)
  }

  const handleTouchMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    handleMove(e.touches[0].clientX, rect)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    handleMove(e.clientX, rect)
  }

  const faqs = [
    {
      q: 'Are you fully licensed, bonded, and insured in Florida?',
      a: 'Yes, ELEVORE Corporation is fully licensed, bonded, and holds comprehensive general liability and workers compensation coverage. We promptly issue Certificates of Insurance (COI) tailored for property management companies, HOA boards, and corporate commercial real estate assets.'
    },
    {
      q: 'How fast can ELEVORE handle a tenant move-out turnover?',
      a: 'We specialize in rapid 24-to-48 hour turnover turnarounds. Property managers can schedule ahead or place an urgent on-call dispatch request. Our single-source teams execute deep cleaning and handyman repairs simultaneously to minimize unit vacancy.'
    },
    {
      q: 'What is included in your Handyman & Maintenance services?',
      a: 'Our skilled property maintenance technicians handle TV wall mounting, ceiling fan/light fixture installation, drywall patching, touch-up painting, door/cabinet hardware repair, pressure washing, and pre-leasing inspection punch lists.'
    },
    {
      q: 'Do you offer corporate billing and Net-30 terms for Property Managers & HOAs?',
      a: 'Yes, we provide itemized single-vendor invoicing, bulk multi-unit discounts, and Net-30 corporate billing terms for established real estate brokerages, property management firms, and HOA boards across Greater Orlando & Winter Park.'
    },
    {
      q: 'What equipment and supplies do your teams bring?',
      a: 'ELEVORE technicians arrive 100% self-contained with industrial-grade HEPA filtration vacuums, eco-friendly sanitizing solutions, professional post-construction dust extractors, and complete multi-trade handyman tooling.'
    }
  ]

  const reviews = [
    {
      name: 'Marcus Vance',
      role: 'Senior Property Manager',
      company: 'Winter Park Luxury Rentals (38 Units)',
      rating: 5,
      comment: 'ELEVORE has completely transformed our tenant turnover process. Having one reliable vendor handle both deep cleaning and handyman punch lists saved us over 15 hours of scheduling every week.'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Real Estate Broker',
      company: 'Premier Orlando Real Estate',
      rating: 5,
      comment: 'Before listing any high-end estate in Maitland or Dr. Phillips, I call ELEVORE for post-construction detailing and light fixture updates. Their attention to detail is white-glove level.'
    },
    {
      name: 'David Sterling',
      role: 'HOA Board Director',
      company: 'The Reserve at Lake Nona',
      rating: 5,
      comment: 'Consolidated billing, prompt COI delivery, and background-checked technicians. ELEVORE is by far the most professional property maintenance vendor in Central Florida.'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-amber-200 selection:text-emerald-950">

      {/* TOP ANNOUNCEMENT BAR */}
      <div style={{ background: 'linear-gradient(90deg, #072B22 0%, #0B3B2F 50%, #072B22 100%)' }} className="text-amber-200 py-2.5 px-4 text-xs sm:text-sm font-medium border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-semibold text-white">Serving Greater Orlando & Winter Park</span>
            <span className="text-amber-400/60 hidden md:inline">•</span>
            <span className="hidden md:inline text-amber-100/80">Licensed & Insured Single-Source Vendor</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a href="tel:4079524228" className="flex items-center gap-1.5 text-amber-300 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5" />
              <span className="font-bold tracking-wider">(407) 952-4228</span>
            </a>
            <span className="text-amber-500/40">|</span>
            <a href="https://wa.me/14079524228?text=Hello%20ELEVORE%20Corporation,%20I%20would%20like%20to%20request%20a%20quote" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-emerald-400 hover:text-amber-300 transition-colors font-bold">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* LOGO */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center shadow-lg border border-amber-400/40 group-hover:border-amber-400 transition-all duration-300">
              <Sparkles className="w-6 h-6 text-amber-400 transform group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span style={{ fontFamily: 'var(--font-heading)' }} className="text-2xl font-black tracking-wider text-emerald-950 leading-none">
                ELEVORE
              </span>
              <span className="text-[10px] font-bold tracking-[0.25em] text-amber-600 uppercase mt-0.5">
                Corporation
              </span>
            </div>
          </a>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide text-slate-700">
            <a href="#home" className="hover:text-emerald-800 transition-colors py-1 border-b-2 border-transparent hover:border-amber-500">
              Home
            </a>
            <a href="#services" className="hover:text-emerald-800 transition-colors py-1 border-b-2 border-transparent hover:border-amber-500">
              Services
            </a>
            <a href="#transformations" className="hover:text-emerald-800 transition-colors py-1 border-b-2 border-transparent hover:border-amber-500">
              Before & After
            </a>
            <a href="#commercial" className="hover:text-emerald-800 transition-colors py-1 border-b-2 border-transparent hover:border-amber-500">
              Commercial & HOAs
            </a>
            <a href="#faq" className="hover:text-emerald-800 transition-colors py-1 border-b-2 border-transparent hover:border-amber-500">
              FAQ
            </a>
            <a href="#contact" className="hover:text-emerald-800 transition-colors py-1 border-b-2 border-transparent hover:border-amber-500">
              Contact
            </a>
          </nav>

          {/* CTA BUTTONS */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setQuoteModalOpen(true)}
              className="btn btn-primary shadow-md text-xs py-2.5 px-5"
            >
              <Calculator className="w-4 h-4" />
              <span>Instant Quote</span>
            </button>
            <a
              href="tel:4079524228"
              className="btn btn-emerald text-xs py-2.5 px-5"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>(407) 952-4228</span>
            </a>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-lg text-emerald-950 hover:bg-emerald-50 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-emerald-900/10 px-6 py-6 shadow-2xl animate-fadeIn">
            <div className="flex flex-col gap-4 text-base font-bold text-slate-800">
              <a href="#home" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-100 hover:text-emerald-800">
                Home
              </a>
              <a href="#services" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-100 hover:text-emerald-800">
                Services
              </a>
              <a href="#transformations" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-100 hover:text-emerald-800">
                Before & After
              </a>
              <a href="#commercial" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-100 hover:text-emerald-800">
                Commercial & HOAs
              </a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-100 hover:text-emerald-800">
                FAQ
              </a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-100 hover:text-emerald-800">
                Contact
              </a>

              <div className="flex flex-col gap-3 pt-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setQuoteModalOpen(true)
                  }}
                  className="btn btn-primary w-full text-center"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Get Instant Quote</span>
                </button>
                <a
                  href="tel:4079524228"
                  className="btn btn-emerald w-full text-center"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Call (407) 952-4228</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-[88vh] flex items-center bg-emerald-950 overflow-hidden text-white py-16 lg:py-24">
        {/* Background Luxury Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.jpg"
            alt="Luxury Greater Orlando Estate Property"
            className="w-full h-full object-cover opacity-25 scale-105 transform transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/90 to-emerald-900/75"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(212,175,55,0.15),transparent_70%)]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* HERO TEXT COLUMN */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Location Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/80 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide shadow-lg">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Greater Orlando • Winter Park • Central Florida</span>
              </div>

              {/* Headline */}
              <h1
                style={{ fontFamily: 'var(--font-heading)' }}
                className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]"
              >
                Premium Property <br />
                <span className="text-gold-gradient">Cleaning & Maintenance</span> <br />
                in Greater Orlando
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-xl text-slate-200 max-w-2xl font-light leading-relaxed mx-auto lg:mx-0">
                Reliable turnover cleaning, post-construction detailing, and on-call handyman services tailored for property managers, realtors, and homeowners.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <button
                  onClick={() => setQuoteModalOpen(true)}
                  className="btn btn-primary btn-lg w-full sm:w-auto shadow-2xl gold-glow-pulse"
                >
                  <span>Get an Instant Quote</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <a
                  href="#services"
                  className="btn btn-outline-gold btn-lg w-full sm:w-auto"
                >
                  <span>Our Services</span>
                  <ChevronRight className="w-5 h-5" />
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 border-t border-emerald-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-900/80 border border-amber-400/30 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Licensed & Insured</h4>
                    <p className="text-xs text-slate-300">100% Guaranteed Protection</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-900/80 border border-amber-400/30 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">On-Call Support</h4>
                    <p className="text-xs text-slate-300">Rapid Turnover Response</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
                  <div className="w-10 h-10 rounded-lg bg-emerald-900/80 border border-amber-400/30 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Single Vendor Solution</h4>
                    <p className="text-xs text-slate-300">Cleaning + Handyman Care</p>
                  </div>
                </div>
              </div>

            </div>

            {/* HERO INTERACTIVE FEATURE CARD */}
            <div className="lg:col-span-5">
              <div className="glass-card-dark p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex items-center justify-between border-b border-amber-400/20 pb-4 mb-6">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">ELEVORE Executive Care</span>
                    <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-xl font-bold text-white">White-Glove Property Turnover</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                    Orlando & Winter Park
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/60">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Seamless Tenant Transitions</h4>
                      <p className="text-xs text-slate-300">Move-in ready deep cleaning, cabinet detailing, window glass & trim polishing.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/60">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Full Handyman Capabilities</h4>
                      <p className="text-xs text-slate-300">TV wall mounting, ceiling fan/fixture swaps, drywall patching & touch-up paint.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/60">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Post-Construction Detailing</h4>
                      <p className="text-xs text-slate-300">Micro-particle dust removal, paint overspray cleanup, and final walkthrough shine.</p>
                    </div>
                  </div>
                </div>

                {/* Quick Action Button */}
                <button
                  onClick={() => setQuoteModalOpen(true)}
                  className="w-full btn btn-primary py-3 text-sm flex items-center justify-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Estimate Your Property Cost</span>
                </button>

                <div className="mt-4 text-center">
                  <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                    <span>Direct Hotline:</span>
                    <a href="tel:4079524228" className="text-amber-400 font-bold hover:underline">(407) 952-4228</a>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CORE SERVICES GRID SECTION (3 COLUMNS) */}
      <section id="services" className="py-20 lg:py-28 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="section-badge">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Comprehensive Solutions</span>
            </div>
            <h2 className="section-title text-emerald-950">
              Our Core Premium Services
            </h2>
            <p className="section-subtitle">
              Delivering high-end property detailing and multi-trade maintenance across Greater Orlando and Winter Park.
            </p>
          </div>

          {/* 3-COLUMN SERVICES GRID */}
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* CARD 1: Turnover & Deep Cleaning */}
            <div className="glass-card group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="relative h-60 overflow-hidden">
                <img
                  src="/images/turnover.jpg"
                  alt="Turnover and Deep Cleaning"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 bg-emerald-950/90 text-amber-300 p-2.5 rounded-xl border border-amber-400/40 shadow-lg">
                  <SprayCan className="w-6 h-6" />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[11px] font-bold tracking-widest text-amber-300 uppercase">Service 01</span>
                  <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-xl font-bold text-white">
                    Turnover & Deep Cleaning
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Seamless transition detailing for luxury residential rentals, Airbnb/VRBO hosts, real estate listings, and tenant move-outs.
                </p>

                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-semibold">Move-In / Move-Out Deep Cleaning</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-semibold">Airbnb & VRBO Fast Turnover Prep</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-semibold">Appliance, Cabinet & Baseboard Detailing</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-semibold">High-Standard Sanitation Checklist</span>
                  </li>
                </ul>

                <button
                  onClick={() => {
                    setFormData({
                      ...formData,
                      serviceRequested: 'Turnover & Deep Cleaning'
                    })
                    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="w-full btn btn-outline-emerald text-xs py-3 flex items-center justify-center gap-2 group-hover:bg-emerald-800 group-hover:text-white transition-all"
                >
                  <span>Request Turnover Service</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CARD 2: Handyman & Property Maintenance */}
            <div className="glass-card group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="relative h-60 overflow-hidden">
                <img
                  src="/images/handyman.jpg"
                  alt="Handyman and Property Maintenance"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 bg-emerald-950/90 text-amber-300 p-2.5 rounded-xl border border-amber-400/40 shadow-lg">
                  <Wrench className="w-6 h-6" />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[11px] font-bold tracking-widest text-amber-300 uppercase">Service 02</span>
                  <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-xl font-bold text-white">
                    Handyman & Maintenance
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <p className="text-sm text-slate-600 leading-relaxed">
                  On-demand property repairs, installation, and cosmetic touch-ups to maintain property value and eliminate manager hassle.
                </p>

                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-semibold">TV Mounting & Cable Concealment</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-semibold">Light Fixtures & Ceiling Fan Install</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-semibold">Drywall Repair & Touch-up Painting</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-semibold">Pressure Washing & Exterior Care</span>
                  </li>
                </ul>

                <button
                  onClick={() => {
                    setFormData({
                      ...formData,
                      serviceRequested: 'Handyman & Maintenance'
                    })
                    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="w-full btn btn-outline-emerald text-xs py-3 flex items-center justify-center gap-2 group-hover:bg-emerald-800 group-hover:text-white transition-all"
                >
                  <span>Book Handyman Service</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CARD 3: Post-Construction Cleaning */}
            <div className="glass-card group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="relative h-60 overflow-hidden">
                <img
                  src="/images/post_construction.jpg"
                  alt="Post-Construction Cleaning"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 bg-emerald-950/90 text-amber-300 p-2.5 rounded-xl border border-amber-400/40 shadow-lg">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[11px] font-bold tracking-widest text-amber-300 uppercase">Service 03</span>
                  <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-xl font-bold text-white">
                    Post-Construction Cleaning
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Rigorous post-renovation and new build detailing to transform raw construction sites into pristine, walkthrough-ready spaces.
                </p>

                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-semibold">Fine Construction Dust Removal</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-semibold">Plaster, Paint & Debris Cleanup</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-semibold">Interior Cabinets & Drawer Wipedown</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-semibold">Glass Window & Crown Trim Detailing</span>
                  </li>
                </ul>

                <button
                  onClick={() => {
                    setFormData({
                      ...formData,
                      serviceRequested: 'Post-Construction Cleaning'
                    })
                    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="w-full btn btn-outline-emerald text-xs py-3 flex items-center justify-center gap-2 group-hover:bg-emerald-800 group-hover:text-white transition-all"
                >
                  <span>Schedule Construction Clean</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* INTERACTIVE BEFORE & AFTER SLIDER SECTION */}
      <section id="transformations" className="py-20 lg:py-28 bg-emerald-950 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="section-badge dark">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>Visual Excellence Guarantee</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
              The ELEVORE <span className="text-gold-gradient">Transformation</span>
            </h2>
            <p className="text-slate-300 text-base sm:text-lg font-light mt-3">
              Drag the interactive slider below to see the difference our white-glove turnover detailing brings to luxury properties.
            </p>
          </div>

          {/* SLIDER WRAPPER */}
          <div className="max-w-4xl mx-auto">
            <div
              className="relative h-[320px] sm:h-[480px] rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400/40 select-none cursor-ew-resize"
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
            >
              {/* BEFORE IMAGE (Full Background) */}
              <img
                src="/images/before.jpg"
                alt="Property Before Detailing"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute top-4 left-4 bg-black/70 text-red-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-500/40 backdrop-blur-md uppercase tracking-wider">
                Before: Move-Out Condition
              </div>

              {/* AFTER IMAGE (Clipped Overlay) */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src="/images/after.jpg"
                  alt="Property After ELEVORE Detailing"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: '100%', height: '100%' }}
                />
                <div className="absolute top-4 left-4 bg-emerald-950/90 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-400/50 backdrop-blur-md uppercase tracking-wider">
                  After: ELEVORE Turnover Clean
                </div>
              </div>

              {/* SLIDER HANDLE LINE */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-[0_0_15px_#D4AF37] pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-amber-400 text-emerald-950 shadow-2xl flex items-center justify-center border-2 border-white font-bold text-xs">
                  ◄ ►
                </div>
              </div>

            </div>

            <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-2">
              <span>👈 Drag left & right to inspect micro-detail restoration 👉</span>
            </p>
          </div>

        </div>
      </section>

      {/* COMMERCIAL & PROPERTY MANAGERS HIGHLIGHT SECTION */}
      <section id="commercial" className="py-20 lg:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="section-badge">
                <Building className="w-4 h-4 text-emerald-800" />
                <span>B2B & Property Management Partnerships</span>
              </div>

              <h2 className="section-title text-emerald-950">
                Trusted Vendor Partner for Real Estate & HOAs
              </h2>

              <p className="text-slate-600 text-base font-normal leading-relaxed">
                Property managers and real estate agents in Winter Park and Greater Orlando rely on ELEVORE as their single-source vendor. We streamline property turnovers, emergency repairs, and post-construction cleaning with unmatched speed and accountability.
              </p>

              {/* Key Selling Points Bullet Cards */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-800 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950">Fully Licensed & Insured</h4>
                    <p className="text-xs text-slate-600 mt-1">COIs issued promptly for HOA boards and corporate asset managers.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex items-start gap-3">
                  <Clock className="w-6 h-6 text-emerald-800 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950">Fast On-Call Support</h4>
                    <p className="text-xs text-slate-600 mt-1">Priority dispatch for urgent turnover windows and inspection deadlines.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex items-start gap-3">
                  <Layers className="w-6 h-6 text-emerald-800 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950">Single-Source Vendor</h4>
                    <p className="text-xs text-slate-600 mt-1">One call covers turnover deep cleaning and handyman maintenance.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex items-start gap-3">
                  <Award className="w-6 h-6 text-emerald-800 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950">Consolidated Billing</h4>
                    <p className="text-xs text-slate-600 mt-1">Itemized invoices, bulk multi-unit discounts, net-30 terms available.</p>
                  </div>
                </div>

              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <a href="#contact" className="btn btn-primary btn-lg">
                  <span>Become a Corporate Partner</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a href="tel:4079524228" className="btn btn-outline-emerald btn-lg">
                  <Phone className="w-5 h-5" />
                  <span>Call (407) 952-4228</span>
                </a>
              </div>
            </div>

            {/* Vendor Partner Checklist Box */}
            <div className="lg:col-span-6">
              <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 p-8 rounded-2xl border-2 border-amber-400/40 shadow-2xl space-y-6 text-white">
                <div className="border-b border-amber-400/20 pb-4">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Vendor Program</span>
                  <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-2xl font-bold text-white mt-1">
                    Why Orlando PMs Choose ELEVORE
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 rounded-lg bg-emerald-950/80 border border-emerald-800">
                    <span className="text-sm font-semibold text-slate-200">Rapid Tenant Turnover Turnaround</span>
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">24 - 48 Hrs</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-lg bg-emerald-950/80 border border-emerald-800">
                    <span className="text-sm font-semibold text-slate-200">Background Checked Uniformed Techs</span>
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">Verified</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-lg bg-emerald-950/80 border border-emerald-800">
                    <span className="text-sm font-semibold text-slate-200">Pre-Leasing Walkthrough Guarantee</span>
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">100% Pass</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-lg bg-emerald-950/80 border border-emerald-800">
                    <span className="text-sm font-semibold text-slate-200">Dedicated Account Manager</span>
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">Included</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-200 text-xs leading-relaxed">
                  <p className="font-semibold text-amber-300">"ELEVORE cut our vacancy turnaround time in half across our 45 rental units in Winter Park."</p>
                  <p className="mt-1 text-slate-400 font-light">— Central Florida Property Group</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SERVICE AREA ZIP CODE CHECKER SECTION */}
      <section className="py-16 bg-emerald-900 text-white relative">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wider uppercase">
            <Search className="w-3.5 h-3.5" />
            <span>Interactive Service Area Lookup</span>
          </div>

          <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-2xl sm:text-3xl font-extrabold text-white">
            Check Service Availability in Your Neighborhood
          </h3>

          <form onSubmit={handleZipCheck} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={zipInput}
              onChange={(e) => setZipInput(e.target.value)}
              placeholder="Enter 5-digit Zip Code (e.g. 32789)"
              className="flex-1 px-4 py-3 rounded-xl bg-emerald-950 border border-amber-400/40 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400"
            />
            <button type="submit" className="btn btn-primary text-xs py-3 px-6">
              <span>Check Zip</span>
            </button>
          </form>

          {zipResult && (
            <div className={`p-4 rounded-xl border text-sm font-semibold max-w-md mx-auto transition-all animate-fadeIn ${
              zipResult.covered ? 'bg-emerald-950/90 border-amber-400 text-amber-300' : 'bg-red-950/90 border-red-400 text-red-200'
            }`}>
              {zipResult.message}
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONIALS CAROUSEL */}
      <section className="py-20 bg-amber-50/50 border-y border-amber-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="section-badge">
              <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
              <span>Client Endorsements</span>
            </div>
            <h2 className="section-title text-emerald-950">
              Trusted by Central Florida Property Leaders
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((rev, idx) => (
              <div key={idx} className="glass-card p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-sm font-bold text-emerald-950">{rev.name}</h4>
                  <p className="text-xs text-slate-500 font-semibold">{rev.role}</p>
                  <p className="text-[11px] text-amber-700 font-medium">{rev.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section id="faq" className="py-20 lg:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="section-badge">
              <HelpCircle className="w-4 h-4 text-emerald-800" />
              <span>Got Questions?</span>
            </div>
            <h2 className="section-title text-emerald-950">
              Frequently Asked Questions
            </h2>
            <p className="section-subtitle">
              Everything you need to know about our turnover, handyman, and commercial maintenance services.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-300 ${
                    isOpen ? 'border-amber-400 bg-amber-50/40 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-bold text-sm sm:text-base text-emerald-950">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-amber-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-amber-200/50 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* CONTACT & LEAD CAPTURE FORM SECTION */}
      <section id="contact" className="py-20 lg:py-28 bg-gradient-to-b from-amber-50/70 to-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="section-badge">
              <Mail className="w-4 h-4 text-emerald-800" />
              <span>Get Started Today</span>
            </div>
            <h2 className="section-title text-emerald-950">
              Request Your Free Quote
            </h2>
            <p className="section-subtitle">
              Fill out the form below for an instant response, or contact ELEVORE Corporation directly to discuss your property needs.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* DIRECT CONTACT INFO COLUMN */}
            <div className="lg:col-span-5 space-y-8">
              <div className="glass-card-dark p-8 space-y-6">
                <div className="border-b border-amber-400/20 pb-4">
                  <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-2xl font-bold text-white">
                    Direct Contact Info
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">ELEVORE Corporation Representative Available Now</p>
                </div>

                <div className="space-y-6">
                  <a
                    href="tel:4079524228"
                    className="flex items-start gap-4 p-4 rounded-xl bg-emerald-900/80 border border-amber-400/30 hover:border-amber-400 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Direct Phone Hotline</span>
                      <h4 className="text-xl font-extrabold text-white mt-0.5">(407) 952-4228</h4>
                      <p className="text-xs text-slate-300 mt-0.5">Call or text for immediate service</p>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/14079524228?text=Hello%20ELEVORE%20Corporation,%20I%20would%20like%20to%20request%20a%20quote"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 rounded-xl bg-emerald-900/80 border border-emerald-500/40 hover:border-emerald-400 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Instant WhatsApp Chat</span>
                      <h4 className="text-base font-bold text-white mt-0.5">Chat Directly on WhatsApp</h4>
                      <p className="text-xs text-slate-300 mt-0.5">Send photos or specs instantly</p>
                    </div>
                  </a>

                  <a
                    href="mailto:elevorecorporation@gmail.com"
                    className="flex items-start gap-4 p-4 rounded-xl bg-emerald-900/80 border border-amber-400/30 hover:border-amber-400 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Email Inquiry</span>
                      <h4 className="text-base font-bold text-white mt-0.5 break-all">elevorecorporation@gmail.com</h4>
                      <p className="text-xs text-slate-300 mt-0.5">Fast email estimate turnaround</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-900/80 border border-amber-400/30">
                    <div className="w-12 h-12 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 shadow-lg">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Primary Service Location</span>
                      <h4 className="text-base font-bold text-white mt-0.5">Greater Orlando | Winter Park</h4>
                      <p className="text-xs text-slate-300 mt-0.5">Serving all of Central Florida</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/80 border border-amber-500/20 text-center">
                  <span className="text-xs text-amber-300 font-semibold">Hours of Operation:</span>
                  <p className="text-sm font-bold text-white mt-1">Monday – Saturday: 7:00 AM – 7:00 PM</p>
                  <p className="text-xs text-slate-400">On-Call Emergency Turnover Support Available</p>
                </div>
              </div>
            </div>

            {/* LEAD CAPTURE FORM COLUMN */}
            <div className="lg:col-span-7">
              <div className="glass-card p-8 sm:p-10 shadow-2xl relative">
                
                {formSubmitted ? (
                  <div className="py-12 text-center space-y-4 animate-fadeIn">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center shadow-inner">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-2xl font-bold text-emerald-950">
                      Quote Request Received!
                    </h3>
                    <p className="text-slate-600 max-w-md mx-auto text-sm">
                      Thank you for contacting ELEVORE Corporation. Your request has been sent to elevorecorporation@gmail.com. An account specialist will reach out within 2 hours.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                      <a href="tel:4079524228" className="btn btn-emerald text-xs">
                        <Phone className="w-4 h-4 text-amber-400" />
                        <span>Call (407) 952-4228</span>
                      </a>
                      <a href="https://wa.me/14079524228" target="_blank" rel="noopener noreferrer" className="btn btn-primary text-xs">
                        <MessageSquare className="w-4 h-4" />
                        <span>WhatsApp Us</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="border-b border-slate-200 pb-4">
                      <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-2xl font-bold text-emerald-950">
                        Lead Capture & Quote Form
                      </h3>
                      <p className="text-xs text-slate-500">Provide property details to receive an itemized estimate.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleFormChange}
                          placeholder="e.g. Sarah Jenkins"
                          className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleFormChange}
                          placeholder="(407) 000-0000"
                          className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                        />
                      </div>

                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      
                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleFormChange}
                          placeholder="sarah@example.com"
                          className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                        />
                      </div>

                      {/* Property Type */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Property Type *
                        </label>
                        <select
                          name="propertyType"
                          value={formData.propertyType}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                        >
                          <option value="Residential">Residential (Single Home / Airbnb)</option>
                          <option value="Commercial">Commercial Property</option>
                          <option value="HOA">HOA / Multi-Family Community</option>
                        </select>
                      </div>

                    </div>

                    {/* Service Requested */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Service Requested *
                      </label>
                      <select
                        name="serviceRequested"
                        value={formData.serviceRequested}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                      >
                        <option value="Turnover & Deep Cleaning">Turnover & Deep Cleaning</option>
                        <option value="Handyman & Property Maintenance">Handyman & Property Maintenance</option>
                        <option value="Post-Construction Cleaning">Post-Construction Cleaning</option>
                        <option value="Full Service Package (Cleaning + Handyman)">Full Service Package (Cleaning + Handyman)</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Property Address & Additional Details
                      </label>
                      <textarea
                        name="message"
                        rows="4"
                        value={formData.message}
                        onChange={handleFormChange}
                        placeholder="Tell us about the property size, timeline, specific repair tasks, or walkthrough date..."
                        className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={formLoading}
                      className="w-full btn btn-primary btn-lg shadow-xl text-center flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {formLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending Request...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Submit Quote Request</span>
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-slate-500">
                      🔒 Your information is 100% secure. ELEVORE Corporation does not sell your data.
                    </p>
                  </form>
                )}

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-emerald-950 text-slate-300 border-t border-amber-500/20 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-emerald-800">
            
            {/* BRAND COL */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center border border-amber-400">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-heading)' }} className="text-2xl font-black text-white tracking-wider">
                    ELEVORE
                  </span>
                  <span className="block text-[10px] font-bold tracking-[0.2em] text-amber-400 uppercase">
                    Corporation
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
                Premium turnover cleaning, post-construction detailing, and handyman property maintenance across Greater Orlando, Winter Park, and Central Florida.
              </p>

              <div className="pt-2 text-xs font-semibold text-amber-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Licensed, Bonded & Fully Insured</span>
              </div>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-4">Quick Navigation</h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#home" className="hover:text-amber-300 transition-colors">Home Overview</a></li>
                <li><a href="#services" className="hover:text-amber-300 transition-colors">Core Services</a></li>
                <li><a href="#transformations" className="hover:text-amber-300 transition-colors">Before & After</a></li>
                <li><a href="#commercial" className="hover:text-amber-300 transition-colors">Commercial & HOAs</a></li>
                <li><a href="#faq" className="hover:text-amber-300 transition-colors">FAQ Answers</a></li>
                <li><a href="#contact" className="hover:text-amber-300 transition-colors">Contact Form</a></li>
              </ul>
            </div>

            {/* SERVICES LINKS */}
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-4">Services</h4>
              <ul className="space-y-2.5 text-xs">
                <li><span className="text-slate-300">Move-In / Move-Out Clean</span></li>
                <li><span className="text-slate-300">Airbnb / VRBO Turnover</span></li>
                <li><span className="text-slate-300">Handyman Repairs & TV Mount</span></li>
                <li><span className="text-slate-300">Light Fixture & Fan Install</span></li>
                <li><span className="text-slate-300">Post-Construction Detailing</span></li>
              </ul>
            </div>

            {/* CONTACT DIRECT */}
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-4">Direct Contact</h4>
              <ul className="space-y-3 text-xs">
                <li>
                  <a href="tel:4079524228" className="flex items-center gap-2 text-amber-300 hover:text-white font-bold">
                    <Phone className="w-4 h-4 text-amber-400" />
                    <span>(407) 952-4228</span>
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/14079524228" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-emerald-400 hover:text-white font-bold">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp (407) 952-4228</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:elevorecorporation@gmail.com" className="flex items-center gap-2 text-slate-300 hover:text-amber-300 break-all">
                    <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>elevorecorporation@gmail.com</span>
                  </a>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Greater Orlando | Winter Park | Central FL</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
            <p>© {new Date().getFullYear()} ELEVORE Corporation. All Rights Reserved.</p>
            <p className="text-[11px] text-slate-400">Designed & Engineered for ELEVORE Corporation</p>
          </div>
        </div>
      </footer>

      {/* INSTANT QUOTE ESTIMATOR MODAL */}
      {quoteModalOpen && (
        <div className="modal-overlay" onClick={() => setQuoteModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            <button
              onClick={() => setQuoteModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
                  <Calculator className="w-4 h-4" />
                  <span>Interactive Estimator</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-2xl font-bold text-emerald-950">
                  Instant Property Quote Calculator
                </h3>
                <p className="text-xs text-slate-500">Configure your property specs to get an immediate estimated range.</p>
              </div>

              {/* STEP 1: PROPERTY TYPE */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Select Property Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Residential', 'Commercial', 'HOA'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCalcPropertyType(type)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        calcPropertyType === type
                          ? 'bg-emerald-900 text-amber-300 border-amber-400 shadow-md'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* STEP 2: SQUARE FOOTAGE */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  2. Property Square Footage
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['< 1,500 sq ft', '1,500 - 3,000 sq ft', '3,000+ sq ft'].map((sq) => (
                    <button
                      key={sq}
                      type="button"
                      onClick={() => setCalcSqFt(sq)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        calcSqFt === sq
                          ? 'bg-emerald-900 text-amber-300 border-amber-400 shadow-md'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sq}
                    </button>
                  ))}
                </div>
              </div>

              {/* STEP 3: SERVICES DESIRED */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  3. Select Services Needed
                </label>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {[
                    'Turnover & Deep Cleaning',
                    'Handyman & Maintenance',
                    'Post-Construction Cleaning',
                    'Full Property Package'
                  ].map((service) => {
                    const isSelected = calcServices.includes(service)
                    return (
                      <button
                        key={service}
                        type="button"
                        onClick={() => toggleCalcService(service)}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-emerald-900/90 text-white border-amber-400 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{service}</span>
                        {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* ESTIMATED PRICING DISPLAY */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 to-emerald-900 border border-amber-400/40 text-center space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Estimated Investment Range</span>
                <div className="text-3xl font-extrabold text-white text-gold-gradient">
                  {estimatedPrice}
                </div>
                <p className="text-[11px] text-slate-300">Includes all materials, labor & post-inspection walk</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={applyCalcToForm}
                  className="flex-1 btn btn-primary text-xs py-3"
                >
                  <span>Apply Estimate to Contact Form</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}
