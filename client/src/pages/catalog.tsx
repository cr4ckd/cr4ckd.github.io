import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Loader2, ShoppingBag, LogIn, Search, ChevronUp, Globe } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'ja', name: '日本語' },
];

const categories = {
  "Living Room": [
    "Sofas & Couches",
    "Sectionals",
    "Coffee Tables",
    "End Tables",
    "TV Stands & Media Consoles",
    "Recliners",
    "Accent Chairs",
    "Bookshelves",
    "Ottomans & Poufs"
  ],
  "Bedroom": [
    "Beds",
    "Nightstands",
    "Dressers & Chests",
    "Wardrobes & Armoires",
    "Bedside Tables",
    "Headboards",
    "Vanity Tables",
    "Mattresses"
  ],
  "Dining Room": [
    "Dining Tables",
    "Dining Chairs",
    "Bar Stools",
    "Buffets & Sideboards",
    "China Cabinets",
    "Benches"
  ],
  "Office": [
    "Desks",
    "Office Chairs",
    "Bookcases",
    "Filing Cabinets",
    "Conference Tables",
    "Shelving Units"
  ],
  "Outdoor": [
    "Patio Tables",
    "Outdoor Chairs",
    "Lounge Chairs",
    "Hammocks",
    "Outdoor Sofas",
    "Gazebos & Pergolas",
    "Fire Pits"
  ],
  "Storage": [
    "Cabinets & Cupboards",
    "Shoe Racks",
    "Coat Racks & Hall Trees",
    "Storage Bins & Baskets",
    "Floating Shelves"
  ],
  "Kids & Nursery": [
    "Cribs & Bassinets",
    "Kids' Beds & Bunk Beds",
    "Changing Tables",
    "Toy Storage",
    "Kids' Desks & Chairs"
  ],
  "Accent & Decor": [
    "Console Tables",
    "Accent Cabinets",
    "Mirrors",
    "Room Dividers"
  ]
};

export default function Catalog() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState(currencies[0]);
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatPrice = (price: number) => {
    const exchangeRates: Record<string, number> = {
      USD: 1,
      EUR: 0.92,
      GBP: 0.79,
      JPY: 147.58,
      AUD: 1.52,
      CAD: 1.35,
    };

    const convertedPrice = price * exchangeRates[currentCurrency.code];
    return new Intl.NumberFormat(currentLanguage.code, {
      style: 'currency',
      currency: currentCurrency.code,
    }).format(convertedPrice / 100);
  };

  const filteredProducts = selectedCategory
    ? products?.filter(p => p.category === selectedCategory)
    : products;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-end items-center h-10 gap-4 text-sm">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                  <Globe className="h-3 w-3" />
                  {currentLanguage.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setCurrentLanguage(lang)}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Currency Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                  {currentCurrency.symbol}
                  {currentCurrency.code}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {currencies.map((currency) => (
                  <DropdownMenuItem
                    key={currency.code}
                    onClick={() => setCurrentCurrency(currency)}
                  >
                    {currency.symbol} {currency.code} - {currency.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <h2 className="text-2xl font-light tracking-wide cursor-pointer">
                ISLA Living
              </h2>
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                {Object.entries(categories).map(([category, subcategories]) => (
                  <NavigationMenuItem key={category}>
                    <NavigationMenuTrigger className="text-sm font-light">
                      {category}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-2 p-4 md:w-[500px] md:grid-cols-2">
                        {subcategories.map((subcategory) => (
                          <li key={subcategory}>
                            <NavigationMenuLink asChild>
                              <a
                                onClick={() => setSelectedCategory(subcategory)}
                                className="block p-2 hover:bg-accent rounded-md text-sm cursor-pointer"
                              >
                                {subcategory}
                              </a>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
                <Search className="h-4 w-4" />
              </Button>
              {user?.isAdmin ? (
                <Link href="/admin">
                  <Button variant="ghost" className="text-sm font-light">Admin</Button>
                </Link>
              ) : (
                <Link href="/auth">
                  <Button variant="ghost" className="text-sm font-light">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Search Command Palette */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search for furniture..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {Object.entries(categories).map(([category, subcategories]) => (
            <CommandGroup key={category} heading={category}>
              {subcategories.map((subcategory) => (
                <CommandItem
                  key={subcategory}
                  onSelect={() => {
                    setSelectedCategory(subcategory);
                    setSearchOpen(false);
                  }}
                >
                  {subcategory}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>

      {/* Hero Section */}
      <header className="py-32 px-4 text-center bg-gradient-to-b from-primary/5">
        <h1 className="text-5xl md:text-6xl font-light tracking-wide text-primary">
          Island-Inspired Living
        </h1>
        <p className="mt-6 text-muted-foreground max-w-2xl mx-auto text-lg font-light leading-relaxed">
          Discover our curated collection of furniture that brings the serenity of coastal living to your home.
          {selectedCategory && (
            <>
              <br />
              <span className="text-primary">Browsing: {selectedCategory}</span>
            </>
          )}
        </p>
      </header>

      {/* Featured Collection */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-light tracking-wide mb-8">Featured Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products?.slice(0, 3).map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <Card className="cursor-pointer group hover:shadow-lg transition-all duration-500 border-0 bg-transparent">
                <div className="aspect-[4/5] overflow-hidden rounded-lg">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="px-2 pt-6">
                  <h3 className="text-xl font-light tracking-wide group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <main className="container mx-auto px-4 pb-32">
        <h2 className="text-2xl font-light tracking-wide mb-8">All Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredProducts?.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <Card className="cursor-pointer group hover:shadow-lg transition-all duration-500 border-0 bg-transparent">
                <div className="aspect-square overflow-hidden rounded-lg relative">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 right-4 bg-primary/90 text-white px-3 py-1 rounded-full text-sm font-medium tracking-wider">
                    {product.productCode}
                  </span>
                </div>
                <CardContent className="px-2 pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-light tracking-wide group-hover:text-primary transition-colors">
                      {product.name}
                    </h2>
                    <span className="text-xs font-medium text-primary/80 tracking-wider uppercase">
                      {product.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 font-light">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-light">
                      {formatPrice(product.price)}
                    </p>
                    <ShoppingBag className="h-5 w-5 text-primary/60 group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}