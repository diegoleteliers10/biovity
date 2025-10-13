import { Search, MapPin, Briefcase } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card } from '../../ui/card';

export function Hero() {
  return (
    <section className="relative min-h-[800px] md:min-h-[600px] flex items-center pt-16">
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Donde el talento y la
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent"> ciencia </span>
            se encuentran
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Conectamos a los mejores profesionales con oportunidades 
            innovadoras en biotecnología, bioquímica, química, ingeniería química y salud.
          </p>

          {/* Search form */}
          <Card className="p-6 max-w-4xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input 
                  placeholder="¿Qué puesto buscas?" 
                  className="pl-10 h-12 border-0 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input 
                  placeholder="¿Dónde?" 
                  className="pl-10 h-12 border-0 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
              <Button size="lg" className="h-12 px-8 bg-gray-900 hover:bg-gray-800 text-white border-0 shadow-sm hover:shadow-md transition-all">
                <Search className="w-5 h-5 mr-2" />
                Buscar
              </Button>
            </div>
          </Card>

          {/* Quick actions */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white">
              <Briefcase className="w-4 h-4 mr-2" />
              Para Profesionales
            </Button>
            <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white">
              <Search className="w-4 h-4 mr-2" />
              Para Empresas
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}