import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";

export default function Catalog() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="py-12 px-4 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Modern Furniture Collection
        </h1>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Discover our curated selection of contemporary furniture pieces that blend
          style with functionality.
        </p>
      </header>

      <main className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    {product.description}
                  </p>
                  <p className="mt-4 font-medium">
                    ${(product.price / 100).toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
