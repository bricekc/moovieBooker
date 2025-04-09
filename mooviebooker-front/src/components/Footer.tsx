
import { Film, Github, Mail, Twitter } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-card text-card-foreground border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2">
              <Film className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">MoovieBooker</span>
            </div>
            <p className="mt-2 text-muted-foreground">
              Votre plateforme simple et intuitive pour réserver vos places de cinéma en ligne.
              Découvrez les films à l'affiche et planifiez votre prochaine sortie en quelques clics !
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-medium mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li><a href="/movies" className="text-muted-foreground hover:text-foreground transition-colors">Films</a></li>
              <li><a href="/reservations" className="text-muted-foreground hover:text-foreground transition-colors">Mes Réservations</a></li>
              <li><a href="/register" className="text-muted-foreground hover:text-foreground transition-colors">Créer un compte</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-medium mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@mooviebooker.com</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Twitter className="h-4 w-4" />
                <span>@mooviebooker</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Github className="h-4 w-4" />
                <span>github.com/mooviebooker</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {year} MoovieBooker. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
